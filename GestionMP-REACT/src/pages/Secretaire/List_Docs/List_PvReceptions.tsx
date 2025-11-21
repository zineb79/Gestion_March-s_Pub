import React, { useState, useEffect } from "react";
import { getNumOrdreMarche } from "../../../services/MarcheService";
import {
  Table,
  Modal,
  Input,
  FloatButton,
  Form,
  DatePicker,
  Select,
  message,
  App,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getMarches } from "../../../services/MarcheService";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import dayjs from "dayjs";
import { Marche } from "../../../services/MarcheService";
import { DocumentService } from '../../../services/DocumentService';
import { getPvReceptions, PvReception, PvReceptionWithNumOrdre, TypePvReception, updatePvReception } from "../../../services/PvReceptionService";

const List_PvReceptions = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingPV, setEditingPV] = useState<PvReception | null>(null);
  const [dataSource, setDataSource] = useState<PvReception[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const pvData = await getPvReceptions();
        console.log("Données reçues:", pvData);
        setDataSource(pvData);
        const marchesData = await getMarches();
        setMarches(marchesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Erreur de chargement des données");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


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
        date: values.date?.format('YYYY-MM-DD'), // Format ISO pour la base de données
      };
  
      await updatePvReception(updatedPV);
      // ... reste du code
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour de l'ordre de service");
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
  } 
  const columns = [
    {
      title: "Numéro de Marché",
      dataIndex: "numOrdreMarche",
      key: "numOrdreMarche",
      render: (text: string | undefined) => <Tag color="blue">{text || "N/A"}</Tag>,
    },
    {
      title: "Type",
      dataIndex: "type_PVR",
      key: "type_PVR",
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (date: string) =>
        date ? dayjs(date).format("DD/MM/YYYY") : "-",
      sorter: (a: PvReception, b: PvReception) =>
        (a.date || "").localeCompare(b.date || ""),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: PvReception) => (
        <>
          <EditOutlined
            onClick={() => onEditPV(record)}
            style={{ color: "#1890ff", cursor: "pointer" }}
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)}
            style={{ color: "purple", marginLeft: 14 }} />
        </>
      ),
    },
  ];

  return (
    <App>
      <Sidebar>
        <div className="list-container">
          <FloatButton
            icon={<PlusOutlined />}
            onClick={() => navigate("/Add_Pv")}
            tooltip="Ajouter une pvReception"
          />
          <div className="list-header">
            <h2 className="list-title">Liste des pvReceptions</h2>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_PVR"
            loading={loading}
            bordered
            pagination={{ pageSize: 10 }}
          />
          <Modal
            title="Modifier l'ordre de service"
            open={isEditing}
            onCancel={resetEditing}
            onOk={() => form.submit()}
            width={600}
            destroyOnClose
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label="Numéro de marché">
                <Input value={marches.find(m => m.id_Marche === editingPV?.idMarche_PVR)?.numOrdre || 'N/A'} disabled />
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
                label="Date de pvReception"
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