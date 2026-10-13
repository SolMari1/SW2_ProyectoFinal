// src/types/order.ts
// Definición de tipos de pedidos y registros de compras
import type { TallaRopa } from './product';

export type EstadoPedido = 'Completado' | 'Enviado' | 'En proceso' | 'Pendiente';

// Artículo incluido dentro de un pedido
export interface OrderItem {
  productoId: number;
  nombreProducto: string;
  categoria: string;
  talla: TallaRopa;
  cantidad: number;
  precioUnitario: number;
  subtotal: number;
}

// Estructura completa de un pedido
export interface Order {
  id: string; // Ej: "PED-1001"
  clienteId: string; // Ej: "cliente-1"
  clienteNombre: string;
  clienteEmail: string;
  fecha: string; // Formato YYYY-MM-DD
  items: OrderItem[];
  total: number;
  estado: EstadoPedido;
}
