import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";
import { Societe } from "./SocieteService";

export interface Notification {
  id_NOTIF?: number;
  numOrdre_NOTIF: string;
  dateVisa_NOTIF: string;
  dateApprobation_NOTIF: string;
  marche_NOTIF?: number;  
  marche_NOTIF_obj?: Marche;   
  societe_NOTIF?: number;  
  societe_NOTIF_obj?: Societe;  
};

export const getNotificationsByMarche = async (idMarche: number): Promise<Notification[]> => {
  try {
    const response = await api.get(`/api/Notification/getByMarche/${idMarche}`);
    return response.data as Notification[];
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications pour le marché :", error);
    throw error;
  }
};

export const getNotifications = async (): Promise<Notification[]> => {
  try {
    const response = await api.get("/api/Notification/get");
    return response.data as Notification[];
  } catch (error) {
    console.error("Erreur lors de la récupération des notifications :", error);
    throw error;
  }
};

export const createNotification = async (notification: Notification): Promise<Notification> => {
  try {
    //console.log("Envoi des données au backend:", JSON.stringify(notification, null, 2));
    const response = await api.post("/api/Notification/add", notification);
    return response.data as Notification;
  } catch (error) {
    console.error("Erreur lors de la création de la notification :", error);
    throw error;
  }
};

export const deleteNotification = async (id_NOTIF: number): Promise<void> => {
  try {
    await api.delete(`/api/Notification/delete/${id_NOTIF}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de la notification :", error);
    throw error;
  }
};

export const updateNotification = async (id: number, notification: Notification): Promise<Notification> => {
  try {
    console.log('Updating Notification with data:', notification);
    const response = await api.put(`/api/Notification/update/${id}`, notification);
    console.log('Backend response:', response.data);
    return response.data as Notification;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de la notification :", error);
    throw error;
  }
};