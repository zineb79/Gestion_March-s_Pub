import { Form, Button, DatePicker, Input, Select, message } from "antd";
import Sidebare from '../../../components/Sidebar/Sidebar_Sec';  
import '../PagesSec.css';
import { useNavigate } from 'react-router-dom';
import { createMarche } from '../../../services/MarcheService';
import { useState } from 'react';

const Add_Marche = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        ...values,
        delaisMarche: values.delaisMarche ? values.delaisMarche.format('YYYY-MM-DD') : null
      };
      await createMarche(payload);
      message.success('Marche ajoutée avec succès!');
      form.resetFields();
      navigate('/Marche'); // Redirection après succès
    } catch (err) {
      console.error('Erreur lors de l\'ajout de la marche:', err);
      message.error('Erreur lors de l\'ajout de la marche');
    } 
  };

  return (
    <Sidebare>
      <div className="list-container" >
        <div className="list-header">
          <h2 className="list-title">Ajouter un Marché</h2>
        </div>
        <Form
          form={form}
          autoComplete="off"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onFinishFailed={(error) => console.log({ error })}
        >

          <Form.Item
            name="numOrdre"
            label="Numéro de Marché"
            rules={[
              {
                required: true,
                message: "Le numéro de marché est obligatoire"
              },
              {
                pattern: /^[a-zA-Z0-9-_/ ]+$/,
                message: "Le numéro de marché ne doit contenir que des lettres, chiffres, tirets et underscores"
              }
            ]}
            hasFeedback
          >
            <Input placeholder="Tapez le numéro de marché" />
          </Form.Item>

          <Form.Item name="type_Marche" label="Type de Marché" initialValue="TRAVAUX">
            <Select placeholder="Sélectionner le type de marché">
              <Select.Option value="TRAVAUX">TRAVAUX</Select.Option>
              <Select.Option value="FOURNITURE">FOURNITURE</Select.Option>
              <Select.Option value="PRESTATION_SERVICE">PRESTATION_SERVICE</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item 
            name="objet_marche" 
            label="Objet du marché"
            rules={[
              {
                required: true,
                message: "Veuillez entrer l'objet du marché",
              },
              { whitespace: true },
            ]}
          >
            <Input placeholder="Tapez l'objet" />
          </Form.Item>

          <Form.Item
            name="delaisMarche"
            label="Délais du marché"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le délai du marché",
              },
            ]}
            hasFeedback
          >
            <DatePicker
              format="YYYY-MM-DD"
              placeholder="Sélectionner la date du délai du marché"
              className="date-picker-container"
            />
          </Form.Item>

          <Form.Item name="serviceConcerne" label="Service concerné">
            <Select placeholder="Sélectionner le service concerné">
              <Select.Option value="Service_AdministrationGeneral">Service Administration Générale</Select.Option>
              <Select.Option value="Service_MarchePublic">Service Marché Public</Select.Option>
              <Select.Option value="Service_GestionCourrier">Service Gestion Courrier</Select.Option>
              <Select.Option value="Service_SuiviTravaux">Service Suivi Travaux</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="statut" label="Statut" initialValue="EnCoursTraitement">
            <Select placeholder="Sélectionner le statut">
              <Select.Option value="EnCoursTraitement">En Cours de Traitement</Select.Option>
              <Select.Option value="Adjuge">Adjugé</Select.Option>
              <Select.Option value="EnCoursDeVisa">En Cours de Visa</Select.Option>
              <Select.Option value="EnCoursApprobation">En Cours d'Approbation</Select.Option>
              <Select.Option value="EnArret">En Arrêt</Select.Option>
              <Select.Option value="EncoursExecution">En Cours d'Exécution</Select.Option>
              <Select.Option value="HorsDelais">Hors Délais</Select.Option>
              <Select.Option value="Acheve">Achevé</Select.Option>
              <Select.Option value="Notifie">Notifié</Select.Option>
              <Select.Option value="Cloture">Clôturé</Select.Option>
            </Select>
          </Form.Item>

          <Button block type="primary" htmlType="submit" className='ajouter'>
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebare>
  );
}

export default Add_Marche;