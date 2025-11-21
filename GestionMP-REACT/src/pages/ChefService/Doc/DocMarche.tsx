import React, { useState, useEffect } from 'react';
import { Table, Modal, Input, FloatButton, Form, Select, DatePicker, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { Marche } from '../../../services/MarcheService';
import dayjs from 'dayjs'; 
import Sidebar from '../../../components/Sidebar/Sidebar_CS';
import { getMarches, updateMarche } from '../../../services/MarcheService';
import { App } from 'antd';

const DocMarche = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMarche, setEditingMarche] = useState<Marche | null>(null);
  const [dataSource, setDataSource] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [statuts, setStatuts] = useState<string[]>([]);
  const { message } = App.useApp();

  // Charger les marchés depuis l'API
  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getMarches();
        setDataSource(data as Marche[]);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onEditMarche = (record: Marche) => {
    setIsEditing(true);
    setEditingMarche(record);
    form.setFieldsValue({
      ...record,
      delaisMarche: record.delaisMarche ? dayjs(record.delaisMarche) : null,
      statut: record.statut,
      type_Marche: record.type_Marche
    });
  };

  const handleSave = async (values: any) => {
    try {
      if (!editingMarche) {
        message.error("ID du marché manquant");
        return;
      }

      if (!editingMarche.id_Marche) {
        message.error('ID du marché manquant');
        return;
      }

      // Prepare the data to send to backend
      const updatedMarche = {
        id_Marche: editingMarche.id_Marche,
        numOrdre: editingMarche.numOrdre,
        type_Marche: values.type_Marche,
        objet_marche: values.objet_marche,
        statut: values.statut,
        delaisMarche: values.delaisMarche ? values.delaisMarche.format('YYYY-MM-DD') : null,
        delaisGarantie: values.delaisGarantie,
        chefServiceConcerne: values.chefServiceConcerne,
        serviceConcerne: values.serviceConcerne,
        montantFinal: values.montantFinal,
        isArchived: values.isArchived
      };

      await updateMarche(editingMarche.id_Marche, updatedMarche);
      
      setDataSource((pre) =>
        pre.map((marche) =>
          marche.id_Marche === updatedMarche.id_Marche ? updatedMarche : marche
        )
      );
      
      setIsEditing(false);
      setEditingMarche(null);
      message.success('Marché mis à jour avec succès');
    } catch (error) {
      message.error('Erreur lors de la mise à jour du marché');
    }
  };

  const columns = [
    {
      key: "1",
      title: "Numéro de marché",
      dataIndex: "numOrdre",
    },
    {
      key: "2",
      title: "Type de marché",
      dataIndex: "type_Marche",
    },
    {
      key: "3",
      title: "Objet de marché",
      dataIndex: "objet_marche",
    },
    {
      key: "4",
      title: "Délais du marché",
      dataIndex: "delaisMarche",
      render: (date: string) => {
        // Si la date est déjà au format DD/MM/YYYY, on l'affiche directement
        if (date && date.match(/^\d{2}\/\d{2}\/\d{4}$/)) {
          return date;
        }
        // Sinon, on la formate avec dayjs
        return date ? dayjs(date).format('DD/MM/YYYY') : 'N/A';
      }
    },
    {
      key: "5",
      title : "Service concerné",
      dataIndex: "serviceConcerne",
    },
    {
      key: "5",
      title: "Statut",
      dataIndex: "statut",
      render : (statut : string) => {
        let color = 'default';
        switch (statut) {
          case 'EnCoursTraitement':
            color = 'blue';
            break;
          case 'Adjuge':
            color = 'green';
            break;
          case 'EnCoursApprobation':
            color = 'purple';
            break;
          case 'EnArret':
            color = 'orange';
            break;
          case 'Notifie':
            color = 'red';
            break;
          case 'EnCoursDeVisa':
            color = 'volcano';
            break;
          case 'EnCoursDExecution':
            color = 'volcano';
            break;
          case 'HorsDelaisMarche':
            color = 'red';
            break;
          case 'Acheve':
            color = 'green';
            break;
          case 'Cloture':
            color = 'gold';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{statut}</Tag>;
      },
      filters: loading ? [] : statuts.map(statut => ({
        text: statut,
        value: statut
      }))
    },
    {
      key: "6",
      title: "Actions",
      render: (record: Marche) => (
        <>
          <EditOutlined
            onClick={() => onEditMarche(record)}
            style={{ color: "blue", marginRight: 12 }}
          />
        </>
      ),
    },
  ];

  return (
    <Sidebar>
      <div className="list-container">
        <FloatButton
          icon={<PlusOutlined />}
          onClick={() => navigate("/AddMarche")}
          style={{ right: '24px', backgroundColor: 'black !important' }}
        />
        <div className="list-header">
          <h2 className="list-title">Liste des Marchés</h2>
        </div>
        <Table
          columns={columns}
          dataSource={dataSource}
          rowKey="id_Marche"
          loading={loading}
        />
        <Modal
          title="Modifier le marché"
          open={isEditing}
          onCancel={() => {
            setIsEditing(false);
            setEditingMarche(null);
          }}
          onOk={form.submit}
        >
          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="numOrdre"
              label="Numéro de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="type_Marche"
              label="Type de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Select>
                <Select.Option value="TRAVAUX">TRAVAUX</Select.Option>
                <Select.Option value="FOURNITURE">FOURNITURE</Select.Option>
                <Select.Option value="PRESTATION_SERVICE">PRESTATION_SERVICE</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="objet_marche"
              label="Objet de marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="delaisMarche"
              label="Délais du marché"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <DatePicker
                format="DD/MM/YYYY"
                placeholder="Sélectionner la date du délai du marché"
                className="date-picker-container"
              />
            </Form.Item>

            <Form.Item
              name="serviceConcerne"
              label="Service concerné"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Select placeholder="Sélectionner le service concerné">
                <Select.Option value="Service_AdministrationGeneral">Service Administration Générale</Select.Option>
                <Select.Option value="Service_MarchePublic">Service Marché Public</Select.Option>
                <Select.Option value="Service_GestionCourrier">Service Gestion Courrier</Select.Option>
                <Select.Option value="Service_SuiviTravaux">Service Suivi Travaux</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="statut"
              label="Statut"
              rules={[{ required: true, message: "Champ obligatoire" }]}
            >
              <Select>
                <Select.Option value="EnCoursTraitement">En Cours</Select.Option>
                <Select.Option value="EnCoursApprobation">Cloture</Select.Option>
                <Select.Option value="Adjuge">Valide</Select.Option>
                <Select.Option value="EnCoursDExecution">En Cours d'Execution</Select.Option>
                <Select.Option value="EnArret">Arret</Select.Option>
                <Select.Option value="Acheve">Acheve</Select.Option>
                <Select.Option value="HorsDelaisMarche">Hors delai</Select.Option>
                <Select.Option value="Cloture">Cloture</Select.Option>
                <Select.Option value="EnCoursDeVisa">En Cours de Visa</Select.Option>
                <Select.Option value="Notifie">Notifie</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default DocMarche;