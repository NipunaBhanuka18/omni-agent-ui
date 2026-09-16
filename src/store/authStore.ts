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

let savedUser: any = null;
try {
  const item = typeof window !== 'undefined' ? localStorage.getItem('omni_user') : null;
  if (item && item !== 'undefined') {
    savedUser = JSON.parse(item);
  }
} catch (e) {
  savedUser = null;
}

if (!savedUser) {
  savedUser = { id: 'user-1', name: 'System Admin', email: 'admin@slt.lk', role: 'admin', tenantId: 'slt', 'custom:tenant_id': 'slt' };
}

const savedToken = (typeof window !== 'undefined' && localStorage.getItem('omni_token')) || 'token-user-1';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: true,
  user: savedUser,
  token: savedToken,
  isLoading: false,

  login: (user, token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('omni_user', JSON.stringify(user));
      localStorage.setItem('omni_token', token);
    }
    set({
      isAuthenticated: true,
      user,
      token,
      isLoading: false,
    });
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('omni_user');
      localStorage.removeItem('omni_token');
    }
    set({
      isAuthenticated: false,
      user: null,
      token: null,
      isLoading: false,
    });
  },

  setLoading: (isLoading) =>
    set({
      isLoading,
    }),
}));
