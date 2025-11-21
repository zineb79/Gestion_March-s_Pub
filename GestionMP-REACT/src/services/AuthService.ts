import axios from "axios";
import api from "../utils/axiosInstance";

//const API_URL = "http://10.16.45.90:8080/auth/login"; // Adjust this to match your backend URL
const API_URL = "http://localhost:8080/auth/login";
interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  role: string;
  nom: string;
  prenom: string;
}

export const login = async (
  email: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post<LoginResponse>(
      API_URL,
      { email, password },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );

    const { accessToken, refreshToken, role, nom, prenom } = response.data;

    if (!accessToken || !refreshToken || !role || !nom || !prenom) {
      throw new Error("Missing data in response");
    }

    localStorage.setItem("accessToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("role", role);
    localStorage.setItem("nom", nom);
    localStorage.setItem("prenom", prenom);

    return accessToken;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};




