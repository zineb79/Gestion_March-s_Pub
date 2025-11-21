import api from "../utils/axiosInstance";
import { Societe } from "./SocieteService";

export enum TypeMarche {
  TRAVAUX = "TRAVAUX",
  FOURNITURE = "FOURNITURE",
  PRESTATION_SERVICE = "PRESTATION_SERVICE"
}


export enum StatutMarche {
  EnCoursTraitement,
  Adjuge,
  EnCoursDeVisa,
  EnCoursApprobation,
  EnArret,
  EncoursExecution,
  HorsDelaisMarche,
  HorsDelaisGarantie,
  Acheve,
  Notifie,
  Cloture
}


export interface Marche {
  id_Marche: number;
  numOrdre: string;
  type_Marche: TypeMarche;
  objet_marche: string;
  statut: StatutMarche;
  delaisGarantie: number;
  delaisMarche: string; // date in YYYY-MM-DD format
  chefServiceConcerne: string | null;
  serviceConcerne: string | null;
  montantFinal: number | null;
  isArchived: boolean;
  idSociete?: number;
  societe_obj?: Societe;
}
export const getNumOrdreMarche = async (idMarche: number): Promise<string> => {
  try {
    const response = await api.get(`/api/marche/numOrdre/${idMarche}`);
    return response.data as string;
  } catch (error) {
    return 'N/A';
  }
};

export const getMarchesById = async (id: number): Promise<Marche> => {
  try {
    const response = await api.get<Marche>(`/api/marche/${id}`);
    return response.data as Marche;
  } catch (error) {
    throw error;
  }
};

export const getMarches = async (): Promise<Marche[]> => {
  try {
    const response = await api.get<Marche[]>("/api/marche/");
    return response.data as Marche[];
  } catch (error) {
    throw error;
  }
};

export const deleteMarche = async (numOrdre: string): Promise<void> => {
  try {
    await api.delete('/api/marche/delete/${numOrdre}');
  } catch (error: any) {
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const createMarche = async (marche: Marche): Promise<Marche> => {
  try {
    const response = await api.post("/api/marche/add", marche);
    return response.data as Marche;
  } catch (error: any) {
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const updateMarche = async (id: number, marche: Marche): Promise<Marche> => {
  try {
    const marcheToUpdate = {
      ...marche,
      id_Marche: id
    };
    
    const response = await api.put(`/api/marche/update/${id}`, marcheToUpdate);
    return response.data as Marche;
  } catch (error: any) {
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};