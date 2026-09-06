'use client';

import { create } from 'zustand';

export interface IAuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  login: (token: string) => void;
  signout: () => void;
  clear: () => void;
}

export const useAuthStore = create<IAuthState>((set) => ({
  accessToken: null,
  isAuthenticated: false,
  setToken: (token) => set({ accessToken: token, isAuthenticated: !!token }),
  login: (token) => set({ accessToken: token, isAuthenticated: true }),
  signout: () => set({ accessToken: null, isAuthenticated: false }),
  clear: () => set({ accessToken: null, isAuthenticated: false }),
}));

export default useAuthStore;
