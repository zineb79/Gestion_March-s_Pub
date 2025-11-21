import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, message, InputNumber } from 'antd';
import { useNavigate } from 'react-router-dom';
import { createDecompte } from '../../../services/DecompteService';
import Sidebar from '../../../components/Sidebar/Sidebar_CS'; 
import { getSocietes, Societe } from '../../../services/SocieteService';
import { getMarches, Marche } from '../../../services/MarcheService';

const { Option } = Select;

const Add_Decompte = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);
  const [marches, setMarches] = useState<Marche[]>([]);

  useEffect(() => {
    // Fetch societes and marches data
    const fetchSocietes = async () => {
      try {
        // Replace with actual API call
        const dataSociete = await getSocietes();
        if (Array.isArray(dataSociete)) {
          setSocietes(dataSociete);
        } 
        const dataMarche = await getMarches();
        if (Array.isArray(dataMarche)) {
          setMarches(dataMarche);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching societes:', error);
        message.error('Erreur lors du chargement des societes');
        setLoading(false);
      }
    };
    fetchSocietes();
  }, []);

  const onFinish = async (values: any) => {
    try {
      // Formatage des dates avec gestion des valeurs null/undefined
      const payload = {
        ...values,
      };
      await createDecompte(payload);
      message.success('Décompte ajouté avec succès');
      navigate('/DocDecompte');
    } catch (error) {
      message.error('Erreur lors de l\'ajout du décompte');
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Ajouter un Décompte</h2>
          </div>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item
              name="numOrdre_D"
              label="Numéro d'ordre"
              rules={[{ required: true, message: 'Veuillez entrer le numéro d\'ordre' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
  name="aCompte"
  label="Acompte"
  rules={[{ required: true, message: "Veuillez entrer l'acompte" }]}>
  <InputNumber style={{ width: '100%' }} />
</Form.Item>

<Form.Item
  name="somme_D"
  label="Somme"
  rules={[{ required: true, message: "Veuillez entrer la somme" }]}>
  <InputNumber style={{ width: '100%' }} />
</Form.Item>

            <Form.Item
              name="idMarche"
              label="Marché"
              rules={[{ required: true, message: 'Veuillez sélectionner un marché' }]}
            >
              <Select
              placeholder="Sélectionner le marché"
              loading={loading}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={marches.map((m) => ({
                value: m.id_Marche,
                label: m.numOrdre,
              }))}
            >
              {marches.map((marche) => (
                <Select.Option key={marche.id_Marche} value={marche.id_Marche}>
                  {`${marche.numOrdre} - ${marche.objet_marche}`}
                </Select.Option>
              ))}
            </Select>
            </Form.Item>

            <Form.Item
              name="idSociete"
              label="Société"
              rules={[{ required: true, message: 'Veuillez sélectionner une société' }]}
            >
              <Select>
                {societes.map((societe: any) => (
                  <Option key={societe.id_SO} value={societe.id_SO}>
                    {societe.raisonSociale}
                  </Option>
                ))}
              </Select>
            </Form.Item>

            <Button block type="primary" htmlType="submit" className='ajouter'>
              Ajouter
            </Button>
          </Form>
        </div>
      </Sidebar>
    </div>
  );
};

export default Add_Decompte;
