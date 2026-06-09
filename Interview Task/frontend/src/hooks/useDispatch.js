import { useMutation, useQuery } from '@tanstack/react-query';
import * as dispatchApi from '../api/dispatch.api.js';

export const useDispatch = () =>
  useMutation({
    mutationFn: (data) => dispatchApi.send(data).then((r) => r.data.data),
  });

export const useDispatchHistory = (params) =>
  useQuery({
    queryKey: ['dispatch', params],
    queryFn: () => dispatchApi.getHistory(params).then((r) => r.data.data),
  });
