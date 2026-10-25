import type { Categoria, Producto, Talla } from '../generated/prisma/client';

/** Producto tal como lo espera el frontend (src/types/product.ts). */
export interface ProductoPublico {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  tallas: Talla[];
  imagen: string;
  tiempoEntregaEstimado?: string;
}

export const ORDEN_TALLAS: Talla[] = ['S', 'M', 'L', 'XL'];

export function toProductoPublico(producto: Producto): ProductoPublico {
  return {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    categoria: producto.categoria,
    tallas: ORDEN_TALLAS.filter((talla) => producto.tallas.includes(talla)),
    imagen: producto.imagen,
    ...(producto.tiempoEntregaEstimado ? { tiempoEntregaEstimado: producto.tiempoEntregaEstimado } : {}),
  };
}
