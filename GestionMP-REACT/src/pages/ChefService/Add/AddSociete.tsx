import { Form, Button, Input, message } from "antd";
import Sidebare from '../../../components/Sidebar/Sidebar_CS';  
import { useNavigate } from 'react-router-dom';
import { createSociete } from '../../../services/SocieteService';

const Add_Societe = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: any) => {
    try {
      const societeData = {
        id_SO: 0,
        raisonSociale: values.raisonSociale.trim(),
        adresse: values.adresse.trim(),
        ville: values.ville.trim(),
        telephone: values.telephone.trim(),
        email: values.email.trim(),
        idFiscale: values.idFiscale.trim()
      };
      
      await createSociete(societeData);
      message.success('Société ajoutée avec succès');
      form.resetFields();
      navigate('/Societe');
    } catch (error) {
      console.error("Erreur lors de l'ajout de la société:", error);
      message.error("Erreur lors de l'ajout de la société");
    }
  };

  return (
    <Sidebare>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter une société</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
        >
          <Form.Item
            name="raisonSociale"
            label="Raison sociale"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez la raison sociale" />
          </Form.Item>

          <Form.Item
            name="adresse"
            label="Adresse"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez l'adresse" />
          </Form.Item>

          <Form.Item
            name="ville"
            label="Ville"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez la ville" />
          </Form.Item>

          <Form.Item
            name="telephone"
            label="Téléphone"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez le téléphone" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez l'email" />
          </Form.Item>

          <Form.Item
            name="idFiscale"
            label="Identifiant fiscal"
            rules={[{ required: true, message: "Champ obligatoire" }]}
          >
            <Input placeholder="Entrez l'identifiant fiscal" />
          </Form.Item>

          <Button block type="primary" htmlType="submit" className='ajouter'>
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebare>
  );
};

export default Add_Societe;
