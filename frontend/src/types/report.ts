// src/types/report.ts
// Respuestas de los informes del administrador (GET /reportes/*)

export interface Pagina<T> {
  filas: T[];
  total: number;
  pagina: number;
  porPagina: number;
  totalPaginas: number;
}

// Informe 1: una fila por cada prenda de cada pedido
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

// Informe 2: demanda por prenda
export interface ConsolidadoProducto {
  productoId: number;
  nombre: string;
  categoria: string;
  cantidadTotal: number;
  pedidosCount: number;
}

// Informe 3: resumen general
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
