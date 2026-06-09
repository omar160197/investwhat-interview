import api from './axios.js';

export const summarize     = (articleId)  => api.post('/summaries', { articleId });
export const bulkSummarize = (articleIds) => api.post('/summaries/bulk', { articleIds });
export const getByArticle  = (articleId)  => api.get(`/summaries/${articleId}`);
