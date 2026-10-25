import api from './axios';
import type { Product } from '../types/product';
import { resolverImagenProducto } from '../lib/imagenProducto';

export const obtenerProductosApi = async (): Promise<Product[]> => {
  const response = await api.get<Product[]>('/productos');
  return response.data.map((producto) => ({
    ...producto,
    imagen: resolverImagenProducto(producto.imagen),
  }));
};
