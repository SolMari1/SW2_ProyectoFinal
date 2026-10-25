import { HttpStatus } from '@nestjs/common';
import { mapPrismaError } from './prisma-exception.filter';

describe('mapPrismaError', () => {
  it('mapea violación de unicidad a 409', () => {
    expect(mapPrismaError('P2002')?.status).toBe(HttpStatus.CONFLICT);
  });

  it('mapea registro no encontrado a 404', () => {
    expect(mapPrismaError('P2025')?.status).toBe(HttpStatus.NOT_FOUND);
  });

  it('devuelve undefined para códigos desconocidos', () => {
    expect(mapPrismaError('P9999')).toBeUndefined();
  });
});
