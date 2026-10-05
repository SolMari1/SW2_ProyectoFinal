import api from './axios';
import type { AuthResponse } from '../types/auth';

export const loginApi = async (data: any): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/login', data);
  return response.data;
};

export const registerApi = async (data: any): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/register', data);
  return response.data;
};
