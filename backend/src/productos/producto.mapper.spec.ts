import { toProductoPublico } from './producto.mapper';
import type { Producto } from '../generated/prisma/client';

const base: Producto = {
  id: 1,
  nombre: 'Camisa',
  descripcion: 'desc',
  precio: 40000,
  categoria: 'Camisas',
  tallas: ['XL', 'S', 'M'],
  imagen: 'camisa.jpg',
  tiempoEntregaEstimado: null,
  activo: true,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('toProductoPublico', () => {
  it('ordena las tallas S, M, L, XL', () => {
    expect(toProductoPublico(base).tallas).toEqual(['S', 'M', 'XL']);
  });

  it('omite tiempoEntregaEstimado si es null', () => {
    expect(toProductoPublico(base)).not.toHaveProperty('tiempoEntregaEstimado');
  });

  it('incluye tiempoEntregaEstimado si existe y oculta campos internos', () => {
    const publico = toProductoPublico({ ...base, tiempoEntregaEstimado: '2 a 4 días' });
    expect(publico.tiempoEntregaEstimado).toBe('2 a 4 días');
    expect(publico).not.toHaveProperty('activo');
  });
});
