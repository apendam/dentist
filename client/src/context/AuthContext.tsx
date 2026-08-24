import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { api, setAuthToken } from '../api/client';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, password: string) => Promise<void>;
  registerTenant: (clinicName: string, adminName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = 'dentist_crm_token';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setAuthToken(token);

    if (!token) {
      localStorage.removeItem(STORAGE_KEY);
      setUser(null);
      return;
    }

    localStorage.setItem(STORAGE_KEY, token);
    api
      .get('/auth/me')
      .then((res) => setUser(res.data))
      .catch(() => setToken(null));
  }, [token]);

  async function login(email: string, password: string) {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.user);
    setToken(data.token);
  }

  async function registerTenant(clinicName: string, adminName: string, email: string, password: string) {
    const { data } = await api.post('/auth/register-tenant', { clinicName, adminName, email, password });
    setUser(data.user);
    setToken(data.token);
  }

  function logout() {
    setToken(null);
  }

  const value = useMemo(() => ({ token, user, login, registerTenant, logout }), [token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
