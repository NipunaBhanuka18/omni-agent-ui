import { create } from 'zustand';

export interface AuthState {
  isAuthenticated: boolean;
  user: any | null;
  token: string | null;
  isLoading: boolean;
  login: (user: any, token: string) => void;
  logout: () => void;
  setLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  user: null,
  token: null,
  isLoading: false,

  login: (user, token) =>
    set({
      isAuthenticated: true,
      user,
      token,
      isLoading: false,
    }),

  logout: () =>
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    }),

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),
}));
