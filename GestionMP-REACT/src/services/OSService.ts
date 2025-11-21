import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";
import { Societe } from "./SocieteService";

export enum Type_OS {
  COMMENCEMENT = "COMMENCEMENT",
  ARRET = "ARRET",
  REPRISE = "REPRISE",
  CESSION = "CESSION"
}

export interface OrdreDeService {
  id_OS: number;
  numOrdre_OS: string;
  type_OS: Type_OS;
  date_OS: string;
  idMarche?: number;
  idMarche_obj? : Marche;
  idSociete?: number;
  societe_obj?: Societe;
}

export const getOrdresDeService = async (): Promise<OrdreDeService[]> => {
  try {
    const response = await api.get("/api/OS/get");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des ordres de service :", error);
    throw error;
  }
};

export const createOrdreDeService = async (OS: OrdreDeService): Promise<OrdreDeService> => {
  try {
    console.log("Envoi des données au backend:", JSON.stringify(OS, null, 2));
    const response = await api.post("/api/OS/add", OS);
    return response.data as OrdreDeService;
  } catch (error: any) {
    console.error("Erreur lors de la création de l'ordre de service :", error);
    
    // Log detailed error information
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Error response data:', error.response.data);
      console.error('Error status:', error.response.status);
      console.error('Error headers:', error.response.headers);
      
      // Add more specific error messages based on status code
      if (error.response.status === 500) {
        console.error('Server error. Please check the backend logs for more details.');
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error message:', error.message);
    }
    
    throw error;
  }
};

export const deleteOrdreDeService = async (id_OS: number): Promise<void> => {
  try {
    await api.delete(`/api/OS/delete/${id_OS}`);
  } catch (error) {
    console.error("Erreur lors de la suppression de l'ordre de service :", error);
    throw error;
  }
};

export const updateOrdreDeService = async (
  id_OS: number,
  ordreDeService: Omit<OrdreDeService, 'id_OS'>
): Promise<OrdreDeService> => {
  try {
    console.log(
      "Mise à jour des données de l'ordre de service au backend:",
      JSON.stringify(ordreDeService, null, 2)
    );
    const response = await api.put(`/api/OS/update/${id_OS}`, ordreDeService);
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'ordre de service :", error);
    throw error;
  }
};
