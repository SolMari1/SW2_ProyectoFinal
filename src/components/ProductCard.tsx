
// Componente de tarjeta para representar cada prenda en el catálogo
import type { FC } from 'react';
import type { Product } from '../types/product';
import { useAuth } from '../hooks/useAuth';

interface ProductCardProps {
  product: Product;
  onVerDetalles: (producto: Product) => void;
}

// Función auxiliar para formatear los precios a pesos colombianos (COP)
const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export const ProductCard: FC<ProductCardProps> = ({ product, onVerDetalles }) => {
  const { user } = useAuth();
  const esAdmin = user?.role === 'admin';

  return (
    <div className="card-producto">
      {/* Contenedor de la imagen */}
      <div className="card-producto__imagen-contenedor" onClick={() => onVerDetalles(product)}>
        <img
          src={product.imagen}
          alt={product.nombre}
          className="card-producto__imagen"
          loading="lazy"

        />
      </div>

      {/* Información principal de la prenda */}
      <div className="card-producto__cuerpo">
        {/* Categoría */}
        <div className="card-producto__meta">
          <span className="card-producto__categoria">{product.categoria}</span>
        </div>

        {/* Título o nombre de la prenda */}
        <h3
          className="card-producto__titulo"
          onClick={() => onVerDetalles(product)}
          title={product.nombre}
        >
          {product.nombre}
        </h3>

        {/* Breve descripción */}
        <p className="card-producto__descripcion">{product.descripcion}</p>

        {/* Muestra de tallas unisex disponibles (S, M, L, XL) */}
        <div className="card-producto__tallas-contenedor">
          <span className="tallas-etiqueta">Tallas disponibles:</span>
          <div className="tallas-lista">
            {product.tallas.map((talla) => (
              <span key={talla} className="talla-insignia">
                {talla}
              </span>
            ))}
          </div>
        </div>

        {/* Indicador de gestión del pedido / envío (Dropshipping) */}
        <div className="card-producto__estado-envio">
          <span className="texto-envio">
            {product.tiempoEntregaEstimado || 'Envío directo garantizado'}
          </span>
        </div>

        {/* Precio único  */}
        <div className="card-producto__precios">
          <span className="precio-actual">{formatearMoneda(product.precio)}</span>
        </div>

        {/* Botón de acción */}
        <div className="card-producto__acciones">
          <button
            type="button"
            className="btn-ver-detalle"
            onClick={() => onVerDetalles(product)}
          >
            {esAdmin ? 'Ver Detalles (Solo Lectura)' : 'Ver Detalles y Comprar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
