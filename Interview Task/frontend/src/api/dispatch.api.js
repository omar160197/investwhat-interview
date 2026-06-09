import api from './axios.js';

export const send       = (data)   => api.post('/dispatch', data);
export const getHistory = (params) => api.get('/dispatch', { params });
export const getById    = (id)     => api.get(`/dispatch/${id}`);
