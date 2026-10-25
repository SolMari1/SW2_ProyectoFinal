import { PEDIDOS, PRODUCTOS, USUARIOS, fechaSeed, lineasSeed, totalSeed } from './seed-data';

describe('seed-data', () => {
  it('los totales coinciden con los mocks originales del frontend', () => {
    const totales = Object.fromEntries(PEDIDOS.map((p) => [p.id, totalSeed(p)]));
    expect(totales).toEqual({
      1001: 329000,
      1002: 130000,
      1003: 295000,
      1004: 140000,
      1005: 234000,
      1006: 230000,
      2001: 214000,
      2002: 210000,
      2003: 308000,
      2004: 120000,
      2005: 375000,
      2006: 135000,
    });
  });

  it('cada pedido referencia clientes y productos existentes con tallas válidas', () => {
    const clientes = new Set(USUARIOS.filter((u) => u.rol === 'cliente').map((u) => u.id));
    const productos = new Map(PRODUCTOS.map((p) => [p.id, p]));
    for (const pedido of PEDIDOS) {
      expect(clientes.has(pedido.clienteId)).toBe(true);
      for (const item of pedido.items) {
        expect(productos.get(item.productoId)?.tallas).toContain(item.talla);
      }
    }
  });

  it('lineasSeed calcula el subtotal', () => {
    expect(lineasSeed(PEDIDOS[0])[1]).toMatchObject({ cantidad: 2, precioUnitario: 120000, subtotal: 240000 });
  });

  it('fechaSeed conserva el día en Colombia', () => {
    expect(fechaSeed('2026-08-14').toISOString()).toBe('2026-08-14T17:00:00.000Z');
  });

  it('los emails son únicos', () => {
    expect(new Set(USUARIOS.map((u) => u.email)).size).toBe(USUARIOS.length);
  });
});
