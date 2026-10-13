// src/context/AuthContext.tsx
// Contexto de autenticación adaptado para usuarios de prueba predefinidos y backend
import { createContext, useState, useEffect, type ReactNode, type FC } from 'react';
import type { User, AuthResponse } from '../types/auth';
import { TEST_USERS } from '../data/mockUsers';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: { email: string; password?: string }) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      // Por defecto, si no hay sesión activa, podemos dejarlo sin loguear o mantenerlo limpio
      setUser(null);
      setToken(null);
    }
    setIsLoading(false);
  }, []);

  const login = async (data: { email: string; password?: string }) => {
    // 1. Verificamos si coincide con uno de nuestros usuarios de prueba
    const usuarioPrueba = TEST_USERS.find(
      (u) => u.user.email.toLowerCase() === data.email.toLowerCase()
    );

    if (usuarioPrueba) {
      const mockToken = `token-mock-${usuarioPrueba.user.id}`;
      setToken(mockToken);
      setUser(usuarioPrueba.user);
      localStorage.setItem('token', mockToken);
      localStorage.setItem('user', JSON.stringify(usuarioPrueba.user));
      return;
    }

    // 2. Si no es usuario predefinido de prueba, creamos una sesión por defecto como cliente
    const defaultUser: User = {
      id: `user-${Date.now()}`,
      name: data.email.split('@')[0],
      email: data.email,
      role: 'cliente'
    };
    const fallbackToken = `token-gen-${Date.now()}`;
    setToken(fallbackToken);
    setUser(defaultUser);
    localStorage.setItem('token', fallbackToken);
    localStorage.setItem('user', JSON.stringify(defaultUser));
  };

  const register = async (data: any) => {
    const newUser: User = {
      id: `cliente-${Date.now()}`,
      name: data.name || 'Nuevo Cliente',
      email: data.email,
      role: 'cliente' // Nuevos registros siempre son clientes
    };
    const response: AuthResponse = {
      token: `token-${Date.now()}`,
      user: newUser
    };
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token && !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
