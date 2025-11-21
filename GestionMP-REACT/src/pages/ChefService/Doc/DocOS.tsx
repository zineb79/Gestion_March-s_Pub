import React, { useState, useEffect } from 'react';
import { 
  Table, Modal, Input, FloatButton, Form, DatePicker, Select, 
  message, Tag, Card, Statistic, Row, Col 
} from "antd";
import { 
  EditOutlined, PlusOutlined, FileWordOutlined,
  FileDoneOutlined, FileSyncOutlined, FileProtectOutlined, SearchOutlined, 
  DeleteOutlined
} from "@ant-design/icons";
import { useNavigate } from 'react-router-dom';
import { getOrdresDeService, updateOrdreDeService, Type_OS, deleteOrdreDeService } from '../../../services/OSService';
import { getMarches, Marche } from '../../../services/MarcheService';
import { getSocietes, Societe } from '../../../services/SocieteService';
import Sidebar from '../../../components/Sidebar/Sidebar_CS';
import dayjs from 'dayjs';
import { OrdreDeService } from '../../../services/OSService';
import { DocumentService } from '../../../services/DocumentService';

const DocOS = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingOS, setEditingOS] = useState<OrdreDeService | null>(null);
  const [dataSource, setDataSource] = useState<OrdreDeService[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSociete] = useState<Societe[]>([]);
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [osData, marchesData, societesData] = await Promise.all([
          getOrdresDeService(),
          getMarches(),
          getSocietes()
        ]);

        const enrichedData = osData.map(os => {
          const marche = marchesData.find(m => m.id_Marche === os.idMarche);
          const societe = societesData.find(m => m.id_SO === marche?.idSociete);
          return {
            ...os,
            idMarche_obj: marche,
            marche_OS_obj: marche,
            marche_OS: marche?.id_Marche || os.idMarche,
            societe_obj: societe,
          };
        }).filter(os => os.idMarche_obj); 

        setDataSource(enrichedData);
        setMarches(marchesData);
        setSociete(societesData);
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
  const totalOS = dataSource.length;
  const commencementOS = dataSource.filter(os => os.type_OS === 'COMMENCEMENT').length;
  const arretOS = dataSource.filter(os => os.type_OS === 'ARRET').length;

  const filteredData = dataSource.filter(item => 
    item.numOrdre_OS?.toLowerCase().includes(searchText.toLowerCase()) ||
    (item.idMarche_obj?.numOrdre && item.idMarche_obj.numOrdre.toLowerCase().includes(searchText.toLowerCase()))
  );

   const onDeleteOrdreService = async (record: OrdreDeService) => {
      Modal.confirm({
        title: "Êtes-vous sûr de vouloir supprimer cet appel d'offre ?",
        okText: "Oui",
        okType: "danger",
        onOk: async () => {
          try {
            await deleteOrdreDeService(record.id_OS);
            setDataSource((pre) =>
              pre.filter((ao) => ao.id_OS !== record.id_OS)
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

  const onEditOS = (record: OrdreDeService) => {
    setIsEditing(true);
    setEditingOS({ ...record });
    form.setFieldsValue({
      ...record,
      date_OS: record.date_OS ? dayjs(record.date_OS) : null
    });
  };

  const handleSave = async (values: any) => {
    if (!editingOS || !editingOS.id_OS) {
      message.error("ID de l'ordre de service manquant");
      return;
    }
    try {
      const updatedOS = {
        ...editingOS,
        ...values,
        date_OS: values.date_OS?.format('YYYY-MM-DD')
      };

      await updateOrdreDeService(editingOS.id_OS, updatedOS);
      
      const [newData, updatedMarches, updatedSocietes] = await Promise.all([
        getOrdresDeService(),
        getMarches(),
        getSocietes()
      ]);
      
      const enrichedData = newData.map(os => {
        const marche = updatedMarches.find(m => m.id_Marche === os.idMarche);
        const societe = updatedSocietes.find(m => m.id_SO === marche?.idSociete);
        return {
          ...os,
          idMarche_obj: marche,
          societe_obj: societe,
          marche_OS_obj: marche,
          marche_OS: marche?.id_Marche || os.idMarche,
        };
      }).filter(os => os.idMarche_obj);
      
      setDataSource(enrichedData);
      setMarches(updatedMarches);
      setSociete(updatedSocietes);
      
      setEditingOS(null);
      setIsEditing(false);
      message.success("Ordre de service mis à jour avec succès");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      message.error("Échec de la mise à jour de l'ordre de service");
    }
  };

  const resetEditing = () => {
    setIsEditing(false);
    setEditingOS(null);
    form.resetFields();
  };
  
  const generateDocument = async (ordreDeService: OrdreDeService) => {
    try {
      await DocumentService.generateOrdreDeServiceDocument(ordreDeService);
      message.success('Document généré avec succès');
    } catch (error) {
      message.error('Erreur lors de la génération du document');
    }
  };

  const columns = [
    {
      title: 'Numéro de Marché',
      key: 'idMarche',
      render: (record: OrdreDeService) => (
        <Tag color="blue">{record.idMarche_obj?.numOrdre || "-"}</Tag>
      ),
      sorter: (a: OrdreDeService, b: OrdreDeService) => 
        (a.idMarche_obj?.numOrdre || "").localeCompare(b.idMarche_obj?.numOrdre || "")
    },
    {
      title: "Numéro d'OS",
      dataIndex: "numOrdre_OS",
    },
    {
      title: 'Société',
      key: 'societe',
      render: (record: OrdreDeService) => record.societe_obj?.raisonSociale || "-",
    },
    {
      title: 'Type',
      key: 'type_OS',
      render: (record: OrdreDeService) => {
        let color = 'default';
        let text = '-';
        
        switch(record.type_OS) {
          case 'COMMENCEMENT':
            color = 'green';
            text = 'COMMENCEMENT';
            break;
          case 'ARRET':
            color = 'red';
            text = 'ARRÊT';
            break;
          case 'REPRISE':
            color = 'orange';
            text = 'REPRISE';
            break;
          case 'CESSION':
            color = 'purple';
            text = 'CESSION';
            break;
        }
        
        return <Tag color={color}>{text}</Tag>;
      },
      filters: [
        { text: 'COMMENCEMENT', value: 'COMMENCEMENT' },
        { text: 'ARRÊT', value: 'ARRET' },
        { text: 'REPRISE', value: 'REPRISE' },
        { text: 'CESSION', value: 'CESSION' },
      ],
      onFilter: (value: any, record: OrdreDeService) => record.type_OS === value,
    },
    {
      title: 'Date',
      key: 'date_OS',
      render: (record: OrdreDeService) => record.date_OS ? dayjs(record.date_OS).format('DD/MM/YYYY') : '-',
      sorter: (a: OrdreDeService, b: OrdreDeService) => 
        (a.date_OS || '').localeCompare(b.date_OS || '')
    },
    {
      title: "Actions",
      key: "actions",
      render: (record: OrdreDeService) => (
        <>
          <EditOutlined 
            onClick={() => onEditOS(record)} 
            style={{ color: "green", marginRight: 12, cursor: 'pointer' }}
          />
          <DeleteOutlined
                      onClick={() => onDeleteOrdreService(record)}
                      style={{ color: "red", marginLeft: 12, cursor: 'pointer' }}
                    />
          <FileWordOutlined 
            onClick={() => generateDocument(record)}
            style={{ color: "blue", marginLeft: 12, cursor: 'pointer' }}
          />
        </>
      ),
    }
  ];

  return (
    <Sidebar>
      <div className="list-container" style={{ padding: '20px' }}>
      <Card
        title="Ordre de Service"
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
                  title="Total Ordres de Service"
                  value={totalOS}
                  prefix={<FileProtectOutlined />}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card bordered={false}>
                <Statistic
                  title="Commencements"
                  value={commencementOS}
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
                  title="Arrêts"
                  value={arretOS}
                  prefix={<FileSyncOutlined />}
                  valueStyle={{ color: '#ff4d4f' }}
                />
              </Card>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <Input 
              placeholder="Rechercher par numéro de marché ou d'OS" 
              prefix={<SearchOutlined />} 
              style={{ width: '300px' }}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </div>

          <Table
            columns={columns}
            dataSource={filteredData}
            rowKey="id_OS"
            loading={loading}
            style={{ marginTop: '20px' }}
            bordered
          />
        </Card>

        <Modal 
          title="Modifier l'ordre de service" 
          open={isEditing} 
          onCancel={resetEditing} 
          onOk={() => form.submit()}
          width={600}
          destroyOnClose
        >
          <Form 
            form={form}
            layout="vertical"
            onFinish={handleSave}
          >
            <Form.Item
              name="numOrdre_OS"
              label="Numéro d'ordre de service"
            >
              <Input disabled />
            </Form.Item>

            <Form.Item
              name="marche_OS"
              label="Marché"
            >
              <Input value={editingOS?.idMarche_obj?.numOrdre || "N/A"} disabled />
            </Form.Item>

            <Form.Item 
              name="type_OS"
              label="Type"
              rules={[{ required: true, message: 'Veuillez sélectionner un type' }]}
            >
              <Select
                style={{ width: '100%' }}
                options={[
                  { value: Type_OS.COMMENCEMENT, label: 'Commencement' },
                  { value: Type_OS.ARRET, label: 'Arret' },
                  { value: Type_OS.REPRISE, label: 'Reprise' },
                  { value: Type_OS.CESSION, label: 'Cession' }
                ]}
              />
            </Form.Item>
            <Form.Item
              name="date_OS"
              label="Date d'ordre de service"
              rules={[{ required: true, message: 'Veuillez sélectionner la date' }]}
            >
              <DatePicker 
                style={{ width: '100%' }} 
                format="DD/MM/YYYY"
                disabledDate={current => current && current > dayjs().endOf('day')}
              />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </Sidebar>
  );
};

export default DocOS;