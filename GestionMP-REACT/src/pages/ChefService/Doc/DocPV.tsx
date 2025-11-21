import React, { useState, useEffect } from "react";
import {
  Table, Modal, Input, FloatButton, Form, DatePicker, Select,
  message, Tag, Card, Statistic, Row, Col, App
} from "antd";
import {
  EditOutlined, PlusOutlined, FileWordOutlined,
  SearchOutlined, FileDoneOutlined, FileSyncOutlined, FileProtectOutlined,
  DeleteOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_CS";
import { getMarches, Marche } from "../../../services/MarcheService";
import { getSocietes, Societe } from "../../../services/SocieteService";
import { DocumentService } from '../../../services/DocumentService';
import { 
  deletePvReception,
  getPvReceptions, PvReception, TypePvReception, updatePvReception 
} from "../../../services/PvReceptionService";
import dayjs from "dayjs";

const List_PvReceptions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPV, setEditingPV] = useState<PvReception | null>(null);
  const [dataSource, setDataSource] = useState<PvReception[]>([]);
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
        const [pvData, marchesData, societesData] = await Promise.all([
          getPvReceptions(),
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

        // Enrichir les PV avec les marchés complets (incluant les sociétés)
        const enrichedData = pvData.map(pv => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === pv.idMarche_PVR);
          return {
            ...pv,
            marche_PVR_obj: marche
          };
        });

        console.log("Données enrichies:", enrichedData);
        setDataSource(enrichedData);
        setMarches(marchesWithSocietes);
        setSocietes(societesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcul des statistiques
  const totalPV = dataSource.length;
  const totalProvisoire = dataSource.filter(pv => pv.type_PVR === TypePvReception.PROVISOIRE).length;
  const totalDefinitif = dataSource.filter(pv => pv.type_PVR === TypePvReception.DEFINITIVE).length;

  const filteredData = dataSource.filter(item =>
    item.idMarche_PVR?.toString().includes(searchText.toLowerCase()) ||
    item.type_PVR?.toLowerCase().includes(searchText.toLowerCase()) ||
    item.marche_PVR_obj?.societe_obj?.raisonSociale?.toLowerCase().includes(searchText.toLowerCase())
  );

  const onDeletePvReception = async (record: PvReception) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce PV de réception ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deletePvReception(record.id_PVR!);
          setDataSource((pre) =>
            pre.filter((ao) => ao.id_PVR !== record.id_PVR)
          );
          message.success("Le PV de réception a été supprimé avec succès");
        } catch (error) {
          console.error(
            "Erreur lors de la suppression du PV de réception :",
            error
          );
          alert(
            "Impossible de supprimer le PV de réception. Veuillez réessayer plus tard."
          );
        }
      },
    });
  };

  const onEditPV = (record: PvReception) => {
    setIsEditing(true);
    setEditingPV({ ...record });
    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, 'YYYY-MM-DD') : null,
    });
  };

  const handleSave = async (values: any) => {
    if (!editingPV || !editingPV.id_PVR) {
      message.error("ID de l'ordre de service manquant");
      return;
    }
    try {
      const updatedPV = {
        ...editingPV,
        ...values,
        date: values.date?.format('YYYY-MM-DD'),
      };
  
      await updatePvReception(updatedPV);
      const [newData, marchesData, societesData] = await Promise.all([
        getPvReceptions(),
        getMarches(),
        getSocietes()
      ]);

      // Mettre à jour les données avec les sociétés
      const marchesWithSocietes = marchesData.map(marche => {
        const societe = societesData.find(s => s.id_SO === marche.idSociete);
        return { ...marche, societe_obj: societe };
      });

      const enrichedData = newData.map(pv => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === pv.idMarche_PVR);
        return { ...pv, marche_PVR_obj: marche };
      });

      setDataSource(enrichedData);  
      setMarches(marchesWithSocietes);
      setSocietes(societesData);
      
      setIsEditing(false);
      setEditingPV(null);
      message.success("PV de réception mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour du PV de réception");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingPV(null);
    form.resetFields();
  };

  const generateDocument = async (PVR: PvReception) => {
    try {
      await DocumentService.generatePVDeReceptionDocument(PVR);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  };

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: "numOrdreMarche",
      key: "numOrdreMarche",
      render: (text: string | undefined) => <Tag color="blue">{text || "N/A"}</Tag>
    },
    {
      title: "Type",
      dataIndex: "type_PVR",
      key: "type_PVR",
      render: (type: TypePvReception) => (
        <Tag color={type === TypePvReception.PROVISOIRE ? "orange" : "green"}>
          {type === TypePvReception.PROVISOIRE ? "Provisoire" : "Définitif"}
        </Tag>
      ),
      sorter: (a: PvReception, b: PvReception) =>
        (a.type_PVR || "").localeCompare(b.type_PVR || "")
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "-",
      sorter: (a: PvReception, b: PvReception) =>
        (a.date || "").localeCompare(b.date || "")
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PvReception) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <EditOutlined
            onClick={() => onEditPV(record)}
            style={{ color: "green", cursor: "pointer" }}
          />
          <DeleteOutlined
            onClick={() => onDeletePvReception(record)}
            style={{ color: "red", marginLeft: 12, cursor: 'pointer' }}
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)}
            style={{ color: "purple", cursor: "pointer" }} 
          />
        </div>
      ),
    },
  ];

  return (
    <App>
      <Sidebar>
        <div className="list-container" style={{ padding: '20px' }}>
        <Card
          title="Pv de Réception"
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
                    title="Total PV"
                    value={totalPV}
                    prefix={<FileProtectOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title="PV Provisoires"
                    value={totalProvisoire}
                    valueStyle={{ color: '#faad14' }}
                    prefix={<FileSyncOutlined />}
                  />
                </Card>
              </Col>
              <Col span={8}>
                <Card bordered={false}>
                  <Statistic
                    title="PV Définitifs"
                    value={totalDefinitif}
                    valueStyle={{ color: '#52c41a' }}
                    prefix={<FileDoneOutlined />}
                  />
                </Card>
              </Col>
            </Row>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <Input
                placeholder="Rechercher par numéro, société ou type"
                prefix={<SearchOutlined />}
                style={{ width: '300px' }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
              <FloatButton
                icon={<PlusOutlined />}
                onClick={() => navigate("/AddPv")}
                tooltip="Ajouter un PV de réception"
              />
            </div>

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey="id_PVR"
              loading={loading}
              style={{ marginTop: '20px' }}
              bordered
              pagination={{ pageSize: 10 }}
            />
          </Card>

          <Modal
            title="Modifier le PV de réception"
            open={isEditing}
            onCancel={resetEditing}
            onOk={() => form.submit()}
            width={600}
            destroyOnClose
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label="Numéro de marché">
                <Input 
                  value={editingPV?.idMarche_PVR || '-'} 
                  disabled 
                />
              </Form.Item>
              <Form.Item label="Société">
                <Input 
                  value={editingPV?.marche_PVR_obj?.societe_obj?.raisonSociale || 'N/A'} 
                  disabled 
                />
              </Form.Item>
              <Form.Item name="idMarche" hidden>
                <Input />
              </Form.Item>

              <Form.Item
                name="type_PVR"
                label="Type"
                rules={[
                  { required: true, message: "Veuillez sélectionner un type" },
                ]}
              >
                <Select
                  style={{ width: "100%" }}
                  options={[
                    { value: TypePvReception.PROVISOIRE, label: "Provisoire" },
                    { value: TypePvReception.DEFINITIVE, label: "Définitif" },
                  ]}
                />
              </Form.Item>
              <Form.Item
                name="date"
                label="Date de réception"
                rules={[
                  { required: true, message: "Veuillez sélectionner la date" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Sidebar>
    </App>
  );
};

export default List_PvReceptions;