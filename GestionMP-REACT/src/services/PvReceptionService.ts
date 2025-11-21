import api from "../utils/axiosInstance";
import { Marche, getMarchesById, getNumOrdreMarche } from './MarcheService';

export enum TypePvReception {
    PROVISOIRE = 'PROVISOIRE',
    DEFINITIVE = 'DEFINITIVE'
}

export interface PvReception {
    id_PVR?: number;
    type_PVR: TypePvReception;
    date?: string;
    idMarche_PVR?: number;
    marche_PVR_obj?: Marche;
}

export interface PvReceptionWithNumOrdre extends PvReception {
    numOrdreMarche?: string;
}

export const createPvReception = async (
    pvReception: Omit<PvReception, 'id_PVR' | 'marche_PVR_obj'>
  ): Promise<PvReception> => {
    try {
      const payload = {
        type_PVR: pvReception.type_PVR,
        date: pvReception.date,
        idMarche_PVR: pvReception.idMarche_PVR,
      };
      console.log(
        "Envoi des données au backend:",
        JSON.stringify(payload, null, 2)
      );
      const response = await api.post("/api/PvReception/add", payload);
      return response.data as PvReception;
    } catch (error) {
      console.error("Erreur lors de la création de la notification :", error);
      throw error;
    }
  };

  export const getPvReceptions = async (): Promise<PvReceptionWithNumOrdre[]> => {
    try {
        const response = await api.get("/api/PvReception/get");
        const pvsBackend = response.data as any[];

        const enrichedPvs = await Promise.all(
            pvsBackend.map(async (pv) => {
                let numOrdre: string | undefined = undefined;
                if (pv.idMarche_PVR) {
                    try {
                        numOrdre = await getNumOrdreMarche(pv.idMarche_PVR);
                    } catch (numOrdreError) {
                        console.error(`Error fetching numOrdre for Marche ID ${pv.idMarche_PVR}:`, numOrdreError);
                        numOrdre = 'N/A';
                    }
                }
                return {
                    id_PVR: pv.id_PVR,
                    type_PVR: pv.type_PVR,
                    date: pv.date, // Remap ici
                    idMarche_PVR: pv.idMarche_PVR,
                    numOrdreMarche: numOrdre ?? 'N/A'
                } as PvReceptionWithNumOrdre;
            })
        );

        return enrichedPvs;
    } catch (error) {
        console.error('Error fetching PV receptions:', error);
        throw error;
    }
};



export const deletePvReception = async (id: number): Promise<void> => {
    try {
        await api.delete("/api/PvReception/delete/" + id);
    } catch (error) {
        console.error('Error deleting PV reception:', error);
        throw error;
    }
};

export const updatePvReception = async (pvReception: Omit<PvReception, 'marche_PVR_obj'>): Promise<PvReception> => {
    try {
        const payload = {
           id_PVR: pvReception.id_PVR,
           type_PVR: pvReception.type_PVR,
           date: pvReception.date,
           idMarche_PVR: pvReception.idMarche_PVR,
        };
        console.log(
            "Envoi des données (update) au backend:",
            JSON.stringify(payload, null, 2) 
        );
        const response = await api.put('/api/PvReception/update/${pvReception.id_PVR}', payload );
        return response.data as PvReception;
    } catch (error) {
        console.error('Error updating PV reception:', error);
        throw error;
    }
};