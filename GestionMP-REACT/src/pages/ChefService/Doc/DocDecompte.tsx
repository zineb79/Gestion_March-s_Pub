import React, { useState, useEffect } from "react";
import {
  Table, Modal, Input, FloatButton, Form, DatePicker, Select,
  message, Tag, Card, Statistic, Row, Col
} from "antd";
import {
  EditOutlined, DeleteOutlined, PlusOutlined,
  FileWordOutlined, SearchOutlined,
  FileDoneOutlined, FileSyncOutlined, FileProtectOutlined
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_CS";
import {
  getDecomptes, deleteDecompte, updateDecompte
} from "../../../services/DecompteService";
import dayjs from "dayjs";
import { getSocietes, Societe } from "../../../services/SocieteService";
import { getMarches, Marche } from "../../../services/MarcheService";
import { Decompte } from "../../../services/DecompteService";
import { DocumentService } from "../../../services/DocumentService";

const DocDecompte = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDecompte, setEditingDecompte] = useState<Decompte | null>(null);
  const [dataSource, setDataSource] = useState<Decompte[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [decomptesData, marchesData, societesData] = await Promise.all([
          getDecomptes(),
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

        // Enrichir les décomptes avec les marchés complets (incluant les sociétés)
        const enrichedData = decomptesData.map(decompte => {
          const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
          return {
            ...decompte,
            marche: marche
          };
        }).filter(decompte => decompte.marche);

        setDataSource(enrichedData);
        setMarches(marchesWithSocietes);
        setSocietes(societesData);
      } catch (error) {
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Calcul des statistiques
  const totalDecomptes = dataSource.length;
  const totalSomme = dataSource.reduce((sum, item) => sum + (item.somme_D || 0), 0);
  const totalAcompte = dataSource.reduce((sum, item) => sum + (item.aCompte || 0), 0);

  const filteredData = dataSource.filter(item =>
    item.numOrdre_D?.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.marche?.numOrdre && item.marche.numOrdre.toLowerCase().includes(searchText.toLowerCase()))
  );

  const onDeleteDecompte = async (record: Decompte) => {
    if (!record.id_D) return;
    
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer ce decompte ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteDecompte(record.id_D!);
          setDataSource(prev => prev.filter(item => item.id_D !== record.id_D));
          message.success("Decompte supprimé avec succès");
        } catch (error) {
          console.error("Erreur lors de la suppression:", error);
          message.error("Échec de la suppression");
        }
      },
    });
  };

  const onEditDecompte = (record: Decompte) => {
    setIsEditing(true);
    setEditingDecompte(record);
    form.setFieldsValue({
      ...record
    });
  };

  const handleSave = async (values: any) => {
    if (!editingDecompte?.id_D) {
      message.error("ID du decompte manquant");
      return;
    }
  
    try {
      const updatedDecompte = {
        ...editingDecompte,
        ...values
      };
  
      await updateDecompte(updatedDecompte);
      
      const [decomptesData, marchesData, societesData] = await Promise.all([
        getDecomptes(),
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
  
      // Associer decompte -> marche (qui contient societe)
      const enrichedData = decomptesData.map(decompte => {
        const marche = marchesWithSocietes.find(m => m.id_Marche === decompte.idMarche);
        return {
          ...decompte,
          marche: marche
        };
      }).filter(decomptes => decomptes.marche);
  
      setDataSource(enrichedData);
      setIsEditing(false);
      setEditingDecompte(null);
      message.success("Decompte mise à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingDecompte(null);
  };

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: ["marche", "numOrdre"],
      key: "marche",
      render: (text: string, record: Decompte) => (
        <Tag color="blue">{record.marche?.numOrdre || "N/A"}</Tag>
      ),
      sorter: (a: Decompte, b: Decompte) =>
        (a.marche?.numOrdre || "").localeCompare(b.marche?.numOrdre || "")
    },
    {
      title: "Numéro de Decompte",
      dataIndex: "numOrdre_D",
      key: "numOrdre_D",
    },
    {
      title: "Société",
      key: "societe",
      render: (record: Decompte) => (
        record.marche?.societe_obj?.raisonSociale || "N/A"
      ),
      sorter: (a: Decompte, b: Decompte) =>
        (a.marche?.societe_obj?.raisonSociale || "").localeCompare(
          b.marche?.societe_obj?.raisonSociale || ""
        )
    },
    {
      title: "Acompte",
      dataIndex: "aCompte",
      key: "aCompte",
      render: (value: number) => `${value?.toLocaleString()} ` || "-",
    },
    {
      title: "Somme Decompte",
      dataIndex: "somme_D",
      key: "somme_D",
      render: (value: number) => `${value?.toLocaleString()} ` || "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Decompte) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <EditOutlined 
            onClick={() => onEditDecompte(record)} 
            style={{ color: "green", cursor: "pointer" }} 
          />
          <DeleteOutlined 
            onClick={() => onDeleteDecompte(record)} 
            style={{ color: "red", cursor: "pointer" }} 
          />
        </div>
      )
    }
  ];

  return (
    <Sidebar>
      <div className="list-container" style={{ padding: '20px' }}>
      <Card
        title="Décomptes"
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
                  title="Total Décomptes"
                  value={totalDecomptes}
                  prefix={<FileProtectOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Somme"
                  value={totalSomme.toLocaleString()}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<FileDoneOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Total Acompte"
                  value={totalAcompte.toLocaleString()}
                  valueStyle={{ color: '#1890ff' }}
                  prefix={<FileSyncOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Input
              placeholder="Rechercher par numéro de marché ou décompte"
              prefix={<SearchOutlined />}
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            <FloatButton
              icon={<PlusOutlined />}
              onClick={() => navigate("/AddDecompte")}
              tooltip="Ajouter un décompte"
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id_D"
            loading={loading}
            style={{ marginTop: '20px' }}
            bordered
            pagination={{ pageSize: 10 }}
          />
        </Card>

        <Modal
          title="Modifier le décompte"
          open={isEditing}
          onCancel={resetEditing}
          onOk={() => form.submit()}
          width={600}
          destroyOnClose
        >
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item label="Numéro de Décompte" name="numOrdre_D">
              <Input disabled />
            </Form.Item>

            <Form.Item label="Numéro de Marché">
              <Input 
                value={editingDecompte?.marche?.numOrdre || "N/A"} 
                disabled 
              />
            </Form.Item>

            <Form.Item label="Société">
              <Input 
                value={editingDecompte?.marche?.societe_obj?.raisonSociale || "N/A"} 
                disabled 
              />
            </Form.Item>

            <Form.Item
              label="Acompte"
              name="aCompte"
              rules={[{ required: true, message: "Veuillez saisir l'acompte" }]}
            >
              <Input type="number" />
            </Form.Item>

            <Form.Item
              label="Somme Décompte"
              name="somme_D"
              rules={[{ required: true, message: "Veuillez saisir la somme" }]}
            >
              <Input type="number" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default DocDecompte;