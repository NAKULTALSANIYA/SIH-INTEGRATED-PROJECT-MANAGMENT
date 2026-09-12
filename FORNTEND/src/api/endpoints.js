/**
 * Central API Endpoint Route Constants
 */
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },

  // Project Management
  PROJECTS: {
    BASE: '/projects',
    BY_ID: (id) => `/projects/${id}`,
    STATS: '/projects/stats',
    MEMBERS: (id) => `/projects/${id}/members`,
  },

  // Task Management
  TASKS: {
    BASE: '/tasks',
    BY_ID: (id) => `/tasks/${id}`,
    BY_PROJECT: (projectId) => `/projects/${projectId}/tasks`,
    UPDATE_STATUS: (id) => `/tasks/${id}/status`,
  },

  // Users & Team
  USERS: {
    BASE: '/users',
    PROFILE: '/users/profile',
  },
};
