// src/context/OrderContext.tsx
// Contexto global para la gestión reactiva de pedidos simulados en el frontend
import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from 'react';
import type { Order, OrderItem } from '../types/order';
import { INITIAL_ORDERS } from '../data/mockOrders';

interface OrderContextType {
  orders: Order[];
  registrarPedido: (nuevoPedido: {
    clienteId: string;
    clienteNombre: string;
    clienteEmail: string;
    items: OrderItem[];
    total: number;
  }) => Promise<Order>;
  obtenerPedidosPorCliente: (clienteId: string) => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  // Inicializamos pedidos desde localStorage o desde los pedidos iniciales
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const guardados = localStorage.getItem('sw2_orders');
      return guardados ? JSON.parse(guardados) : INITIAL_ORDERS;
    } catch {
      return INITIAL_ORDERS;
    }
  });

  // Guardar en localStorage ante cualquier cambio para persistencia entre recargas
  useEffect(() => {
    localStorage.setItem('sw2_orders', JSON.stringify(orders));
  }, [orders]);

  // Función para registrar un nuevo pedido al pagar
  const registrarPedido = async (datos: {
    clienteId: string;
    clienteNombre: string;
    clienteEmail: string;
    items: OrderItem[];
    total: number;
  }): Promise<Order> => {
    // Generar un consecutivo de pedido único
    const nuevoId = `PED-${1000 + orders.length + 1}`;
    const fechaActual = new Date().toISOString().split('T')[0];

    const nuevoPedido: Order = {
      id: nuevoId,
      clienteId: datos.clienteId,
      clienteNombre: datos.clienteNombre,
      clienteEmail: datos.clienteEmail,
      fecha: fechaActual,
      items: datos.items,
      total: datos.total,
      estado: 'En proceso'
    };

    // =========================================================================
    // TODO: conectar con endpoint POST /pedidos cuando el backend esté disponible
    // Ejemplo:
    // await api.post('/pedidos', nuevoPedido);
    // =========================================================================

    setOrders((prev) => [nuevoPedido, ...prev]);
    return nuevoPedido;
  };

  // Filtrar pedidos correspondientes a un cliente específico
  const obtenerPedidosPorCliente = (clienteId: string): Order[] => {
    return orders.filter((o) => o.clienteId === clienteId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        registrarPedido,
        obtenerPedidosPorCliente
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = (): OrderContextType => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de un OrderProvider');
  }
  return context;
};
