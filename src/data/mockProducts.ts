// src/data/mockProducts.ts
// Catálogo de prendas de vestir unisex (Camisas, Pantalones y Buzos en tallas S, M, L, XL)
// Sin calificaciones, sin descuentos ni etiquetas promocionales
import type { Product, TallaRopa } from '../types/product';

// Tallas universales disponibles en todo el catálogo
const TALLAS_UNIVERSALES: TallaRopa[] = ['S', 'M', 'L', 'XL'];

export const MOCK_PRODUCTS: Product[] = [
  // --- CAMISAS ---
  {
    id: 1,
    nombre: 'Camisa Oversize de Lino',
    descripcion: 'Camisa fresca de corte holgado unisex en tejido de lino transpirable con botones de madera.',
    precio: 89000,
    categoria: 'Camisas',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 2 a 4 días hábiles'
  },
  {
    id: 2,
    nombre: 'Camisa Clásica Oxford Blanca',
    descripcion: 'Camisa de algodón peinado con cuello estructurado y ajuste regular. Diseño versátil para cualquier ocasión.',
    precio: 95000,
    categoria: 'Camisas',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 2 a 4 días hábiles'
  },
  {
    id: 3,
    nombre: 'Camisa Casual a Cuadros Leñadora',
    descripcion: 'Camisa confeccionada en franela suave y abrigada con doble bolsillo frontal y patrón a cuadros.',
    precio: 99000,
    categoria: 'Camisas',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1589310243389-968571370c84?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 3 a 5 días hábiles'
  },

  // --- BUZOS ---
  {
    id: 4,
    nombre: 'Buzo Hoodie Básico con Capota',
    descripcion: 'Buzo con bolsillo canguro frontal, capota amplia y forro interior afelpado en algodón pesado unisex.',
    precio: 120000,
    categoria: 'Buzos',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 2 a 4 días hábiles'
  },
  {
    id: 5,
    nombre: 'Buzo Cuello Redondo Minimalista',
    descripcion: 'Buzo de corte relajado sin capota, tejido suave con puños reforzados en canalé para máxima comodidad.',
    precio: 105000,
    categoria: 'Buzos',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 3 a 5 días hábiles'
  },
  {
    id: 6,
    nombre: 'Buzo Zip Cuello Alto Urbano',
    descripcion: 'Buzo deportivo con cremallera media en el cuello y tejido térmico transpirable de alta densidad.',
    precio: 135000,
    categoria: 'Buzos',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1578587018452-892bacefd3f2?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 3 a 5 días hábiles'
  },

  // --- PANTALONES ---
  {
    id: 7,
    nombre: 'Pantalón Cargo Unisex Streetwear',
    descripcion: 'Pantalón resistente con bolsillos utilitarios laterales, pretina ajustable con cordón y bota recta.',
    precio: 130000,
    categoria: 'Pantalones',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 2 a 4 días hábiles'
  },
  {
    id: 8,
    nombre: 'Pantalón Jogger Relaxed en Dril',
    descripcion: 'Jogger cómodo en dril elástico con elástico en tobillos y cintura ajustable. Ideal para uso diario.',
    precio: 115000,
    categoria: 'Pantalones',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1517445312882-bc9910d016b7?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 2 a 4 días hábiles'
  },
  {
    id: 9,
    nombre: 'Pantalón Denim Straight Baggy',
    descripcion: 'Jean de silueta amplia recta, confeccionado en denim resistente sin elastano para caída natural.',
    precio: 140000,
    categoria: 'Pantalones',
    tallas: TALLAS_UNIVERSALES,
    imagen: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=800&q=80',
    tiempoEntregaEstimado: 'Envío directo de 3 a 5 días hábiles'
  }
];
