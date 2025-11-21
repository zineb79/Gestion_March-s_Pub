import api from "../utils/axiosInstance";

export interface Societe {
  id_SO: number;
  raisonSociale: string;
  adresse: string;
  ville: string;
  telephone: string;
  email: string;
  idFiscale: string;
}

export const getSocietes = async (): Promise<Societe[]> => {
  try {
    const response = await api.get("/api/societe/get");
    return response.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des sociétés :", error);
    throw error;
  }
};

export const createSociete = async (societe: Societe): Promise<Societe> => {
  try {
    const response = await api.post("/api/societe/add", societe);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création de la société :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const updateSociete = async (id: number, societe: Societe): Promise<Societe> => {
  try {
    const response = await api.put(`/api/societe/update/${id}`, societe);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de la société :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export const deleteSociete = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/societe/delete/${id}`);
  } catch (error: any) {
    console.error("Erreur lors de la suppression de la société :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};
