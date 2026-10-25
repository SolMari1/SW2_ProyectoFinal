import { BadRequestException } from '@nestjs/common';
import { ProductoParaPedido, construirLineasPedido } from './lineas-pedido';

const productos: ProductoParaPedido[] = [
  { id: 1, nombre: 'Camisa', precio: 40000, tallas: ['S', 'M', 'L', 'XL'], activo: true },
  { id: 2, nombre: 'Buzo', precio: 90000, tallas: ['M', 'L'], activo: true },
  { id: 3, nombre: 'Retirado', precio: 10000, tallas: ['M'], activo: false },
];

describe('construirLineasPedido', () => {
  it('calcula subtotales y total con el precio del catálogo', () => {
    const { lineas, total } = construirLineasPedido(
      [
        { productoId: 1, talla: 'M', cantidad: 2 },
        { productoId: 2, talla: 'L', cantidad: 1 },
      ],
      productos,
    );
    expect(lineas).toEqual([
      { productoId: 1, talla: 'M', cantidad: 2, precioUnitario: 40000, subtotal: 80000 },
      { productoId: 2, talla: 'L', cantidad: 1, precioUnitario: 90000, subtotal: 90000 },
    ]);
    expect(total).toBe(170000);
  });

  it('agrupa el mismo producto y talla en una línea', () => {
    const { lineas, total } = construirLineasPedido(
      [
        { productoId: 1, talla: 'S', cantidad: 1 },
        { productoId: 1, talla: 'S', cantidad: 3 },
        { productoId: 1, talla: 'M', cantidad: 1 },
      ],
      productos,
    );
    expect(lineas).toHaveLength(2);
    expect(lineas[0]).toMatchObject({ talla: 'S', cantidad: 4, subtotal: 160000 });
    expect(total).toBe(200000);
  });

  it('rechaza pedidos vacíos', () => {
    expect(() => construirLineasPedido([], productos)).toThrow(BadRequestException);
  });

  it('rechaza productos inexistentes o inactivos', () => {
    expect(() => construirLineasPedido([{ productoId: 99, talla: 'M', cantidad: 1 }], productos)).toThrow(
      BadRequestException,
    );
    expect(() => construirLineasPedido([{ productoId: 3, talla: 'M', cantidad: 1 }], productos)).toThrow(
      BadRequestException,
    );
  });

  it('rechaza tallas no disponibles para el producto', () => {
    expect(() => construirLineasPedido([{ productoId: 2, talla: 'XL', cantidad: 1 }], productos)).toThrow(
      /talla XL/,
    );
  });
});
