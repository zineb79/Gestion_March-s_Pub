// services/UserService.ts
import api from "../utils/axiosInstance";

export interface User {
  id_user: number;
  nom: string;
  prenom: string;
  password: string;
  email: string;
  role: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await api.get("/api/users/all");
    console.log("Données récupérées :", response.data);
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    console.error("Erreur lors de la récupération des utilisateurs :", error);
    throw error;
  }
};
/*
export const getUserActif = async (): Promise<User[]> => {
  try {
    const response = await api.get("/api/user/data");
    console.log("Données récupérées :", response.data);
    return Array.isArray(response.data) ? response.data : response.data.data;
  } catch (error) {
    throw error;
  }
};

*/
export const createUser = async (user: User): Promise<User> => {
  try {
    const response = await api.post("/api/users/adduser", user);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la création de l'utilisateur :", error);
    if (error.response) {
      console.error('Backend error response:', error.response.data);
    }
    throw error;
  }
};

export type UpdateUserDto = Omit<User, 'password'> & { password?: string };

export const updateUser = async (id: number, user: UpdateUserDto): Promise<User> => {
  try {
    const response = await api.put(`/api/users/update/${id}`, user);
    return response.data;
  } catch (error: any) {
    console.error("Erreur lors de la mise à jour de l'utilisateur :", error);
    throw error;
  }
};


export const deleteUser = async (id: number): Promise<void> => {
  try {
    await api.delete(`/api/users/delete/${id}`);
  } catch (error: any) {
    console.error("Erreur lors de la suppression de l'utilisateur :", error);
    throw error;
  }
};

