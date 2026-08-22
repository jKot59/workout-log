'use client';

import { useQuery } from '@tanstack/react-query';
import { userService } from '@/services/user.service';

export function useCurrentUser() {
  return useQuery({ queryKey: ['me'], queryFn: () => userService.me(), retry: false, staleTime: 60 * 1000 });
}

export default useCurrentUser;
