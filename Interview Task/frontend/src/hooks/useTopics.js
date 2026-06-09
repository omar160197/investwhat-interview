import { useQuery } from '@tanstack/react-query';
import * as topicsApi from '../api/topics.api.js';

export const useTopics = () =>
  useQuery({
    queryKey: ['topics'],
    queryFn: () => topicsApi.getAll().then((r) => r.data.data),
    staleTime: Infinity,
  });

export const useRelatedStocks = (sectorSlug) =>
  useQuery({
    queryKey: ['topics', 'stocks', sectorSlug],
    queryFn: () => topicsApi.getRelatedStocks(sectorSlug).then((r) => r.data.data),
    enabled: !!sectorSlug,
  });

export const useRelatedThemes = (stockSlug) =>
  useQuery({
    queryKey: ['topics', 'themes', stockSlug],
    queryFn: () => topicsApi.getRelatedThemes(stockSlug).then((r) => r.data.data),
    enabled: !!stockSlug,
  });
