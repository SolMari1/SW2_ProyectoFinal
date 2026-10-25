import {
  ESTADO_LABEL,
  PedidoConRelaciones,
  estadoDesdeLabel,
  formatearCodigoPedido,
  formatearFecha,
  parsearCodigoPedido,
  toPedidoPublico,
} from './pedido.mapper';

describe('estadoDesdeLabel', () => {
  it('convierte cada label en su enum', () => {
    for (const [enumValue, label] of Object.entries(ESTADO_LABEL)) {
      expect(estadoDesdeLabel(label)).toBe(enumValue);
    }
  });

  it('devuelve undefined para labels desconocidos', () => {
    expect(estadoDesdeLabel('Cancelado')).toBeUndefined();
  });
});

describe('códigos de pedido', () => {
  it('formatea con prefijo PED-', () => {
    expect(formatearCodigoPedido(1001)).toBe('PED-1001');
  });

  it('acepta código con prefijo, sin prefijo y en minúscula', () => {
    expect(parsearCodigoPedido('PED-1001')).toBe(1001);
    expect(parsearCodigoPedido('1001')).toBe(1001);
    expect(parsearCodigoPedido('ped-7')).toBe(7);
  });

  it('rechaza códigos inválidos', () => {
    expect(parsearCodigoPedido('PED-abc')).toBeNull();
    expect(parsearCodigoPedido('PED-0')).toBeNull();
    expect(parsearCodigoPedido('')).toBeNull();
    expect(parsearCodigoPedido('99999999999999999999')).toBeNull();
  });
});

describe('formatearFecha', () => {
  it('usa la fecha de Colombia y no la UTC', () => {
    // 02:00 UTC del 15 = 21:00 del 14 en Bogotá
    expect(formatearFecha(new Date('2026-08-15T02:00:00Z'))).toBe('2026-08-14');
  });
});

describe('toPedidoPublico', () => {
  const pedido: PedidoConRelaciones = {
    id: 1001,
    clienteId: 3,
    fecha: new Date('2026-08-14T17:00:00Z'),
    total: 329000,
    estado: 'EN_PROCESO',
    cliente: { nombre: 'Carlos Mendoza', email: 'cliente1@correo.com' },
    items: [
      {
        id: 1,
        productoId: 4,
        talla: 'L',
        cantidad: 2,
        precioUnitario: 120000,
        subtotal: 240000,
        producto: { nombre: 'Buzo Hoodie', categoria: 'Buzos' },
      },
    ],
  };

  it('devuelve el formato que espera el frontend', () => {
    expect(toPedidoPublico(pedido)).toEqual({
      id: 'PED-1001',
      clienteId: '3',
      clienteNombre: 'Carlos Mendoza',
      clienteEmail: 'cliente1@correo.com',
      fecha: '2026-08-14',
      items: [
        {
          productoId: 4,
          nombreProducto: 'Buzo Hoodie',
          categoria: 'Buzos',
          talla: 'L',
          cantidad: 2,
          precioUnitario: 120000,
          subtotal: 240000,
        },
      ],
      total: 329000,
      estado: 'En proceso',
    });
  });
});
