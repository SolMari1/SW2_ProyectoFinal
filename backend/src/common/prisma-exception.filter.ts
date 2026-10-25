import { ArgumentsHost, Catch, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { Prisma } from '../generated/prisma/client';

const PRISMA_ERRORS: Record<string, { status: HttpStatus; message: string }> = {
  P2002: { status: HttpStatus.CONFLICT, message: 'Ya existe un registro con esos datos' },
  P2003: { status: HttpStatus.BAD_REQUEST, message: 'El registro relacionado no existe' },
  P2025: { status: HttpStatus.NOT_FOUND, message: 'Registro no encontrado' },
};

export function mapPrismaError(code: string): { status: HttpStatus; message: string } | undefined {
  return PRISMA_ERRORS[code];
}

/** Convierte errores conocidos de Prisma en 409/400/404 en lugar de un 500 genérico. */
@Catch(Prisma.PrismaClientKnownRequestError)
export class PrismaExceptionFilter extends BaseExceptionFilter {
  catch(exception: Prisma.PrismaClientKnownRequestError, host: ArgumentsHost) {
    const mapped = mapPrismaError(exception.code);
    if (!mapped || host.getType() !== 'http') return super.catch(exception, host);

    host
      .switchToHttp()
      .getResponse()
      .status(mapped.status)
      .json({ statusCode: mapped.status, message: mapped.message, error: exception.code });
  }
}
