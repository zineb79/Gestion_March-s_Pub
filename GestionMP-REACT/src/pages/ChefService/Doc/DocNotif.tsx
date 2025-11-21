import React, { useState, useEffect } from "react";
import {
  Table, Modal, Input, FloatButton, Form, DatePicker,
  message, Tag, Card, Statistic, Row, Col
} from "antd";
import {
  EditOutlined, DeleteOutlined, PlusOutlined,
  FileWordOutlined, SearchOutlined,
  FileDoneOutlined, FileSyncOutlined, FileProtectOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getNotifications, deleteNotification, updateNotification } from "../../../services/NotifApprService";
import { getMarches } from "../../../services/MarcheService";
import { getSocietes } from "../../../services/SocieteService";
import Sidebar from "../../../components/Sidebar/Sidebar_CS";
import dayjs from "dayjs";
import { Notification } from "../../../services/NotifApprService";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import { DocumentService } from "../../../services/DocumentService";

const DocNotif = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [dataSource, setDataSource] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [notificationsData, marchesData, societesData] = await Promise.all([
          getNotifications(),
          getMarches(),
          getSocietes()
        ]);

        // Associer les marchés avec leurs sociétés
        const marchesWithSocietes = marchesData.map(marche => {
          const societe = societesData.find(s => s.id_SO === marche.idSociete);
          return { ...marche, societe_obj: societe };
        });

        // Enrichir les notifications avec les marchés complets
        const enrichedData = notificationsData.map(notification => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === notification.marche_NOTIF);
          return { ...notification, marche_NOTIF_obj: marche };
        }).filter(notification => notification.marche_NOTIF_obj);

        setDataSource(enrichedData);
        setMarches(marchesWithSocietes);
        setSocietes(societesData);
      } catch (error) {
        console.error("Erreur lors du chargement:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcul des statistiques
  const totalNotifications = dataSource.length;
  const today = dayjs().startOf('day');

const notificationsWithVisa = dataSource.filter(n => 
  n.dateVisa_NOTIF && 
  (dayjs(n.dateVisa_NOTIF).isBefore(today) || dayjs(n.dateVisa_NOTIF).isSame(today))
).length;

const notificationsApproved = dataSource.filter(n => 
  n.dateApprobation_NOTIF && 
  (dayjs(n.dateApprobation_NOTIF).isBefore(today) || dayjs(n.dateApprobation_NOTIF).isSame(today))
).length;

  const filteredData = dataSource.filter(item =>
    item.numOrdre_NOTIF?.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.marche_NOTIF_obj?.numOrdre && item.marche_NOTIF_obj.numOrdre.toLowerCase().includes(searchText.toLowerCase()))
  );
/*
  const onDeleteNotification = async (record: Notification) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cette notification ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteNotification(record.id_NOTIF!);
          setDataSource(prev => prev.filter(item => item.id_NOTIF !== record.id_NOTIF));
          message.success("Notification supprimée avec succès");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          message.error("Échec de la suppression");
        }
      },
    });
  };
*/

   const onDeleteNotification = async (record: Notification) => {
      Modal.confirm({
        title: "Êtes-vous sûr de vouloir supprimer cette notification?",
        okText: "Oui",
        okType: "danger",
        onOk: async () => {
          try {
            await deleteNotification(record.id_NOTIF!);
            setDataSource((pre) =>
              pre.filter((ao) => ao.id_NOTIF !== record.id_NOTIF)
            );
            message.success("La notification a été supprimé avec succès");
          } catch (error) {
            console.error(
              "Erreur lors de la suppression de La notification :",
              error
            );
            alert(
              "Impossible de supprimer La notification. Veuillez réessayer plus tard."
            );
          }
        },
      });
    };

  const onEditNotification = (record: Notification) => {
    setIsEditing(true);
    setEditingNotification(record);
    form.setFieldsValue({
      ...record,
      dateVisa_NOTIF: record.dateVisa_NOTIF ? dayjs(record.dateVisa_NOTIF) : null,
      dateApprobation_NOTIF: record.dateApprobation_NOTIF ? dayjs(record.dateApprobation_NOTIF) : null
    });
  };

  const handleSave = async (values: any) => {
    if (!editingNotification?.id_NOTIF) {
      message.error("ID de la notification manquant");
      return;
    }
  
    try {
      const updatedNotification = {
        ...editingNotification,
        ...values,
        dateVisa_NOTIF: values.dateVisa_NOTIF?.format("YYYY-MM-DD"),
        dateApprobation_NOTIF: values.dateApprobation_NOTIF?.format("YYYY-MM-DD")
      };
  
      await updateNotification(editingNotification.id_NOTIF, updatedNotification);
      
      // Rafraîchir les données
      const [notifications, marchesData, societesData] = await Promise.all([
        getNotifications(),
        getMarches(),
        getSocietes()
      ]);
  
      const marchesWithSocietes = marchesData.map(marche => {
        const societe = societesData.find(s => s.id_SO === marche.idSociete);
        return { ...marche, societe_obj: societe };
      }).filter(marche => marche.societe_obj);
  
      const enrichedData = notifications.map(notification => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === notification.marche_NOTIF);
        return { ...notification, marche_NOTIF_obj: marche };
      }).filter(notification => notification.marche_NOTIF_obj);
  
      setDataSource(enrichedData);
      setIsEditing(false);
      setEditingNotification(null);
      message.success("Notification mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour");
    }
  };

  const generateDocument = async (notification: Notification) => {
    try {
      await DocumentService.generateNotificationDocument(notification);
      message.success("Document généré avec succès");
    } catch (error) {
      console.error("Erreur lors de la génération:", error);
      message.error("Échec de la génération du document");
    }
  };

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: ["marche_NOTIF_obj", "numOrdre"],
      key: "marche",
      render: (text: string, record: Notification) => (
        <Tag color="blue">{record.marche_NOTIF_obj?.numOrdre || "N/A"}</Tag>
      ),
      sorter: (a: Notification, b: Notification) => 
        (a.marche_NOTIF_obj?.numOrdre || "").localeCompare(b.marche_NOTIF_obj?.numOrdre || "")
    },
    {
      title: "Société",
      key: "societe",
      render: (record: Notification) => (
        record.marche_NOTIF_obj?.societe_obj?.raisonSociale || "N/A"
      ),
      sorter: (a: Notification, b: Notification) => 
        (a.marche_NOTIF_obj?.societe_obj?.raisonSociale || "").localeCompare(
          b.marche_NOTIF_obj?.societe_obj?.raisonSociale || ""
        )
    },
    {
      title: "Numéro de Notification",
      dataIndex: "numOrdre_NOTIF",
      key: "numOrdre",
      sorter: (a: Notification, b: Notification) => a.numOrdre_NOTIF.localeCompare(b.numOrdre_NOTIF)
    },
    {
      title: "Date de Visa",
      dataIndex: "dateVisa_NOTIF",
      key: "dateVisa",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: Notification, b: Notification) => 
        (a.dateVisa_NOTIF || "").localeCompare(b.dateVisa_NOTIF || "")
    },
    {
      title: "Date d'Approbation",
      dataIndex: "dateApprobation_NOTIF",
      key: "dateApprobation",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: Notification, b: Notification) => 
        (a.dateApprobation_NOTIF || "").localeCompare(b.dateApprobation_NOTIF || "")
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Notification) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <EditOutlined 
            onClick={() => onEditNotification(record)} 
            style={{ color: "green", cursor: "pointer" }} 
          />
          <DeleteOutlined
            onClick={() => onDeleteNotification(record)}
            style={{ color: "red", cursor: "pointer" }}
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)} 
            style={{ color: "blue", cursor: "pointer" }} 
          />
        </div>
      )
    }
  ];

  return (
    <Sidebar>
      <div className="list-container" style={{ padding: '20px' }}>
        <Card
        title="Notifications"
        style={{
          marginBottom: '20px',
          backgroundColor: 'var(--card-bg)',
          color: 'var(--text-color)',
        }}
        headStyle={{
          backgroundColor: 'var(--card-header-bg)',
          color: 'var(--text-color)',
          borderBottom: '1px solid var(--border-color)',
        }}
      >
          {/* Cartes de statistiques */}
          <Row gutter={16} style={{ marginBottom: '20px' }}>
  <Col span={8}>
    <Card bordered={false}>
      <Statistic
        title="Total Notifications"
        value={totalNotifications}
        prefix={<FileProtectOutlined />}
      />
    </Card>
  </Col>
  <Col span={8}>
    <Card bordered={false}>
      <Statistic
        title="Visa (à ce jour)"
        value={notificationsWithVisa}
        prefix={<FileDoneOutlined />}
        valueStyle={{ color: '#3f8600' }}
      />
    </Card>
  </Col>
  <Col span={8}>
    <Card bordered={false}>
      <Statistic
        title="Approuvées (à ce jour)"
        value={notificationsApproved}
        prefix={<FileSyncOutlined />}
        valueStyle={{ color: '#1890ff' }}
      />
    </Card>
  </Col>
</Row>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Rechercher par numéro de marché ou notification"
              prefix={<SearchOutlined />}
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FloatButton
              icon={<PlusOutlined />}
              onClick={() => navigate("/AddNotification")}
              tooltip="Ajouter une notification"
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id_NOTIF"
            loading={loading}
            style={{ marginTop: '20px' }}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal
          title="Modifier la notification"
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setEditingNotification(null);
          }}
          onOk={() => form.submit()}
          width={600}
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item label="Numéro de notification" name="numOrdre_NOTIF">
              <Input disabled />
            </Form.Item>
            
            <Form.Item label="Marché associé">
              <Input 
                value={editingNotification?.marche_NOTIF_obj?.numOrdre || "N/A"} 
                disabled 
              />
            </Form.Item>
            
            <Form.Item label="Société associée">
              <Input 
                value={editingNotification?.marche_NOTIF_obj?.societe_obj?.raisonSociale || "N/A"} 
                disabled 
              />
            </Form.Item>
            
            <Form.Item label="Date de visa" name="dateVisa_NOTIF">
              <DatePicker 
                style={{ width: "100%" }} 
                format="DD/MM/YYYY" 
              />
            </Form.Item>
            
            <Form.Item label="Date d'approbation" name="dateApprobation_NOTIF">
              <DatePicker 
                style={{ width: "100%" }} 
                format="DD/MM/YYYY" 
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default DocNotif;