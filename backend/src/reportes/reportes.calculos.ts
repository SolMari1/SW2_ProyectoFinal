import type { PedidoPublico } from '../pedidos/pedido.mapper';

export interface FilaClienteCompra {
  idFila: string;
  cliente: string;
  email: string;
  idPedido: string;
  fecha: string;
  producto: string;
  categoria: string;
  talla: string;
  cantidad: number;
  precioUnitario: number;
  totalItem: number;
  estado: string;
}

export interface Pagina<T> {
  filas: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

export interface ConsolidadoProducto {
  productoId: number;
  nombre: string;
  categoria: string;
  cantidadTotal: number;
  pedidosCount: number;
}

export interface ResumenCliente {
  clienteId: string;
  nombre: string;
  pedidos: number;
  totalGastado: number;
}

export interface ResumenGeneral {
  totalPedidos: number;
  totalFacturado: number;
  totalProductosVendidos: number;
  totalClientes: number;
  topClientes: ResumenCliente[];
  topProductos: ConsolidadoProducto[];
}

export const TOP_PRODUCTOS = 5;

/** Informe 1: una fila por cada línea de cada pedido. */
export function filasClientesCompras(pedidos: PedidoPublico[]): FilaClienteCompra[] {
  return pedidos.flatMap((pedido) =>
    pedido.items.map((item, index) => ({
      idFila: `${pedido.id}-${index}`,
      cliente: pedido.clienteNombre,
      email: pedido.clienteEmail,
      idPedido: pedido.id,
      fecha: pedido.fecha,
      producto: item.nombreProducto,
      categoria: item.categoria,
      talla: item.talla,
      cantidad: item.cantidad,
      precioUnitario: item.precioUnitario,
      totalItem: item.subtotal,
      estado: pedido.estado,
    })),
  );
}

/** Pagina una lista. Una página fuera de rango se ajusta a la primera o la última. */
export function paginar<T>(filas: T[], pagina: number, porPagina: number): Pagina<T> {
  const totalPaginas = Math.max(1, Math.ceil(filas.length / porPagina));
  const actual = Math.min(Math.max(1, pagina), totalPaginas);
  const inicio = (actual - 1) * porPagina;
  return {
    filas: filas.slice(inicio, inicio + porPagina),
    total: filas.length,
    pagina: actual,
    porPagina,
    totalPaginas,
  };
}

/** Informe 2: unidades pedidas y número de pedidos por producto, de mayor a menor demanda. */
export function consolidadoPorProducto(pedidos: PedidoPublico[]): ConsolidadoProducto[] {
  const mapa = new Map<number, ConsolidadoProducto & { pedidosIds: Set<string> }>();

  for (const pedido of pedidos) {
    for (const item of pedido.items) {
      const actual = mapa.get(item.productoId) ?? {
        productoId: item.productoId,
        nombre: item.nombreProducto,
        categoria: item.categoria,
        cantidadTotal: 0,
        pedidosCount: 0,
        pedidosIds: new Set<string>(),
      };
      actual.cantidadTotal += item.cantidad;
      actual.pedidosIds.add(pedido.id);
      mapa.set(item.productoId, actual);
    }
  }

  return Array.from(mapa.values())
    .map(({ pedidosIds, ...resto }) => ({ ...resto, pedidosCount: pedidosIds.size }))
    .sort((a, b) => b.cantidadTotal - a.cantidadTotal || a.nombre.localeCompare(b.nombre));
}

/** Informe 3: totales globales, top clientes y top productos. */
export function resumenGeneral(pedidos: PedidoPublico[]): ResumenGeneral {
  const porCliente = new Map<string, ResumenCliente>();
  let totalProductosVendidos = 0;

  for (const pedido of pedidos) {
    const cliente = porCliente.get(pedido.clienteId) ?? {
      clienteId: pedido.clienteId,
      nombre: pedido.clienteNombre,
      pedidos: 0,
      totalGastado: 0,
    };
    cliente.pedidos += 1;
    cliente.totalGastado += pedido.total;
    porCliente.set(pedido.clienteId, cliente);

    totalProductosVendidos += pedido.items.reduce((acc, item) => acc + item.cantidad, 0);
  }

  return {
    totalPedidos: pedidos.length,
    totalFacturado: pedidos.reduce((acc, pedido) => acc + pedido.total, 0),
    totalProductosVendidos,
    totalClientes: porCliente.size,
    topClientes: Array.from(porCliente.values()).sort(
      (a, b) => b.pedidos - a.pedidos || b.totalGastado - a.totalGastado,
    ),
    topProductos: consolidadoPorProducto(pedidos).slice(0, TOP_PRODUCTOS),
  };
}
