import api from "../utils/axiosInstance";
import { Marche } from "./MarcheService";

  
  export interface AppelOffre {
    id_AO?: number;
    num_Ordre_AO: string;
    type_AO: string;
    dateOuverturePli_AO: string;  
    heureOuverturePli_AO: string; 
    coutEstime_AO: number;
    cautionProvisoire_AO: number;
    statut_AO: string; 
    marche_AO_obj?: Marche;
    idMarche?: number;
  }
  
  export const getAppelsOffre = async (): Promise<AppelOffre[]> => {
    try {
      const response = await api.get("/api/AppelOffre/getAll");
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la récupération des appels d'offre :", error);
      throw error;
    }
  };
  
  export const createAppelOffre = async (
    appelOffre: AppelOffre
  ): Promise<AppelOffre> => {
    try {
      console.log(
        "Envoi des données au backend:",
        JSON.stringify(appelOffre, null, 2)
      );
      const response = await api.post("/api/AppelOffre/add", appelOffre);
      return response.data;
    } catch (error) {
      console.error("Erreur lors de la création de l'appel d'offre :", error);
      throw error;
    }
  };
  
  export const deleteAppelOffre = async (num_Ordre_AO: string): Promise<void> => {
    try {
      await api.delete(`/api/AppelOffre/delete/${num_Ordre_AO}`);
    } catch (error) {
      console.error("Erreur lors de la suppression de l'appel d'offre :", error);
      throw error;
    }
  };

  export const updateAppelOffre = async (id: number, appelOffre: AppelOffre): Promise<AppelOffre> => {
    try {
      console.log('Updating AO with data:', appelOffre);
      const response = await api.put(`/api/AppelOffre/update/${id}`, appelOffre);
      console.log('Backend response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error("Erreur lors de la mise à jour de l'appel d'offre :", error);
      if (error.response) {
        console.error('Backend error response:', error.response.data);
      }
      throw error;
    }
  };
  