import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './endpoints';

export const authApi = {
  login: async (credentials) => {
    return await axiosClient.post(API_ENDPOINTS.AUTH.LOGIN, credentials);
  },

  register: async (userData) => {
    return await axiosClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
  },

  logout: async () => {
    return await axiosClient.post(API_ENDPOINTS.AUTH.LOGOUT);
  },

  getProfile: async () => {
    return await axiosClient.get(API_ENDPOINTS.AUTH.ME);
  },

  refreshToken: async (token) => {
    return await axiosClient.post(API_ENDPOINTS.AUTH.REFRESH, { refreshToken: token });
  },
};

export default authApi;
