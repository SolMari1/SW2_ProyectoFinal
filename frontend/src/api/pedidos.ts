import api from './axios';
import type { NuevoPedido, Order } from '../types/order';

export const crearPedidoApi = async (pedido: NuevoPedido): Promise<Order> => {
  const response = await api.post<Order>('/pedidos', pedido);
  return response.data;
};

// Pedidos del cliente autenticado
export const obtenerMisPedidosApi = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/pedidos/mios');
  return response.data;
};

// Todos los pedidos (solo administrador)
export const obtenerTodosLosPedidosApi = async (): Promise<Order[]> => {
  const response = await api.get<Order[]>('/pedidos');
  return response.data;
};
