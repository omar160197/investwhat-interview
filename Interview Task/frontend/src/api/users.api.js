import api from './axios.js';

export const getAll            = (params) => api.get('/users', { params });
export const getById           = (id)     => api.get(`/users/${id}`);
export const updateProfile     = (id, data) => api.patch(`/users/${id}`, data);
export const updatePreferences = (id, topics) => api.patch(`/users/${id}/preferences`, { topics });
export const deleteUser        = (id)     => api.delete(`/users/${id}`);
