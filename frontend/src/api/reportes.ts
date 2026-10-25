import api from './axios';
import type { ConsolidadoProducto, FilaClienteCompra, Pagina, ResumenGeneral } from '../types/report';

export const obtenerInformeClientesComprasApi = async (
  pagina: number,
  porPagina: number
): Promise<Pagina<FilaClienteCompra>> => {
  const response = await api.get<Pagina<FilaClienteCompra>>('/reportes/clientes-compras', {
    params: { pagina, porPagina }
  });
  return response.data;
};

export const obtenerInformeProductosApi = async (): Promise<ConsolidadoProducto[]> => {
  const response = await api.get<ConsolidadoProducto[]>('/reportes/productos');
  return response.data;
};

export const obtenerInformeResumenApi = async (): Promise<ResumenGeneral> => {
  const response = await api.get<ResumenGeneral>('/reportes/resumen');
  return response.data;
};
