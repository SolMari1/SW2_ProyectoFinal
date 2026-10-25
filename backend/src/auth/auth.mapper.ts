import type { Rol, Usuario } from '../generated/prisma/client';

/** Usuario tal como lo espera el frontend (src/types/auth.ts). */
export interface UsuarioPublico {
  id: string;
  name: string;
  email: string;
  role: Rol;
}

/** Usuario autenticado que queda en `request.user`. */
export interface AuthUser {
  id: number;
  nombre: string;
  email: string;
  rol: Rol;
}

export interface JwtPayload {
  sub: number;
  rol: Rol;
}

export function toUsuarioPublico(usuario: Pick<Usuario, 'id' | 'nombre' | 'email' | 'rol'>): UsuarioPublico {
  return {
    id: String(usuario.id),
    name: usuario.nombre,
    email: usuario.email,
    role: usuario.rol,
  };
}

export function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}
