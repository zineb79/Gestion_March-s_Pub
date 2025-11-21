import React, { useState, useEffect } from "react";
import { Table, Modal, Input, FloatButton, Form, DatePicker, message, Tag } from "antd";
import { EditOutlined, PlusOutlined, FileWordOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getDecomptes, deleteDecompte, updateDecompte } from "../../../services/DecompteService";
import { getMarches } from "../../../services/MarcheService";
import { getSocietes } from "../../../services/SocieteService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { Decompte } from "../../../services/DecompteService";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import { DocumentService } from "../../../services/DocumentService";

const List_Decomptes = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingDecompte, setEditingDecompte] = useState<Decompte | null>(null);
  const [dataSource, setDataSource] = useState<Decompte[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

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

        // Enrichir les notifications avec les marchés complets (incluant les sociétés)
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
  

  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: ["marche", "numOrdre"],
      key: "marche",
      render: (text: string, record: Decompte) => (
        <Tag color="blue">{record.marche?.numOrdre || "N/A"}</Tag>
      ),
    },
    {
      title: "Numéro de Decompte",
      dataIndex: "numOrdre_D",
      key: "numOrdre",
    },
    {
      title: "Société",
      key: "societe",
      render: (record: Decompte) => (
        record.marche?.societe_obj?.raisonSociale || "N/A"
      ),
    },
    {
      title: "Acompte",
      dataIndex: "aCompte",
      key: "aCompte",
    },
    {
      title: "Somme Decompte",
      dataIndex: "somme_D",
      key: "somme_D",
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: Decompte) => (
        <div style={{ display: "flex", gap: "12px" }}>
          <EditOutlined 
            onClick={() => onEditDecompte(record)} 
            style={{ color: "#1890ff", cursor: "pointer" }} 
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
          onClick={() => navigate("/Add_Decompte")}
          tooltip="Ajouter un decompte"
        />
        
        <div className="list-header">
          <h2 className="list-title">Liste des Decomptes</h2>
        </div>
        
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_D"
          loading={loading}
          bordered
          pagination={{ pageSize: 10 }}
        />
        
        <Modal
          title="Modifier le décompte"
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setEditingDecompte(null);
          }}
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

export default List_Decomptes;