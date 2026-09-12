import axiosClient from './axiosClient';
import { API_ENDPOINTS } from './endpoints';

export const taskApi = {
  getAll: async (params = {}) => {
    return await axiosClient.get(API_ENDPOINTS.TASKS.BASE, { params });
  },

  getByProjectId: async (projectId) => {
    return await axiosClient.get(API_ENDPOINTS.TASKS.BY_PROJECT(projectId));
  },

  getById: async (id) => {
    return await axiosClient.get(API_ENDPOINTS.TASKS.BY_ID(id));
  },

  create: async (taskData) => {
    return await axiosClient.post(API_ENDPOINTS.TASKS.BASE, taskData);
  },

  update: async (id, taskData) => {
    return await axiosClient.put(API_ENDPOINTS.TASKS.BY_ID(id), taskData);
  },

  updateStatus: async (id, status) => {
    return await axiosClient.patch(API_ENDPOINTS.TASKS.UPDATE_STATUS(id), { status });
  },

  delete: async (id) => {
    return await axiosClient.delete(API_ENDPOINTS.TASKS.BY_ID(id));
  },
};

export default taskApi;
