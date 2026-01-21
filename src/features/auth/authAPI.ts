import axios from "@/utils/axios";
import { LoginCredentials, AuthResponse } from "@/types/incident";

export const authAPI = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>("/auth/login", credentials);
    return response.data;
  },
  refresh: async (): Promise<AuthResponse> => {
    const response = await axios.post<AuthResponse>("/auth/refresh", {});
    return response.data;
  },

  logout: async (): Promise<void> => {
    try {
      await axios.post("/auth/logout", {});
    } catch (error) {
      // Even if logout fails on backend, we clear local storage
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("access_token");
    }
  },
};
