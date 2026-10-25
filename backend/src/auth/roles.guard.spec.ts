import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import type { Rol } from '../generated/prisma/client';

function contexto(rol?: Rol): ExecutionContext {
  const user = rol ? { id: 1, nombre: 'x', email: 'x@x.com', rol } : undefined;
  return {
    getHandler: () => undefined,
    getClass: () => undefined,
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
  } as unknown as ExecutionContext;
}

function guardCon(requeridos: Rol[] | undefined): RolesGuard {
  const reflector = { getAllAndOverride: () => requeridos } as unknown as Reflector;
  return new RolesGuard(reflector);
}

describe('RolesGuard', () => {
  it('deja pasar si la ruta no exige roles', () => {
    expect(guardCon(undefined).canActivate(contexto('cliente'))).toBe(true);
  });

  it('deja pasar si el rol coincide', () => {
    expect(guardCon(['admin']).canActivate(contexto('admin'))).toBe(true);
  });

  it('rechaza con 403 si el rol no coincide', () => {
    expect(() => guardCon(['admin']).canActivate(contexto('cliente'))).toThrow(ForbiddenException);
  });

  it('rechaza si no hay usuario', () => {
    expect(() => guardCon(['cliente']).canActivate(contexto())).toThrow(ForbiddenException);
  });
});
