import { BadRequestException } from '@nestjs/common';
import type { Talla } from '../generated/prisma/client';

export interface ItemSolicitado {
  productoId: number;
  talla: Talla;
  cantidad: number;
}

export interface ProductoParaPedido {
  id: number;
  nombre: string;
  precio: number;
  tallas: Talla[];
  activo: boolean;
}

export interface LineaPedido {
  productoId: number;
  talla: Talla;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

/**
 * Arma las líneas del pedido con el precio actual del catálogo (nunca el que manda el cliente).
 * Agrupa líneas repetidas del mismo producto y talla.
 */
export function construirLineasPedido(
  items: ItemSolicitado[],
  productos: ProductoParaPedido[],
): { lineas: LineaPedido[]; total: number } {
  if (items.length === 0) throw new BadRequestException('El pedido debe tener al menos un producto');

  const porId = new Map(productos.map((p) => [p.id, p]));
  const agrupadas = new Map<string, LineaPedido>();

  for (const item of items) {
    const producto = porId.get(item.productoId);
    if (!producto || !producto.activo) {
      throw new BadRequestException(`El producto ${item.productoId} no existe o no está disponible`);
    }
    if (!producto.tallas.includes(item.talla)) {
      throw new BadRequestException(`La talla ${item.talla} no está disponible para ${producto.nombre}`);
    }

    const clave = `${item.productoId}-${item.talla}`;
    const existente = agrupadas.get(clave);
    const cantidad = (existente?.cantidad ?? 0) + item.cantidad;
    agrupadas.set(clave, {
      productoId: producto.id,
      talla: item.talla,
      cantidad,
      precioUnitario: producto.precio,
      subtotal: producto.precio * cantidad,
    });
  }

  const lineas = Array.from(agrupadas.values());
  const total = lineas.reduce((acc, linea) => acc + linea.subtotal, 0);
  return { lineas, total };
}
