import { useQuery } from '@tanstack/react-query';
import * as usersApi from '../api/users.api.js';

export const useUsers = (params) =>
  useQuery({
    queryKey: ['users', params],
    queryFn: () => usersApi.getAll(params).then((r) => r.data.data),
  });
