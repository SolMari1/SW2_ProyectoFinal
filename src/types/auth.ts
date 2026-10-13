// src/types/auth.ts
// Definición de tipos de usuarios y autenticación con roles

export type UserRole = 'cliente' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  user: User;
}
