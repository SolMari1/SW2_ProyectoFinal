// Contexto de autenticación conectado al backend (POST /auth/login, /auth/register y GET /auth/me)
import { createContext, useState, useEffect, type ReactNode, type FC } from 'react';
import type { User, AuthResponse, LoginData, RegisterData } from '../types/auth';
import { loginApi, meApi, registerApi } from '../api/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (data: LoginData) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const guardado = localStorage.getItem('user');
      return guardado ? (JSON.parse(guardado) as User) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
  // Solo hay que esperar al backend si existe un token guardado que validar
  const [isLoading, setIsLoading] = useState(() => !!localStorage.getItem('token'));

  const limpiarSesion = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const guardarSesion = (response: AuthResponse): User => {
    setToken(response.token);
    setUser(response.user);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify(response.user));
    return response.user;
  };

  // Al cargar la app se valida con el backend el token guardado (puede haber expirado)
  useEffect(() => {
    if (!localStorage.getItem('token')) return;

    meApi()
      .then((usuario) => {
        setUser(usuario);
        localStorage.setItem('user', JSON.stringify(usuario));
      })
      .catch(limpiarSesion)
      .finally(() => setIsLoading(false));
  }, []);

  const login = async (data: LoginData) => guardarSesion(await loginApi(data));

  // Los registros siempre crean clientes (lo garantiza el backend)
  const register = async (data: RegisterData) => guardarSesion(await registerApi(data));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout: limpiarSesion,
        isAuthenticated: !!token && !!user,
        isLoading
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
