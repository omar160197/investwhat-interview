import { useMutation, useQuery } from '@tanstack/react-query';
import * as summariesApi from '../api/summaries.api.js';

export const useSummarize = () =>
  useMutation({
    mutationFn: (articleId) => summariesApi.summarize(articleId).then((r) => r.data.data),
  });

export const useBulkSummarize = () =>
  useMutation({
    mutationFn: (articleIds) => summariesApi.bulkSummarize(articleIds).then((r) => r.data.data),
  });

export const useSummary = (articleId) =>
  useQuery({
    queryKey: ['summaries', articleId],
    queryFn: () => summariesApi.getByArticle(articleId).then((r) => r.data.data),
    enabled: !!articleId,
  });
