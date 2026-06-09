import api from './axios.js';

export const search       = (topicIds) => api.post('/articles/search', { topicIds });
export const getAll       = (params)   => api.get('/articles', { params });
export const getById      = (id)       => api.get(`/articles/${id}`);
export const fetchContent = (id)       => api.get(`/articles/${id}/content`);
