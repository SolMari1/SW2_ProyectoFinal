// src/types/product.ts
// Definición de tipos de datos para los productos de ropa (Modelo Dropshipping Unisex)
// Sin calificaciones, sin descuentos ni etiquetas promocionales

// Tallas disponibles estándar para todas las prendas
export type TallaRopa = 'S' | 'M' | 'L' | 'XL';

// Categorías exclusivas de la tienda
export type CategoriaRopa = 'Camisas' | 'Pantalones' | 'Buzos';

export interface Product {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  categoria: CategoriaRopa;
  tallas: TallaRopa[]; // Tallas unisex disponibles (S, M, L, XL)
  imagen: string;
  tiempoEntregaEstimado?: string; // Información de despacho directo para dropshipping
}

// Elemento individual dentro del carrito de compras
export interface CartItem {
  id: string; // Identificador único compuesto (ej. `prod-1-M`)
  producto: Product;
  talla: TallaRopa;
  cantidad: number;
}
