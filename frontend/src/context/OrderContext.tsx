// src/context/OrderContext.tsx
// Contexto global de pedidos conectado al backend
// - Cliente: GET /pedidos/mios
// - Admin: GET /pedidos
import { createContext, useContext, useState, useEffect, useCallback, type ReactNode, type FC } from 'react';
import type { NuevoPedido, Order } from '../types/order';
import { crearPedidoApi, obtenerMisPedidosApi, obtenerTodosLosPedidosApi } from '../api/pedidos';
import { useAuth } from '../hooks/useAuth';
import { mensajeDeError } from '../lib/errores';

interface OrderContextType {
  orders: Order[];
  cargando: boolean;
  error: string | null;
  registrarPedido: (nuevoPedido: NuevoPedido) => Promise<Order>;
  obtenerPedidosPorCliente: (clienteId: string) => Order[];
  recargarPedidos: () => Promise<void>;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isLoading: cargandoSesion } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recargarPedidos = useCallback(async () => {
    if (!user) {
      setOrders([]);
      return;
    }
    setCargando(true);
    setError(null);
    try {
      setOrders(user.role === 'admin' ? await obtenerTodosLosPedidosApi() : await obtenerMisPedidosApi());
    } catch (err) {
      setError(mensajeDeError(err, 'No se pudieron cargar los pedidos'));
    } finally {
      setCargando(false);
    }
  }, [user]);

  // Recargar cuando cambia el usuario (login, logout o cambio de cuenta)
  useEffect(() => {
    if (!cargandoSesion) void recargarPedidos();
  }, [cargandoSesion, recargarPedidos]);

  // Registra el pedido en el backend, que calcula precios y total
  const registrarPedido = async (nuevoPedido: NuevoPedido): Promise<Order> => {
    const creado = await crearPedidoApi(nuevoPedido);
    setOrders((prev) => [creado, ...prev]);
    return creado;
  };

  // Filtrar pedidos correspondientes a un cliente específico
  const obtenerPedidosPorCliente = (clienteId: string): Order[] => {
    return orders.filter((o) => o.clienteId === clienteId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        cargando,
        error,
        registrarPedido,
        obtenerPedidosPorCliente,
        recargarPedidos
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
