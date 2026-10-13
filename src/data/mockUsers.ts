// src/data/mockUsers.ts
// Usuarios de prueba predefinidos para autenticación y roles en el frontend
import type { User } from '../types/auth';

export interface TestUserCredentials {
  user: User;
  password: string; // Para validación simulada en login
  descripcion: string;
}

export const TEST_USERS: TestUserCredentials[] = [
  {
    user: {
      id: 'cliente-1',
      name: 'Carlos Mendoza',
      email: 'cliente1@correo.com',
      role: 'cliente'
    },
    password: 'password123',
    descripcion: 'Cliente 1 (6 pedidos históricos, acceso a catálogo, carrito e informe individual)'
  },
  {
    user: {
      id: 'cliente-2',
      name: 'Andrea Gómez',
      email: 'cliente2@correo.com',
      role: 'cliente'
    },
    password: 'password123',
    descripcion: 'Cliente 2 (6 pedidos históricos diferentes, acceso a catálogo, carrito e informe individual)'
  },
  {
    user: {
      id: 'admin-1',
      name: 'Administrador SW2',
      email: 'admin@correo.com',
      role: 'admin'
    },
    password: 'adminpassword',
    descripcion: 'Administrador (acceso a los 3 informes consolidados, catálogo solo lectura sin compras ni carrito)'
  }
];
