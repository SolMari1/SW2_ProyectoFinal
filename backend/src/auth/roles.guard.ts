import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Rol } from '../generated/prisma/client';
import { ROLES_KEY } from './roles.decorator';
import type { AuthUser } from './auth.mapper';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<Rol[] | undefined>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (!required || required.length === 0) return true;

    const { user } = context.switchToHttp().getRequest<{ user?: AuthUser }>();
    if (!user || !required.includes(user.rol)) {
      throw new ForbiddenException('No tienes permisos para esta acción');
    }
    return true;
  }
}
