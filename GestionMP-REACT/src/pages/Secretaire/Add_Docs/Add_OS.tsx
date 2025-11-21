import React, { useState, useEffect } from "react";
import { Form, Button, Select, message, Input, DatePicker } from "antd";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../../components/Sidebar/Sidebar_Sec";
import { createOrdreDeService, getOrdresDeService, OrdreDeService, Type_OS } from "../../../services/OSService";
import "../PagesSec.css";
import { getMarches } from "../../../services/MarcheService";
import { Marche } from "../../../services/MarcheService";

const Add_OS = () => {
  const [ordresDeService, setOrdresDeService] = useState<OrdreDeService[]>([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarchesEtOS = async () => {
      try {
        const [marchesData, osData] = await Promise.all([
          getMarches(),
          getOrdresDeService(),
        ]);
        if (Array.isArray(marchesData)) setMarches(marchesData);
        if (Array.isArray(osData)) setOrdresDeService(osData);
        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés ou OS:", error);
        message.error("Erreur lors du chargement des marchés ou OS");
        setLoading(false);
      }
    };
    fetchMarchesEtOS();
  }, []);

  const onFinish = async (values: any) => {
    // Vérification doublon OS (type + marché)
    const doublon = ordresDeService.some(
      (os) => os.idMarche === values.idMarche && os.type_OS === values.type_OS
    );
    if (doublon) {
      message.error("Un ordre de service de ce type existe déjà pour ce marché !");
      return;
    }
    try {
      const payload = {
        ...values,
        idMarche: values.idMarche,
        date_OS: values.date_OS.format("YYYY-MM-DD"),
      };
      await createOrdreDeService(payload);
      message.success("L'ordre de service a été ajouté avec succès");
      navigate("/OrdreService");
    } catch (error: any) {
      console.error("Erreur lors de l'ajout de l'ordre de service :", error);
      // Display more specific error messages to the user
      if (error.response && error.response.data) {
        // If backend sent an error message, show it
        const errorMessage = error.response.data.message || 'Une erreur est survenue lors de l\'ajout de l\'ordre de service';
        message.error(errorMessage);
      } else if (error.request) {
        // The request was made but no response was received
        message.error('Le serveur ne répond pas. Veuillez réessayer plus tard.');
      } else {
        // Something happened in setting up the request
        message.error('Erreur lors de la configuration de la requête. Veuillez réessayer.');
      }
    }
  };

  return (
    <Sidebar>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter un ordre de service</h2>
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          onFinishFailed={(error) => {
            console.log("Failed:", error);
            message.error("Veuillez corriger les erreurs dans le formulaire");
          }}
        >
          <Form.Item
            name="idMarche"
            label="Marché"
            rules={[
              { required: true, message: "Veuillez sélectionner un marché" },
            ]}
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
            name="numOrdre_OS"
            label="Numéro d'OS"
            rules={[{ required: true, message: 'Veuillez entrer le numéro d\'OS' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="type_OS"
            label="Type d'OS"
            rules={[{ required: true, message: 'Veuillez sélectionner un type d\'OS' }]}
          >
            <Select>
              {Object.values(Type_OS).map((type) => (
                <Select.Option key={type} value={type}>
                  {type}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date_OS"
            label="Date d'ordre de service"
            rules={[{ required: true, message: 'Veuillez sélectionner une date' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="ajouter">
            Ajouter
          </Button>
        </Form>
      </div>
    </Sidebar>
  );
};

export default Add_OS;
