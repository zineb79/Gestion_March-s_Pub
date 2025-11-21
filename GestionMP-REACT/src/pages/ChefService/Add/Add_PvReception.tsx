import { useState, useEffect } from "react";
import { Form, Button, Select, message, DatePicker, App } from "antd";
import { useNavigate } from "react-router-dom";
import {
  createPvReception,
  PvReception,
  TypePvReception,
} from "../../../services/PvReceptionService";
import Sidebar from "../../../components/Sidebar/Sidebar_CS";
import dayjs from "dayjs";
import { Marche, getMarches } from "../../../services/MarcheService";

const { Option } = Select;

const Add_PvReception = () => {
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
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des marchés :", error);
        message.error("Erreur lors du chargement des données");
      } finally {
        setLoading(false);
      }
    };

    fetchMarches();
  }, []);

  const onFinish = async (values: any) => {
    try {
      const payload = {
        type_PVR: values.type_PVR,
        date: values.date ? dayjs(values.date).format("YYYY-MM-DD") : undefined,
        idMarche_PVR: values.idMarche_PVR,
      };
      console.log("Form values:", values);
      console.log("Payload to backend:", payload);
      await createPvReception(payload);
      message.success("PV de réception ajouté avec succès");
      navigate("/DocPV");
    } catch (error) {
      message.error("Erreur lors de l'ajout du PV de réception");
      console.error("Error:", error);
    }
  };

  return (
    <App>
      <Sidebar>
        <div className="list-container">
          <div className="list-header">
            <h2 className="list-title">Ajouter un PV de Réception</h2>
          </div>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              name="type_PVR"
              label="Type de PV"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner le type de PV",
                },
              ]}
            >
              <Select>
                <Option value={TypePvReception.PROVISOIRE}>Provisoire</Option>
                <Option value={TypePvReception.DEFINITIVE}>Définitif</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="idMarche_PVR"
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
              name="date"
              label="Date de réception"
              rules={[
                {
                  required: true,
                  message: "Veuillez sélectionner la date de réception",
                },
              ]}
            >
              <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
            </Form.Item>

            <Button block type="primary" htmlType="submit" className="ajouter">
              Ajouter
            </Button>
          </Form>
        </div>
      </Sidebar>
    </App>
  );
};

export default Add_PvReception;