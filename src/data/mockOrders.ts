// src/data/mockOrders.ts
// Historial de pedidos iniciales para pruebas (Mínimo 6 pedidos diferentes para Cliente 1 y Cliente 2)
import type { Order } from '../types/order';

export const INITIAL_ORDERS: Order[] = [
  // ==========================================
  // PEDIDOS DE CLIENTE 1 (Carlos Mendoza) - 6 pedidos
  // ==========================================
  {
    id: 'PED-1001',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-08-14',
    items: [
      {
        productoId: 1,
        nombreProducto: 'Camisa Oversize de Lino',
        categoria: 'Camisas',
        talla: 'M',
        cantidad: 1,
        precioUnitario: 89000,
        subtotal: 89000
      },
      {
        productoId: 4,
        nombreProducto: 'Buzo Hoodie Básico con Capota',
        categoria: 'Buzos',
        talla: 'L',
        cantidad: 2,
        precioUnitario: 120000,
        subtotal: 240000
      }
    ],
    total: 329000,
    estado: 'Completado'
  },
  {
    id: 'PED-1002',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-08-28',
    items: [
      {
        productoId: 7,
        nombreProducto: 'Pantalón Cargo Unisex Streetwear',
        categoria: 'Pantalones',
        talla: 'L',
        cantidad: 1,
        precioUnitario: 130000,
        subtotal: 130000
      }
    ],
    total: 130000,
    estado: 'Completado'
  },
  {
    id: 'PED-1003',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-09-05',
    items: [
      {
        productoId: 2,
        nombreProducto: 'Camisa Clásica Oxford Blanca',
        categoria: 'Camisas',
        talla: 'M',
        cantidad: 2,
        precioUnitario: 95000,
        subtotal: 190000
      },
      {
        productoId: 5,
        nombreProducto: 'Buzo Cuello Redondo Minimalista',
        categoria: 'Buzos',
        talla: 'M',
        cantidad: 1,
        precioUnitario: 105000,
        subtotal: 105000
      }
    ],
    total: 295000,
    estado: 'Completado'
  },
  {
    id: 'PED-1004',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-09-19',
    items: [
      {
        productoId: 9,
        nombreProducto: 'Pantalón Denim Straight Baggy',
        categoria: 'Pantalones',
        talla: 'XL',
        cantidad: 1,
        precioUnitario: 140000,
        subtotal: 140000
      }
    ],
    total: 140000,
    estado: 'Enviado'
  },
  {
    id: 'PED-1005',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-10-01',
    items: [
      {
        productoId: 6,
        nombreProducto: 'Buzo Zip Cuello Alto Urbano',
        categoria: 'Buzos',
        talla: 'L',
        cantidad: 1,
        precioUnitario: 135000,
        subtotal: 135000
      },
      {
        productoId: 3,
        nombreProducto: 'Camisa Casual a Cuadros Leñadora',
        categoria: 'Camisas',
        talla: 'L',
        cantidad: 1,
        precioUnitario: 99000,
        subtotal: 99000
      }
    ],
    total: 234000,
    estado: 'Enviado'
  },
  {
    id: 'PED-1006',
    clienteId: 'cliente-1',
    clienteNombre: 'Carlos Mendoza',
    clienteEmail: 'cliente1@correo.com',
    fecha: '2026-10-09',
    items: [
      {
        productoId: 8,
        nombreProducto: 'Pantalón Jogger Relaxed en Dril',
        categoria: 'Pantalones',
        talla: 'M',
        cantidad: 2,
        precioUnitario: 115000,
        subtotal: 230000
      }
    ],
    total: 230000,
    estado: 'En proceso'
  },

  // ==========================================
  // PEDIDOS DE CLIENTE 2 (Andrea Gómez) - 6 pedidos diferentes
  // ==========================================
  {
    id: 'PED-2001',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-08-18',
    items: [
      {
        productoId: 3,
        nombreProducto: 'Camisa Casual a Cuadros Leñadora',
        categoria: 'Camisas',
        talla: 'S',
        cantidad: 1,
        precioUnitario: 99000,
        subtotal: 99000
      },
      {
        productoId: 8,
        nombreProducto: 'Pantalón Jogger Relaxed en Dril',
        categoria: 'Pantalones',
        talla: 'S',
        cantidad: 1,
        precioUnitario: 115000,
        subtotal: 115000
      }
    ],
    total: 214000,
    estado: 'Completado'
  },
  {
    id: 'PED-2002',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-08-30',
    items: [
      {
        productoId: 5,
        nombreProducto: 'Buzo Cuello Redondo Minimalista',
        categoria: 'Buzos',
        talla: 'M',
        cantidad: 2,
        precioUnitario: 105000,
        subtotal: 210000
      }
    ],
    total: 210000,
    estado: 'Completado'
  },
  {
    id: 'PED-2003',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-09-11',
    items: [
      {
        productoId: 1,
        nombreProducto: 'Camisa Oversize de Lino',
        categoria: 'Camisas',
        talla: 'S',
        cantidad: 2,
        precioUnitario: 89000,
        subtotal: 178000
      },
      {
        productoId: 7,
        nombreProducto: 'Pantalón Cargo Unisex Streetwear',
        categoria: 'Pantalones',
        talla: 'M',
        cantidad: 1,
        precioUnitario: 130000,
        subtotal: 130000
      }
    ],
    total: 308000,
    estado: 'Completado'
  },
  {
    id: 'PED-2004',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-09-24',
    items: [
      {
        productoId: 4,
        nombreProducto: 'Buzo Hoodie Básico con Capota',
        categoria: 'Buzos',
        talla: 'S',
        cantidad: 1,
        precioUnitario: 120000,
        subtotal: 120000
      }
    ],
    total: 120000,
    estado: 'Enviado'
  },
  {
    id: 'PED-2005',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-10-04',
    items: [
      {
        productoId: 9,
        nombreProducto: 'Pantalón Denim Straight Baggy',
        categoria: 'Pantalones',
        talla: 'M',
        cantidad: 2,
        precioUnitario: 140000,
        subtotal: 280000
      },
      {
        productoId: 2,
        nombreProducto: 'Camisa Clásica Oxford Blanca',
        categoria: 'Camisas',
        talla: 'S',
        cantidad: 1,
        precioUnitario: 95000,
        subtotal: 95000
      }
    ],
    total: 375000,
    estado: 'En proceso'
  },
  {
    id: 'PED-2006',
    clienteId: 'cliente-2',
    clienteNombre: 'Andrea Gómez',
    clienteEmail: 'cliente2@correo.com',
    fecha: '2026-10-11',
    items: [
      {
        productoId: 6,
        nombreProducto: 'Buzo Zip Cuello Alto Urbano',
        categoria: 'Buzos',
        talla: 'M',
        cantidad: 1,
        precioUnitario: 135000,
        subtotal: 135000
      }
    ],
    total: 135000,
    estado: 'Pendiente'
  }
];
