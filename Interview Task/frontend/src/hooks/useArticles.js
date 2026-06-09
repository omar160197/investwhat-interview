import { useMutation, useQuery } from '@tanstack/react-query';
import * as articlesApi from '../api/articles.api.js';

export const useArticleSearch = () =>
  useMutation({
    mutationFn: (topicIds) => articlesApi.search(topicIds).then((r) => r.data.data),
  });

export const useArticles = (params) =>
  useQuery({
    queryKey: ['articles', params],
    queryFn: () => articlesApi.getAll(params).then((r) => r.data.data),
    enabled: false,
  });

export const useArticle = (id) =>
  useQuery({
    queryKey: ['articles', id],
    queryFn: () => articlesApi.getById(id).then((r) => r.data.data),
    enabled: !!id,
  });
