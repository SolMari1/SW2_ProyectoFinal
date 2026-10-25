// Datos iniciales tomados de los mocks del frontend (src/data/mock*.ts).
import type { Categoria, EstadoPedido, Rol, Talla } from '../src/generated/prisma/client';

export interface UsuarioSeed {
  id: number;
  nombre: string;
  email: string;
  password: string;
  rol: Rol;
}

export interface ProductoSeed {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: Categoria;
  tallas: Talla[];
  imagen: string;
  tiempoEntregaEstimado: string;
}

export interface PedidoSeed {
  id: number;
  clienteId: number;
  fecha: string; // YYYY-MM-DD
  estado: EstadoPedido;
  items: Array<{ productoId: number; talla: Talla; cantidad: number; precioUnitario: number }>;
}

const TALLAS: Talla[] = ['S', 'M', 'L', 'XL'];
const ENVIO_2_4 = 'Envío directo de 2 a 4 días hábiles';
const ENVIO_3_5 = 'Envío directo de 3 a 5 días hábiles';

export const USUARIOS: UsuarioSeed[] = [
  { id: 1, nombre: 'Carlos Mendoza', email: 'cliente1@correo.com', password: 'password123', rol: 'cliente' },
  { id: 2, nombre: 'Andrea Gómez', email: 'cliente2@correo.com', password: 'password123', rol: 'cliente' },
  { id: 3, nombre: 'Administrador SW2', email: 'admin@correo.com', password: 'adminpassword', rol: 'admin' },
];

export const PRODUCTOS: ProductoSeed[] = [
  {
    id: 1,
    nombre: 'Camisa Oversize de Lino',
    descripcion: 'Camisa fresca de corte holgado unisex en tejido de lino transpirable con botones de madera.',
    precio: 40000,
    categoria: 'Camisas',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_2_4,
  },
  {
    id: 2,
    nombre: 'Camisa Clásica Oxford Blanca',
    descripcion:
      'Camisa de algodón peinado con cuello estructurado y ajuste regular. Diseño versátil para cualquier ocasión.',
    precio: 45000,
    categoria: 'Camisas',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_2_4,
  },
  {
    id: 3,
    nombre: 'Camisa Casual a Cuadros Leñadora',
    descripcion: 'Camisa confeccionada en franela suave y abrigada con doble bolsillo frontal y patrón a cuadros.',
    precio: 35000,
    categoria: 'Camisas',
    tallas: TALLAS,
    // Archivo local en frontend/src/assets/productos
    imagen: 'camisacuadros.jpg',
    tiempoEntregaEstimado: ENVIO_3_5,
  },
  {
    id: 4,
    nombre: 'Buzo Hoodie Básico con Capota',
    descripcion:
      'Buzo con bolsillo canguro frontal, capota amplia y forro interior afelpado en algodón pesado unisex.',
    precio: 90000,
    categoria: 'Buzos',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_2_4,
  },
  {
    id: 5,
    nombre: 'Buzo Cuello Redondo Minimalista',
    descripcion:
      'Buzo de corte relajado sin capota, tejido suave con puños reforzados en canalé para máxima comodidad.',
    precio: 75000,
    categoria: 'Buzos',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_3_5,
  },
  {
    id: 6,
    nombre: 'Buzo Zip Cuello Alto Urbano',
    descripcion: 'Buzo deportivo con cremallera media en el cuello y tejido térmico transpirable de alta densidad.',
    precio: 70000,
    categoria: 'Buzos',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_3_5,
  },
  {
    id: 7,
    nombre: 'Pantalón Cargo Unisex Streetwear',
    descripcion:
      'Pantalón resistente con bolsillos utilitarios laterales, pretina ajustable con cordón y bota recta.',
    precio: 70000,
    categoria: 'Pantalones',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_2_4,
  },
  {
    id: 8,
    nombre: 'Pantalón Jogger Relaxed en Dril',
    descripcion:
      'Jogger cómodo en dril elástico con elástico en tobillos y cintura ajustable. Ideal para uso diario.',
    precio: 100000,
    categoria: 'Pantalones',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_2_4,
  },
  {
    id: 9,
    nombre: 'Pantalón Denim Straight Baggy',
    descripcion: 'Jean de silueta amplia recta, confeccionado en denim resistente sin elastano para caída natural.',
    precio: 55000,
    categoria: 'Pantalones',
    tallas: TALLAS,
    imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: ENVIO_3_5,
  },
];

// Pedidos históricos: el precio unitario es el que tenía la prenda al momento de la compra
export const PEDIDOS: PedidoSeed[] = [
  // Cliente 1
  {
    id: 1001,
    clienteId: 1,
    fecha: '2026-08-14',
    estado: 'COMPLETADO',
    items: [
      { productoId: 1, talla: 'M', cantidad: 1, precioUnitario: 89000 },
      { productoId: 4, talla: 'L', cantidad: 2, precioUnitario: 120000 },
    ],
  },
  {
    id: 1002,
    clienteId: 1,
    fecha: '2026-08-28',
    estado: 'COMPLETADO',
    items: [{ productoId: 7, talla: 'L', cantidad: 1, precioUnitario: 130000 }],
  },
  {
    id: 1003,
    clienteId: 1,
    fecha: '2026-09-05',
    estado: 'COMPLETADO',
    items: [
      { productoId: 2, talla: 'M', cantidad: 2, precioUnitario: 95000 },
      { productoId: 5, talla: 'M', cantidad: 1, precioUnitario: 105000 },
    ],
  },
  {
    id: 1004,
    clienteId: 1,
    fecha: '2026-09-19',
    estado: 'ENVIADO',
    items: [{ productoId: 9, talla: 'XL', cantidad: 1, precioUnitario: 140000 }],
  },
  {
    id: 1005,
    clienteId: 1,
    fecha: '2026-10-01',
    estado: 'ENVIADO',
    items: [
      { productoId: 6, talla: 'L', cantidad: 1, precioUnitario: 135000 },
      { productoId: 3, talla: 'L', cantidad: 1, precioUnitario: 99000 },
    ],
  },
  {
    id: 1006,
    clienteId: 1,
    fecha: '2026-10-09',
    estado: 'EN_PROCESO',
    items: [{ productoId: 8, talla: 'M', cantidad: 2, precioUnitario: 115000 }],
  },
  // Cliente 2
  {
    id: 2001,
    clienteId: 2,
    fecha: '2026-08-18',
    estado: 'COMPLETADO',
    items: [
      { productoId: 3, talla: 'S', cantidad: 1, precioUnitario: 99000 },
      { productoId: 8, talla: 'S', cantidad: 1, precioUnitario: 115000 },
    ],
  },
  {
    id: 2002,
    clienteId: 2,
    fecha: '2026-08-30',
    estado: 'COMPLETADO',
    items: [{ productoId: 5, talla: 'M', cantidad: 2, precioUnitario: 105000 }],
  },
  {
    id: 2003,
    clienteId: 2,
    fecha: '2026-09-11',
    estado: 'COMPLETADO',
    items: [
      { productoId: 1, talla: 'S', cantidad: 2, precioUnitario: 89000 },
      { productoId: 7, talla: 'M', cantidad: 1, precioUnitario: 130000 },
    ],
  },
  {
    id: 2004,
    clienteId: 2,
    fecha: '2026-09-24',
    estado: 'ENVIADO',
    items: [{ productoId: 4, talla: 'S', cantidad: 1, precioUnitario: 120000 }],
  },
  {
    id: 2005,
    clienteId: 2,
    fecha: '2026-10-04',
    estado: 'EN_PROCESO',
    items: [
      { productoId: 9, talla: 'M', cantidad: 2, precioUnitario: 140000 },
      { productoId: 2, talla: 'S', cantidad: 1, precioUnitario: 95000 },
    ],
  },
  {
    id: 2006,
    clienteId: 2,
    fecha: '2026-10-11',
    estado: 'PENDIENTE',
    items: [{ productoId: 6, talla: 'M', cantidad: 1, precioUnitario: 135000 }],
  },
];

/** Mediodía en Colombia, para que la fecha no cambie al convertir zonas horarias. */
export function fechaSeed(fecha: string): Date {
  return new Date(`${fecha}T12:00:00-05:00`);
}

export function lineasSeed(pedido: PedidoSeed) {
  return pedido.items.map((item) => ({ ...item, subtotal: item.precioUnitario * item.cantidad }));
}

export function totalSeed(pedido: PedidoSeed): number {
  return lineasSeed(pedido).reduce((acc, linea) => acc + linea.subtotal, 0);
}
