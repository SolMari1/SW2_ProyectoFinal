import api from './axios';
import type { AuthResponse, LoginData, RegisterData, User } from '../types/auth';

export const loginApi = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const registerApi = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};

// Valida el token guardado y devuelve el usuario actual
export const meApi = async (): Promise<User> => {
  const response = await api.get<User>('/auth/me');
  return response.data;
};
