import React, { useState, useEffect } from "react";
import { 
  Table, Modal, Input, FloatButton, Form, DatePicker, Select, 
  message, TimePicker, Tag, Card, Checkbox, Statistic, Row, Col 
} from "antd";
import { 
  EditOutlined, DeleteOutlined, PlusOutlined, 
  DownloadOutlined, FileWordOutlined, SearchOutlined,
  FileDoneOutlined, FileSyncOutlined, FileProtectOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import '../Style_CS.css';
import Sidebar from "../../../components/Sidebar/Sidebar_CS";
import { deleteAppelOffre, getAppelsOffre, updateAppelOffre } from "../../../services/AOService";
import dayjs from "dayjs";
import { DocumentService } from '../../../services/DocumentService';
import { AppelOffre } from '../../../services/AOService';
import { getMarches, Marche } from "../../../services/MarcheService";

const DocAO = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingAppelOffre, setEditingAppelOffre] = useState<AppelOffre | null>(null);
  const [dataSource, setDataSource] = useState<AppelOffre[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [statuts, setStatuts] = useState<string[]>([]);
  const [loadingStatuts, setLoadingStatuts] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('Newest');
  const [marches, setMarches] = useState<Marche[]>([]);

  // Charger les appels d'offre depuis l'API
  useEffect(() => {
    const fetchAppelsOffre = async () => {
      try {
        setLoading(true);
        const [appelsData, marchesData] = await Promise.all([
          getAppelsOffre(),
          getMarches()
        ]);

        // Associer les marchés aux appels d'offre
        const enrichedData = appelsData.map((appel) => {
          const marche = marchesData.find(m => m.id_Marche === appel.idMarche);
          return {
            ...appel,
            marche_AO_obj: marche
          };
        }).filter(appel => appel.marche_AO_obj);

        setDataSource(enrichedData);
        setMarches(marchesData);
      } catch (error) {
        console.error("Erreur lors de la récupération des appels d'offre :", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAppelsOffre();
  }, []);

  // Calcul des statistiques
  const totalAO = dataSource.length;
  const valideAO = dataSource.filter(ao => ao.statut_AO === 'VALIDE').length;
  const inProgressAO = dataSource.filter(ao => ao.statut_AO === 'ENCOURS').length;

  const filteredData = dataSource
    .filter(item => 
      item.num_Ordre_AO?.toLowerCase().includes(searchText.toLowerCase()) ||
      (item.marche_AO_obj?.numOrdre && item.marche_AO_obj.numOrdre.toLowerCase().includes(searchText.toLowerCase()))
    );

  const onDeleteAppelOffre = async (record: AppelOffre) => {
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
  };

  const onEditAppelOffre = (record: AppelOffre) => {
    setIsEditModalVisible(true);
    setIsEditing(true);
    setEditingAppelOffre({ ...record });
    form.setFieldsValue({
      ...record,
      dateOuverturePli_AO: record.dateOuverturePli_AO ? dayjs(record.dateOuverturePli_AO) : null,
      heureOuverturePli_AO: editingAppelOffre?.heureOuverturePli_AO 
        ? dayjs(editingAppelOffre.heureOuverturePli_AO, 'HH:mm:ss') 
        : null,
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
        dateOuverturePli_AO: editingAppelOffre.dateOuverturePli_AO || '',
        heureOuverturePli_AO: editingAppelOffre.heureOuverturePli_AO || '',
        idMarche: editingAppelOffre.idMarche
      };

      const updatedAO = await updateAppelOffre(editingAppelOffre.id_AO, payload);
      
      // Mettre à jour avec les données enrichies
      const newData = await getAppelsOffre();
      const marchesData = await getMarches();
      const enrichedData = newData.map((appel) => {
        const marche = marchesData.find(m => m.id_Marche === appel.idMarche);
        return {
          ...appel,
          marche_AO_obj: marche
        };
      }).filter(appel => appel.marche_AO_obj);
      
      setDataSource(enrichedData);
      setMarches(marchesData);
      
      setEditingAppelOffre(null);
      setIsEditing(false);
      setIsEditModalVisible(false);
      message.success("Appel d'offre mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'appel d'offre :", error);
      message.error("Erreur lors de la mise à jour de l'appel d'offre");
    }
  };

  const generateDocument = async (appelOffre: AppelOffre) => {
    try {
      await DocumentService.generateAppelOffreDocument(appelOffre);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  };

  const columns = [
    {
      key: "0",
      title: "Numéro de marché",
      render: (record: AppelOffre) => (
        <Tag color="blue">{record.marche_AO_obj?.numOrdre || '-'}</Tag>
      ),
      sorter: (a: AppelOffre, b: AppelOffre) => 
        (a.marche_AO_obj?.numOrdre || '').localeCompare(b.marche_AO_obj?.numOrdre || '')
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
    },
    {
      key: "3",
      title: "Date et heure d'ouverture des plis",
      render: (record: AppelOffre) => {
        const date = record.dateOuverturePli_AO ? dayjs(record.dateOuverturePli_AO).format("DD/MM/YYYY") : "";
        const time = record.heureOuverturePli_AO || "";
        return `${date} ${time}`;
      },
      sorter: (a: AppelOffre, b: AppelOffre) => {
        const dateA = a.dateOuverturePli_AO ? new Date(a.dateOuverturePli_AO).getTime() : 0;
        const dateB = b.dateOuverturePli_AO ? new Date(b.dateOuverturePli_AO).getTime() : 0;
        return dateA - dateB;
      },
    },
    {
      key: "4",
      title: "Coût estimé",
      dataIndex: "coutEstime_AO",
      render: (value: number) => `${value} €`,
      sorter: (a: AppelOffre, b: AppelOffre) => a.coutEstime_AO - b.coutEstime_AO,
    },
    {
      key: "5",
      title: "Caution provisoire",
      dataIndex: "cautionProvisoire_AO",
      render: (value: number) => `${value} €`,
      sorter: (a: AppelOffre, b: AppelOffre) => a.cautionProvisoire_AO - b.cautionProvisoire_AO,
    },
    {
      key: "8",
      title: "Statut",
      dataIndex: "statut_AO",
      render: (statut: string) => {
        let color = 'default';
        switch (statut) {
          case 'ENCOURS':
            color = 'orange';
            break;
          case 'VALIDE':
            color = 'green';
            break;
          case 'INFRUTUEUSE':
            color = 'red';
            break;
          default:
            color = 'gray';
        }
        return <Tag color={color}>{statut}</Tag>;
      },
    },
    {
      key: "9",
      title: "Actions",
      render: (record: AppelOffre) => (
        <>
          <EditOutlined 
            onClick={() => onEditAppelOffre(record)} 
            style={{ color: "green", marginRight: 12, cursor: 'pointer' }}
          />
          <DeleteOutlined
            onClick={() => onDeleteAppelOffre(record)}
            style={{ color: "red", marginLeft: 12, cursor: 'pointer' }}
          />
          <FileWordOutlined 
            onClick={() => generateDocument(record)}
            style={{ color: "blue", marginLeft: 14, cursor: 'pointer' }}
          />
        </> 
      ),
    },
  ];

  return (
    <Sidebar>
      <FloatButton
                    icon={<PlusOutlined />}
                    onClick={() => navigate("/AddAO")}
                    tooltip="Ajouter une notification"
                  />
      <div className="list-container" style={{ padding: '20px' }}>
      <Card
        title="Appel d'offre"
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
                  title="Total Appels d'offre"
                  value={totalAO}
                  prefix={<FileProtectOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Appels d'offre validé"
                  value={valideAO}
                  prefix={<FileDoneOutlined />}
                  valueStyle={{ 
                    color: 'var(--success-color)',
                    fontSize: '24px'
                  }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Appels d'offre en cours"
                  value={inProgressAO}
                  prefix={<FileSyncOutlined />}
                  valueStyle={{ color: '#faad14' }}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Input 
              placeholder="Rechercher par numéro de marché ou d'ordre" 
              prefix={<SearchOutlined />} 
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="num_Ordre_AO"
            loading={loading}
            style={{ marginTop: '20px' }}
            bordered
          />
        </Card>

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
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item label="Numéro de marché">
              <Input 
                value={editingAppelOffre?.marche_AO_obj?.numOrdre || editingAppelOffre?.idMarche || '-'} 
                disabled 
              />
            </Form.Item>

            <Form.Item label="Numéro d'ordre">
              <Input
                value={editingAppelOffre?.num_Ordre_AO}
                disabled
              />
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
              label="Date d'ouverture des plis">
              <DatePicker
                style={{ width: "100%" }}
                format="YYYY-MM-DD"
                placeholder="Sélectionner la date d'ouverture des plis"
                className="date-picker-container"
                disabledDate={(current) => current && current < dayjs().startOf('day')}
                onChange={(date) => {
                  if (date) {
                    setEditingAppelOffre(prev => prev ? {
                      ...prev, 
                      dateOuverturePli_AO: date.format('YYYY-MM-DD')
                    } : prev);
                  }
                }}
              />
            </Form.Item>

            <Form.Item 
              name="heureOuverturePli_AO"
              label="Heure d'ouverture des plis">
              <TimePicker
                style={{ width: "100%" }}
                format="HH:mm:ss"
                placeholder="Sélectionner Heure d'ouverture des plis"
                onChange={(time) => {
                  if (time) {
                    const timeString = time.format('HH:mm:ss');
                    setEditingAppelOffre(prev => prev ? {
                      ...prev,
                      heureOuverturePli_AO: timeString
                    } : null);
                  }
                }}
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
                      ? { ...pre, cautionProvisoire_AO: parseFloat(e.target.value) }
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
  );
};

export default DocAO;