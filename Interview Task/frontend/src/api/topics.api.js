import api from './axios.js';

export const getAll             = ()        => api.get('/topics');
export const getSectors         = ()        => api.get('/topics/sectors');
export const getStocks          = ()        => api.get('/topics/stocks');
export const getThemes          = ()        => api.get('/topics/themes');
export const getRelatedStocks   = (slug)    => api.get(`/topics/sectors/${slug}/stocks`);
export const getRelatedThemes   = (slug)    => api.get(`/topics/stocks/${slug}/themes`);
export const suggestStocks      = (topicIds)=> api.post('/topics/suggest-stocks', { topicIds });
