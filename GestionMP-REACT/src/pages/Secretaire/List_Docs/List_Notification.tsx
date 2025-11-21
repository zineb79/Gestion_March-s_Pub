import React, { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton, Form, DatePicker, message, Tag } from "antd";
import { EditOutlined, PlusOutlined, FileWordOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getNotifications, deleteNotification, updateNotification } from "../../../services/NotifApprService";
import { getMarches } from "../../../services/MarcheService";
import { getSocietes } from "../../../services/SocieteService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { Notification } from "../../../services/NotifApprService";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import { DocumentService } from "../../../services/DocumentService";

const List_Notification = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingNotification, setEditingNotification] = useState<Notification | null>(null);
  const [dataSource, setDataSource] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

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
          return {
            ...marche,
            societe_obj: societe
          };
        });

        // Enrichir les notifications avec les marchés complets (incluant les sociétés)
        const enrichedData = notificationsData.map(notification => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === notification.marche_NOTIF);
          return {
            ...notification,
            marche_NOTIF_obj: marche
          };
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

  const onDeleteNotification = async (record: Notification) => {
    if (!record.id_NOTIF) return;
    
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
      
      const [notifications, marchesData, societesData] = await Promise.all([
        getNotifications(),
        getMarches(),
        getSocietes()
      ]);
  
      // Associer marches avec societes
      const marchesWithSocietes = marchesData.map(marche => {
        const societe = societesData.find(s => s.id_SO === marche.idSociete);
        return {
          ...marche,
          societe_obj: societe
        };
      });
  
      // Associer notification -> marche (qui contient societe)
      const enrichedData = notifications.map(notification => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === notification.marche_NOTIF);
        return {
          ...notification,
          marche_NOTIF_obj: marche
        };
      }).filter(notifications => notifications.marche_NOTIF_obj);
  
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
    },
    {
      title: "Numéro de Notification",
      dataIndex: "numOrdre_NOTIF",
      key: "numOrdre",
    },
    {
      title: "Société",
      key: "societe",
      render: (record: Notification) => (
        record.marche_NOTIF_obj?.societe_obj?.raisonSociale || "N/A"
      ),
    },
    {
      title: "Date de Visa",
      dataIndex: "dateVisa_NOTIF",
      key: "dateVisa",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: Notification, b: Notification) => 
        new Date(a.dateVisa_NOTIF).getTime() - new Date(b.dateVisa_NOTIF).getTime()
    },
    {
      title: "Date d'Approbation",
      dataIndex: "dateApprobation_NOTIF",
      key: "dateApprobation",
      render: (date: string) => date ? dayjs(date).format("DD/MM/YYYY") : "N/A",
      sorter: (a: Notification, b: Notification) => 
        new Date(a.dateApprobation_NOTIF).getTime() - new Date(b.dateApprobation_NOTIF).getTime()
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Notification) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <EditOutlined 
            onClick={() => onEditNotification(record)} 
            style={{ color: "#1890ff", cursor: "pointer" }} 
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)} 
            style={{ color: "#722ed1", cursor: "pointer" }} 
          />
        </div>
      )
    }
  ];

  return (
    <Sidebar>
      <div className="list-container">
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => navigate("/Add_Notification")}
          tooltip="Ajouter une notification"
        />
        
        <div className="list-header">
          <h2 className="list-title">Liste des Notifications</h2>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_NOTIF"
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
        
        <Modal
          title="Modifier la notification"
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setEditingNotification(null);
          }}
          onOk={() => form.submit()}
          width={600}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item label="Numéro de notification" name="numOrdre_NOTIF">
              <Input disabled />
            </Form.Item>
            
            <Form.Item label="Numéro de marché">
              <Input 
                value={editingNotification?.marche_NOTIF_obj?.numOrdre || "N/A"} 
                disabled 
              />
            </Form.Item>
            
            <Form.Item label="Société">
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

export default List_Notification;