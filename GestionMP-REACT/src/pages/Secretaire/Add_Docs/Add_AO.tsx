import React, { useState, useEffect } from "react";
import {
  Form,
  Button,
  DatePicker,
  Input,
  Select,
  message,
  TimePicker,
  Row,
  Col,
} from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { getMarches } from "../../../services/MarcheService";
import { createAppelOffre } from "../../../services/AOService";
import { Marche } from '../../../services/MarcheService';
import "../PagesSec.css";
import dayjs from 'dayjs';

const Add_AO = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarches = async () => {
      try {
        const data = await getMarches();
        if (data && Array.isArray(data)) {
          setMarches(data);
        } else {
          setMarches([]);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés :", error);
        setMarches([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      if (!values.idMarche) {
        message.error("Veuillez sélectionner un marché");
        return;
      }
  
      const payload = {
        ...values,
        dateOuverturePli_AO: values.dateOuverturePli_AO 
          ? dayjs(values.dateOuverturePli_AO).format('YYYY-MM-DD') 
          : null,
        heureOuverturePli_AO: values.heureOuverturePli_AO 
          ? dayjs(values.heureOuverturePli_AO).format('HH:mm:ss') 
          : null
      };
  
      await createAppelOffre(payload);
      message.success('Appel d\'offre ajouté avec succès!');
      form.resetFields();
      navigate('/AO');
    } catch (err) {
      console.error('Erreur:', err);
      message.error('Erreur lors de l\'ajout');
    }
  };

  return (
    <Sidebar>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter un appel d'offre</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log("Erreur de validation:", error);
            message.error(
              "Veuillez remplir tous les champs requis correctement"
            );
          }}
        >
          <Form.Item
            name="idMarche"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
          >
            <Select placeholder="Sélectionner le marché" loading={loading}>
              {marches && marches.length > 0 ? (
                marches.map((marche) => (
                  <Select.Option
                    key={marche.id_Marche}
                    value={marche.id_Marche}
                    disabled={!marche.id_Marche}
                  >
                    {`${marche.numOrdre} - ${marche.objet_marche}`}
                  </Select.Option>
                ))
              ) : (
                <Select.Option value="" disabled>
                  Aucun marché disponible
                </Select.Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item
            name="num_Ordre_AO"
            label="Numero d'ordre"
            rules={[
              {
                required: true,
                message: "Veuillez entrer Numero d'ordre",
              },
              { whitespace: true },
            ]}
          >
            <Input placeholder="Tapez le numero" />
          </Form.Item>

          <Form.Item
            name="type_AO"
            label="Type d'appel d'offre"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le type",
              },
              { whitespace: true },
            ]}
            hasFeedback
          >
            <Input placeholder="Taper le type" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="dateOuverturePli_AO"
                label="Date d'ouverture des plis"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer la date d'ouverture",
                  },
                ]}
                hasFeedback
              >
                <DatePicker
                  format="YYYY-MM-DD"
                  placeholder="Sélectionner la date d'ouverture"
                  className="date-picker-container"
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="heureOuverturePli_AO"
                label="Heure d'ouverture des plis"
                rules={[
                  {
                    required: true,
                    message: "Veuillez entrer l'heure d'ouverture",
                  },
                ]}
                hasFeedback
              >
                <TimePicker 
                  format="HH:mm" 
                  placeholder="Sélectionner l'heure d'ouverture" 
                  className="date-picker-container"
                />
              </Form.Item>
            </Col>
          </Row>


          <Form.Item
            name="coutEstime_AO"
            label="Coût estimé"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le coût estimé.",
              },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Veuillez entrer un nombre valide .",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Entrez le coût estimé" />
          </Form.Item>

          <Form.Item
            name="cautionProvisoire_AO"
            label="Coût provisoire"
            rules={[
              {
                required: true,
                message: "Veuillez entrer le coût provisoire.",
              },
              {
                pattern: /^[0-9]+(\.[0-9]{1,2})?$/,
                message: "Veuillez entrer un nombre valide.",
              },
            ]}
            hasFeedback
          >
            <Input placeholder="Entrez le coût provisoire" />
          </Form.Item>

          <Form.Item name="statut_AO" label="Statut" initialValue="ENCOURS">
          <Select placeholder="Sélectionner le statut" loading={loading}>
            <Select.Option value="ENCOURS">ENCOURS</Select.Option>
            <Select.Option value="VALIDE">VALIDE</Select.Option>
            <Select.Option value="INFRUTUEUSE">INFRUTUEUSE</Select.Option>
          </Select>
          </Form.Item>

          <Button block type="primary" htmlType="submit" className="ajouter">
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_AO;
