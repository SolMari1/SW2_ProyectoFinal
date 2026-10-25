import type { PedidoPublico } from '../pedidos/pedido.mapper';
import { consolidadoPorProducto, filasClientesCompras, paginar, resumenGeneral } from './reportes.calculos';

const item = (productoId: number, nombre: string, cantidad: number, precio: number) => ({
  productoId,
  nombreProducto: nombre,
  categoria: 'Camisas' as const,
  talla: 'M' as const,
  cantidad,
  precioUnitario: precio,
  subtotal: cantidad * precio,
});

const pedidos: PedidoPublico[] = [
  {
    id: 'PED-1',
    clienteId: '1',
    clienteNombre: 'Carlos',
    clienteEmail: 'c@correo.com',
    fecha: '2026-08-14',
    items: [item(1, 'Camisa', 2, 1000), item(2, 'Buzo', 1, 5000)],
    total: 7000,
    estado: 'Completado',
  },
  {
    id: 'PED-2',
    clienteId: '1',
    clienteNombre: 'Carlos',
    clienteEmail: 'c@correo.com',
    fecha: '2026-08-20',
    items: [item(1, 'Camisa', 1, 1000)],
    total: 1000,
    estado: 'Enviado',
  },
  {
    id: 'PED-3',
    clienteId: '2',
    clienteNombre: 'Andrea',
    clienteEmail: 'a@correo.com',
    fecha: '2026-08-21',
    items: [item(2, 'Buzo', 4, 5000)],
    total: 20000,
    estado: 'Pendiente',
  },
];

describe('filasClientesCompras', () => {
  it('genera una fila por línea de pedido', () => {
    const filas = filasClientesCompras(pedidos);
    expect(filas).toHaveLength(4);
    expect(filas[0]).toMatchObject({ idFila: 'PED-1-0', cliente: 'Carlos', producto: 'Camisa', totalItem: 2000 });
    expect(filas[1].idFila).toBe('PED-1-1');
  });
});

describe('paginar', () => {
  const lista = [1, 2, 3, 4, 5, 6, 7];

  it('devuelve la página pedida', () => {
    expect(paginar(lista, 2, 5)).toEqual({ filas: [6, 7], total: 7, pagina: 2, porPagina: 5, totalPaginas: 2 });
  });

  it('ajusta páginas fuera de rango', () => {
    expect(paginar(lista, 9, 5).pagina).toBe(2);
    expect(paginar(lista, 0, 5).pagina).toBe(1);
  });

  it('una lista vacía tiene una página', () => {
    expect(paginar([], 1, 5)).toEqual({ filas: [], total: 0, pagina: 1, porPagina: 5, totalPaginas: 1 });
  });
});

describe('consolidadoPorProducto', () => {
  it('suma unidades y cuenta pedidos distintos, de mayor a menor', () => {
    expect(consolidadoPorProducto(pedidos)).toEqual([
      { productoId: 2, nombre: 'Buzo', categoria: 'Camisas', cantidadTotal: 5, pedidosCount: 2 },
      { productoId: 1, nombre: 'Camisa', categoria: 'Camisas', cantidadTotal: 3, pedidosCount: 2 },
    ]);
  });
});

describe('resumenGeneral', () => {
  it('calcula totales y rankings', () => {
    const resumen = resumenGeneral(pedidos);
    expect(resumen).toMatchObject({
      totalPedidos: 3,
      totalFacturado: 28000,
      totalProductosVendidos: 8,
      totalClientes: 2,
    });
    expect(resumen.topClientes.map((c) => c.nombre)).toEqual(['Carlos', 'Andrea']);
    expect(resumen.topClientes[0]).toMatchObject({ pedidos: 2, totalGastado: 8000 });
    expect(resumen.topProductos).toHaveLength(2);
  });

  it('desempata clientes por monto gastado', () => {
    const resumen = resumenGeneral([pedidos[1], pedidos[2]]);
    expect(resumen.topClientes.map((c) => c.nombre)).toEqual(['Andrea', 'Carlos']);
  });

  it('sin pedidos todo es cero', () => {
    expect(resumenGeneral([])).toEqual({
      totalPedidos: 0,
      totalFacturado: 0,
      totalProductosVendidos: 0,
      totalClientes: 0,
      topClientes: [],
      topProductos: [],
    });
  });
});
