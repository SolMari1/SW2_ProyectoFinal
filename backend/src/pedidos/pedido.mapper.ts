import type { Categoria, EstadoPedido, Talla } from '../generated/prisma/client';

/** Estados tal como los muestra el frontend (src/types/order.ts). */
export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  PENDIENTE: 'Pendiente',
  EN_PROCESO: 'En proceso',
  ENVIADO: 'Enviado',
  COMPLETADO: 'Completado',
};

export const ESTADOS_LABELS = Object.values(ESTADO_LABEL);

export function estadoDesdeLabel(label: string): EstadoPedido | undefined {
  const entrada = Object.entries(ESTADO_LABEL).find(([, valor]) => valor === label);
  return entrada?.[0] as EstadoPedido | undefined;
}

export const PREFIJO_PEDIDO = 'PED-';

export function formatearCodigoPedido(id: number): string {
  return `${PREFIJO_PEDIDO}${id}`;
}

/** Acepta "PED-1001" o "1001". Devuelve null si no es un id válido. */
export function parsearCodigoPedido(codigo: string): number | null {
  const limpio = codigo.trim().toUpperCase().replace(PREFIJO_PEDIDO, '');
  if (!/^\d+$/.test(limpio)) return null;
  const id = Number(limpio);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

export const ZONA_HORARIA = 'America/Bogota';

/** Fecha YYYY-MM-DD en hora de Colombia. */
export function formatearFecha(fecha: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_HORARIA }).format(fecha);
}

export interface ItemPedidoPublico {
  productoId: number;
  nombreProducto: string;
  categoria: Categoria;
  talla: Talla;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

export interface PedidoPublico {
  id: string;
  clienteId: string;
  clienteNombre: string;
  clienteEmail: string;
  fecha: string;
  items: ItemPedidoPublico[];
  total: number;
  estado: string;
}

/** Forma del pedido que devuelve Prisma con `include: PEDIDO_INCLUDE`. */
export interface PedidoConRelaciones {
  id: number;
  clienteId: number;
  fecha: Date;
  total: number;
  estado: EstadoPedido;
  cliente: { nombre: string; email: string };
  items: Array<{
    id: number;
    productoId: number;
    talla: Talla;
    cantidad: number;
    precioUnitario: number;
    subtotal: number;
    producto: { nombre: string; categoria: Categoria };
  }>;
}

export const PEDIDO_INCLUDE = {
  cliente: { select: { nombre: true, email: true } },
  items: { include: { producto: { select: { nombre: true, categoria: true } } }, orderBy: { id: 'asc' } },
} as const;

export function toPedidoPublico(pedido: PedidoConRelaciones): PedidoPublico {
  return {
    id: formatearCodigoPedido(pedido.id),
    clienteId: String(pedido.clienteId),
    clienteNombre: pedido.cliente.nombre,
    clienteEmail: pedido.cliente.email,
    fecha: formatearFecha(pedido.fecha),
    items: pedido.items.map((item) => ({
      productoId: item.productoId,
      nombreProducto: item.producto.nombre,
      categoria: item.producto.categoria,
      talla: item.talla,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal,
    })),
    total: pedido.total,
    estado: ESTADO_LABEL[pedido.estado],
  };
}
