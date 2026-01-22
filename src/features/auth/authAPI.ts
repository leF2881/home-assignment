// authAPI.ts
import axiosInstance from '@/utils/axios';

export const authAPI = {
  login: async (credentials: { username: string; password: string }) => {
    const res = await axiosInstance.post('/auth/login', credentials, {
      skipAuth: true,
    } as any);
    return res.data;
  },

refresh: async (accessToken: string) => {
    const res = await axiosInstance.post(
      '/auth/refresh',
      { accessToken },
      { skipAuth: true } as any 
    );
    return res.data;
  },

  logout: async () => {
    const res = await axiosInstance.post('/auth/logout', {}, {
    });
    return res.data;
  },
};
