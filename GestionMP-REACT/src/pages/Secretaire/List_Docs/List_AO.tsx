import React, { useState, useEffect } from "react";
import {
  Table,
  Modal,
  Input,
  FloatButton,
  Form,
  DatePicker,
  Select,
  message,
  TimePicker,
  Tag,
  App,
} from "antd";
import {
  EditOutlined,
  PlusOutlined,
  FileWordOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import "../PagesSec.css";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import {
  deleteAppelOffre,
  getAppelsOffre,
  updateAppelOffre,
} from "../../../services/AOService";
import dayjs from "dayjs";
import { DocumentService } from "../../../services/DocumentService";
import { AppelOffre } from "../../../services/AOService";
import { getMarches, Marche } from "../../../services/MarcheService";

const List_AO = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppelOffre, setEditingAppelOffre] = useState<AppelOffre | null>(
    null
  );
  const [dataSource, setDataSource] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
   const [marches, setMarches] = useState<Marche[]>([]);
  const [statuts, setStatuts] = useState<string[]>([]);
  const [loadingStatuts, setLoadingStatuts] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);

  // Charger les appels d'offre depuis l'API
useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const [appelsData, marchesData] = await Promise.all([
        getAppelsOffre(), 
        getMarches()
      ]);

      // Associer les marchés aux appels d'offre
      const enrichedData = appelsData.map((appel) => {
        const marche = marchesData.find(
          (m) => m.id_Marche === appel.idMarche 
        );
        
        return {
          ...appel,
          marche_AO_obj: marche,
          idMarche: marche?.id_Marche || appel.idMarche,
        } as AppelOffre;
      }).filter(appel => appel.marche_AO_obj);

      setDataSource(enrichedData);
      setMarches(marchesData);
    } catch (error) {
      message.error("Erreur de chargement des données");
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  /*const onDeleteAppelOffre = async (record: AppelOffre) => {
    Modal.confirm({
      title: "Êtes-vous sûr de vouloir supprimer cet appel d'offre ?",
      okText: "Oui",
      okType: "danger",
      onOk: async () => {
        try {
          await deleteAppelOffre(record.num_Ordre_AO);
          setDataSource((pre) =>
            pre.filter((ao) => ao.num_Ordre_AO !== record.num_Ordre_AO)
          );
          message.success("L'appel d'offre a été supprimé avec succès");
        } catch (error) {
          console.error(
            "Erreur lors de la suppression de l'appel d'offre :",
            error
          );
          alert(
            "Impossible de supprimer l'appel d'offre. Veuillez réessayer plus tard."
          );
        }
      },
    });
  };*/

  const onEditAppelOffre = (record: AppelOffre) => {
    setIsEditModalVisible(true);
    setIsEditing(true);
    setEditingAppelOffre({ ...record });
    
    // Formater correctement l'heure pour le TimePicker
    const heureFormatee = record.heureOuverturePli_AO 
      ? dayjs(record.heureOuverturePli_AO, 'HH:mm') 
      : null;
  
    form.setFieldsValue({
      ...record,
      dateOuverturePli_AO: record.dateOuverturePli_AO ? dayjs(record.dateOuverturePli_AO) : null,
      heureOuverturePli_AO: heureFormatee,
      statut_AO: record.statut_AO
    });
  };

  const handleSave = async () => {
    if (!editingAppelOffre) return;
  
    try {
      if (!editingAppelOffre.id_AO) {
        message.error("ID de l'appel d'offre manquant");
        return;
      }
  
      const payload = {
        ...editingAppelOffre,
        marche_AO_obj: marches.find(m => m.id_Marche === editingAppelOffre.idMarche),
        idMarche: editingAppelOffre.idMarche,
        dateOuverturePli_AO: editingAppelOffre.dateOuverturePli_AO || "",
        heureOuverturePli_AO: editingAppelOffre.heureOuverturePli_AO || "",
      };
      
      await updateAppelOffre(editingAppelOffre.id_AO, payload);
  
      // Refresh the list
      const newData = await getAppelsOffre();
      // enrichir comme dans useEffect
      const enrichedData = newData.map((appel) => {
        const marche = marches.find(m => m.id_Marche === appel.idMarche);
        return { ...appel, marche_AO_obj: marche, idMarche: marche?.id_Marche || appel.idMarche };
      }).filter(appel => appel.marche_AO_obj);
  
      setDataSource(enrichedData);
  
      setEditingAppelOffre(null);
      setIsEditing(false);
      setIsEditModalVisible(false);
      message.success("Appel d'offre mis à jour avec succès");
    } catch (error) {
      message.error("Erreur lors de la mise à jour de l'appel d'offre");
    }
  };
  

  const generateDocument = async (appelOffre: AppelOffre) => {
    try {
      await DocumentService.generateAppelOffreDocument(appelOffre);
      message.success("Document généré avec succès");
    } catch (error) {
      message.error("Erreur lors de la génération du document");
    }
  };

  const columns = [
    {
      key: "0",
      title: "Numéro de marché",
      render: (record: AppelOffre) => {
        if (!record.marche_AO_obj) {
          return '-';
        }
        return <Tag color="blue">{record.marche_AO_obj.numOrdre || record.idMarche || '-'}</Tag>;
      },
    },
    {
      key: "1",
      title: "Numéro d'ordre",
      dataIndex: "num_Ordre_AO",
    },
    {
      key: "2",
      title: "Type d'appel d'offre",
      dataIndex: "type_AO",
      filters: dataSource
        ? [...new Set(dataSource.map(item => item.type_AO))]
          .filter(type => type) // Filtrer les valeurs nulles/undefined
          .map(type => ({
            text: type.charAt(0).toUpperCase() + type.slice(1), // Capitaliser la première lettre
            value: type
          }))
        : [],
      onFilter: (value: any, record: AppelOffre) => record.type_AO === value,
    },
    {
      key: "3",
      title: "Date et heure d'ouverture des plis",
      render: (record: AppelOffre) => {
        const date = record.dateOuverturePli_AO
          ? dayjs(record.dateOuverturePli_AO).format("DD/MM/YYYY")
          : "";
        // Format the hour in HH:mm
        const time = record.heureOuverturePli_AO
          ? dayjs(record.heureOuverturePli_AO, 'HH:mm').format('HH:mm')
          : "";
        return `${date} -- ${time}`;
      },
      sorter: (a: AppelOffre, b: AppelOffre) => {
        const dateA = a.dateOuverturePli_AO
          ? new Date(a.dateOuverturePli_AO).getTime()
          : 0;
        const dateB = b.dateOuverturePli_AO
          ? new Date(b.dateOuverturePli_AO).getTime()
          : 0;
        return dateA - dateB;
      },
    },
    {
      key: "4",
      title: "Coût estimé",
      dataIndex: "coutEstime_AO",
      sorter: (a: AppelOffre, b: AppelOffre) =>
        a.coutEstime_AO - b.coutEstime_AO,
    },
    {
      key: "5",
      title: "Caution provisoire",
      dataIndex: "cautionProvisoire_AO",
      sorter: (a: AppelOffre, b: AppelOffre) =>
        a.cautionProvisoire_AO - b.cautionProvisoire_AO,
    },
    {
      key: "8",
      title: "Statut",
      dataIndex: "statut_AO",
      render: (statut: string) => {
        let color = "default";
        switch (statut) {
          case "ENCOURS":
            color = "orange"; // En cours = orange
            break;
          case "VALIDE":
            color = "green"; // Validé = vert
            break;
          case "INFRUTUEUSE":
            color = "red"; // Infructueux = rouge
            break;
          default:
            color = "gray"; // Par défaut (au cas où)
        }
        return <Tag color={color}>{statut}</Tag>;
      },
      filters: [
        { text: "ENCOURS", value: "ENCOURS" },
        { text: "VALIDE", value: "VALIDE" },
        { text: "INFRUTUEUSE", value: "INFRUTUEUSE" },
      ],
      onFilter: (value: any, record: AppelOffre) => record.statut_AO === value,
    },
    {
      key: "9",
      title: "Actions",
      render: (record: AppelOffre) => (
        <>
          <EditOutlined
            onClick={() => onEditAppelOffre(record)}
            style={{ color: "green", marginRight: 12 }}
          />
          {/*
          <DeleteOutlined
            onClick={() => onDeleteAppelOffre(record)}
            style={{ color: "red", marginLeft: 12 }}
          />
          */}
          <FileWordOutlined
            onClick={() => generateDocument(record)}
            style={{ color: "purple", marginLeft: 14 }}
          />
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
            onClick={() => navigate("/Add_AO")}
          />
          <div className="list-header">
            <h2 className="list-title">Liste des Appels d'offre</h2>
          </div>
          <Table
            columns={columns}
            dataSource={dataSource}
            rowKey="id_AO"
            loading={loading}
            pagination={{ pageSize: 10 }}
          />
          <Modal
            title="Modifier l'appel d'offre"
            open={isEditModalVisible}
            onCancel={() => {
              setIsEditModalVisible(false);
              setIsEditing(false);
              setEditingAppelOffre(null);
            }}
            onOk={form.submit}
            width={500}
          >
            <Form form={form} layout="vertical" onFinish={handleSave}>
              <Form.Item label="Numéro d'ordre">
                <Input value={editingAppelOffre?.num_Ordre_AO} disabled />
              </Form.Item>

              <Form.Item label="Type d'appel d'offre">
                <Input
                  value={editingAppelOffre?.type_AO}
                  onChange={(e) =>
                    setEditingAppelOffre((pre) =>
                      pre ? { ...pre, type_AO: e.target.value } : pre
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="dateOuverturePli_AO"
                label="Date d'ouverture des plis"
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  placeholder="Sélectionner la date d'ouverture des plis"
                  className="date-picker-container"
                  /*disabledDate={(current) =>
                    current && current < dayjs().startOf("day")
                  }
                  onChange={(date) => {
                    if (date) {
                      setEditingAppelOffre((prev) =>
                        prev
                          ? {
                              ...prev,
                              dateOuverturePli_AO: date.format("YYYY-MM-DD"),
                            }
                          : prev
                      );
                    }
                  }}*/
                  disabled
                />
              </Form.Item>

              <Form.Item 
                name="heureOuverturePli_AO"
                label="Heure d'ouverture des plis">
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  placeholder="Sélectionner Heure d'ouverture des plis"
                  value={editingAppelOffre?.heureOuverturePli_AO ? dayjs(editingAppelOffre.heureOuverturePli_AO, 'HH:mm') : undefined}
                  //onChange={(time) => {
                    //if (time) {
                      //setEditingAppelOffre(prev => prev ? {
                        //...prev,
                        //heureOuverturePli_AO: time.format('HH:mm')
                      //} : prev);
                    //}
                  //}}
                  disabled
                />
              </Form.Item>

              <Form.Item label="Coût estimé">
                <Input
                  value={editingAppelOffre?.coutEstime_AO}
                  onChange={(e) =>
                    setEditingAppelOffre((pre) =>
                      pre
                        ? { ...pre, coutEstime_AO: parseFloat(e.target.value) }
                        : pre
                    )
                  }
                />
              </Form.Item>

              <Form.Item label="Caution provisoire">
                <Input
                  value={editingAppelOffre?.cautionProvisoire_AO}
                  onChange={(e) =>
                    setEditingAppelOffre((pre) =>
                      pre
                        ? {
                            ...pre,
                            cautionProvisoire_AO: parseFloat(e.target.value),
                          }
                        : pre
                    )
                  }
                />
              </Form.Item>

              <Form.Item label="Statut">
                <Select
                  value={editingAppelOffre?.statut_AO}
                  onChange={(value) =>
                    setEditingAppelOffre((pre) =>
                      pre ? { ...pre, statut_AO: value } : pre
                    )
                  }
                >
                  <Select.Option value="ENCOURS">ENCOURS</Select.Option>
                  <Select.Option value="VALIDE">VALIDE</Select.Option>
                  <Select.Option value="INFRUTUEUSE">INFRUTUEUSE</Select.Option>
                </Select>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </Sidebar>
    </App>
  );
};

export default List_AO;