import { Form, Button, DatePicker, Input, message, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { createNotification } from "../../../services/NotifApprService";
import Sidebare from "../../../components/Sidebar/Sidebar_Sec";
import "../PagesSec.css";
import { getMarches } from "../../../services/MarcheService";
import { useEffect, useState } from "react";
import { Marche } from "../../../services/MarcheService";
import { Societe } from "../../../services/SocieteService";
import { getSocietes } from "../../../services/SocieteService";
import dayjs from "dayjs";

const Add_Notification = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [marches, setMarches] = useState<Marche[]>([]);
  const [societes, setSocietes] = useState<Societe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [marchesData, societesData] = await Promise.all([
          getMarches(),
          getSocietes(),
        ]);

        if (Array.isArray(marchesData)) setMarches(marchesData);
        if (Array.isArray(societesData)) setSocietes(societesData);

        setLoading(false);
      } catch (error) {
        console.error("Erreur lors de la récupération des données:", error);
        message.error("Erreur lors du chargement des données");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onFinish = async (values: any) => {
    try {
      // Formatage des dates
      const payload = {
        ...values,
        dateVisa_NOTIF: values.dateVisa_NOTIF.format("YYYY-MM-DD"),
        dateApprobation_NOTIF:
          values.dateApprobation_NOTIF.format("YYYY-MM-DD"),
        marche_NOTIF: values.marche_NOTIF,
        societe_NOTIF: values.societe_NOTIF,
      };

      await createNotification(payload);
      message.success("Notification ajoutée avec succès!");
      form.resetFields();
      navigate("/Notification"); // Redirection après succès
    } catch (err) {
      console.error("Erreur lors de l'ajout de la notification:", err);
      message.error("Erreur lors de l'ajout de la notification");
    }
  };

  return (
    <Sidebare>
      <div className="list-container">
        <div className="list-header">
          <h2 className="list-title">Ajouter une Notification d'approbation</h2>
        </div>
        <Form
          form={form}
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 14 }}
          onFinish={onFinish}
          onFinishFailed={(errors) => {
            console.log("Erreurs de validation:", errors);
            message.error("Veuillez corriger les erreurs dans le formulaire");
          }}
        >
          <Form.Item
            name="marche_NOTIF"
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
            name="societe_NOTIF"
            label="Société"
            rules={[
              { required: true, message: "Veuillez sélectionner une société" },
            ]}
          >
            <Select
              placeholder="Sélectionner la société"
              loading={loading}
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label ?? "")
                  .toLowerCase()
                  .includes(input.toLowerCase())
              }
              options={societes.map((s) => ({
                value: s.id_SO,
                label: s.raisonSociale,
              }))}
            >
              {societes.map((societe) => (
                <Select.Option key={societe.id_SO} value={societe.id_SO}>
                  {societe.raisonSociale}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="numOrdre_NOTIF"
            label="Numéro de Notification"
            rules={[
              {
                required: true,
                message: "Le numéro de notification est obligatoire",
              },
              {
                max: 50,
                message: "Le numéro ne doit pas dépasser 50 caractères",
              },
            ]}
          >
            <Input placeholder="Tapez le numéro de notification" />
          </Form.Item>

          <Form.Item
            name="dateVisa_NOTIF"
            label="Date de Visa"
            rules={[
              { required: true, message: "La date de visa est obligatoire" },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="dateApprobation_NOTIF"
            label="Date d'Approbation"
            rules={[
              {
                required: true,
                message: "La date d'approbation est obligatoire",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 10, span: 14 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="ajouter"
              loading={loading}
            >
              Ajouter
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Sidebare>
  );
};

export default Add_Notification;