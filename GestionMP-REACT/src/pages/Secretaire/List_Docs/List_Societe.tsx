import { useState, useEffect } from 'react';
import { Table, Modal, Form, Input, FloatButton, message } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import '../PagesSec.css';
import Sidebar from '../../../components/Sidebar/Sidebar_Sec';
import { deleteSociete, getSocietes, updateSociete } from '../../../services/SocieteService';

interface Societe {
  id_SO: number;
  raisonSociale: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  idFiscale: string;
}

const List_Societe = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingSociete, setEditingSociete] = useState<Societe | null>(null);
  const [dataSource, setDataSource] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSocietes = async () => {
      try {
        const data = await getSocietes();
        setDataSource(data);
      } catch (error) {
        console.error('Error fetching sociétés:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSocietes();
  }, []);

  const columns = [
    {
      title: 'Raison sociale',
      dataIndex: 'raisonSociale',
      key: 'raisonSociale',
      sorter: (a: Societe, b: Societe) => a.raisonSociale.localeCompare(b.raisonSociale),
    },
    {
      title: 'Adresse',
      dataIndex: 'adresse',
      key: 'adresse',
    },
    {
      title: 'Ville',
      dataIndex: 'ville',
      key: 'ville',
    },
    {
      title: 'Téléphone',
      dataIndex: 'telephone',
      key: 'telephone',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'ID Fiscal',
      dataIndex: 'idFiscale',
      key: 'idFiscale',
    },
    {
      title: 'Actions',
      key: 'action',
      render: (record: Societe) => (
        <>
          <EditOutlined
            onClick={() => onEditSociete(record)}
            style={{ color: "blue", marginRight: 12 }}
          />
          <DeleteOutlined
            onClick={() => onDeleteSociete(record)}
            style={{ color: "red" }}
          />
        </>
      ),
    },
  ];

  const onEditSociete = (record: Societe) => {
    setIsEditing(true);
    setEditingSociete(record);
    form.setFieldsValue({
      raisonSociale: record.raisonSociale,
      adresse: record.adresse,
      ville: record.ville,
      telephone: record.telephone,
      email: record.email,
      idFiscale: record.idFiscale,
    });
  };

  const onDeleteSociete = async (record: Societe) => {
    try {
      await deleteSociete(record.id_SO);
      message.success('Société supprimée avec succès');
      setDataSource(dataSource.filter(item => item.id_SO !== record.id_SO));
    } catch (error) {
      console.error("Erreur lors de la suppression de la société :", error);
      message.error("Erreur lors de la suppression de la société");
    }
  };

  const handleSave = async () => {
    try {
      if (!editingSociete) return;

      const updatedSociete = await updateSociete(editingSociete.id_SO, {
        ...editingSociete,
        raisonSociale: form.getFieldValue('raisonSociale'),
        adresse: form.getFieldValue('adresse'),
        ville: form.getFieldValue('ville'),
        telephone: form.getFieldValue('telephone'),
        email: form.getFieldValue('email'),
        idFiscale: form.getFieldValue('idFiscale'),
      });
      const newData = await getSocietes();
      setDataSource(newData);
      message.success('Société mise à jour avec succès');
      resetEditing();
      setIsEditing(false);
      setEditingSociete(null);
    } catch (error) {
      console.error("Erreur lors de la mise à jour de la société :", error);
      message.error("Erreur lors de la mise à jour de la société");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingSociete(null);
    form.resetFields();
  };

  return (
    <Sidebar>
      <div className="list-container">
        <h1>Liste des sociétés</h1>
        <FloatButton icon={<PlusOutlined />} onClick={() => navigate("/Add_Societe")} />
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_SO"
          loading={loading}
        />
        <Modal
          open={isEditing}
          onCancel={resetEditing}
          onOk={handleSave}
          title="Modifier la société"
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="raisonSociale"
              label="Raison sociale"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="adresse"
              label="Adresse"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="ville"
              label="Ville"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="telephone"
              label="Téléphone"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="idFiscale"
              label="Identifiant fiscal"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default List_Societe;
