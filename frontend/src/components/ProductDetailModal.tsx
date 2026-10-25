// Detalles de producto, primero talla, luego seleccionar la cantidad
import { useState, useEffect, type FC } from 'react';
import type { Product, TallaRopa } from '../types/product';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';

interface ProductDetailModalProps {
  product: Product | null;
  onCerrar: () => void;
  onProductoAgregado?: (mensaje: string) => void;
}

// Función auxiliar de formateo monetario
const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export const ProductDetailModal: FC<ProductDetailModalProps> = ({
  product,
  onCerrar,
  onProductoAgregado
}) => {
  const { user } = useAuth();
  const { agregarAlCarrito } = useCart();
  const esAdmin = user?.role === 'admin';

  // primero seleccionar talla, luego se habilita la cantidad
  const [tallaSeleccionada, setTallaSeleccionada] = useState<TallaRopa | null>(null);
  const [cantidad, setCantidad] = useState<number>(1);
  const [mensajeError, setMensajeError] = useState<string>('');

  // Reiniciar estado cuando cambie el producto
  useEffect(() => {
    setTallaSeleccionada(null);
    setCantidad(1);
    setMensajeError('');
  }, [product]);

  // Manejo de la tecla Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onCerrar();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onCerrar]);

  if (!product) return null;

  const handleSeleccionarTalla = (talla: TallaRopa) => {
    setTallaSeleccionada(talla);
    setMensajeError('');
  };

  const handleIncrementarCantidad = () => {
    setCantidad((prev) => prev + 1);
  };

  const handleDecrementarCantidad = () => {
    setCantidad((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleAgregarAlCarrito = () => {
    if (esAdmin) {
      setMensajeError('Acción no permitida para administradores');
      return;
    }

    if (!tallaSeleccionada) {
      setMensajeError('Debes seleccionar una talla primero');
      return;
    }

    if (!cantidad || cantidad <= 0) {
      setMensajeError('La cantidad debe ser mayor a 0');
      return;
    }

    const resultado = agregarAlCarrito(product, tallaSeleccionada, cantidad);
    if (resultado.exito) {
      if (onProductoAgregado) {
        onProductoAgregado(resultado.mensaje);
      }
      onCerrar();
    } else {
      setMensajeError(resultado.mensaje);
    }
  };

  return (
    <div className="modal-fondo" onClick={onCerrar} role="dialog" aria-modal="true">
      <div className="modal-tarjeta" onClick={(e) => e.stopPropagation()}>
        {/* Botón de cierre */}
        <button
          type="button"
          className="modal-boton-cerrar"
          onClick={onCerrar}
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        <div className="modal-contenido-grid">
          {/* Imagen de la prenda */}
          <div className="modal-imagen-seccion">
            <img src={product.imagen} alt={product.nombre} className="modal-imagen" />
          </div>

          {/* Información detallada de la prenda */}
          <div className="modal-detalles-seccion">
            <div className="modal-cabecera-meta">
              <span className="modal-categoria">{product.categoria} • Unisex</span>
            </div>

            <h2 className="modal-titulo">{product.nombre}</h2>

            {/* Precio único  */}
            <div className="modal-precios">
              <span className="modal-precio-actual">
                {formatearMoneda(product.precio)}
              </span>
            </div>

            {/* Descripción */}
            <p className="modal-descripcion">{product.descripcion}</p>

            {/* Beneficios */}
            <div className="modal-beneficios">
              <div className="beneficio-fila">
                <span className="beneficio-punto">•</span>
                <span>Prenda unisex de confección nacional</span>
              </div>
              <div className="beneficio-fila">
                <span className="beneficio-punto">•</span>
                <span>
                  {product.tiempoEntregaEstimado || 'Envío directo desde fabricante'}
                </span>
              </div>
            </div>

            {/* SECCIÓN DE COMPRA: EXCLUSIVA PARA CLIENTES / SOLO LECTURA PARA ADMIN */}
            {esAdmin ? (
              <div className="modal-admin-aviso">
                <p>
                  <strong>Modo Administrador:</strong> Esta vista es de solo lectura. Los
                  administradores no pueden agregar productos al carrito ni realizar compras.
                </p>
              </div>
            ) : (
              <div className="modal-compra-seccion">
                {/* PASO 1: Selección obligatoria de talla */}
                <div className="modal-selector-tallas">
                  <label className="modal-selector-tallas__titulo">
                    Paso 1: Selecciona la talla (Unisex):
                  </label>
                  <div className="modal-selector-tallas__opciones">
                    {product.tallas.map((talla) => {
                      const estaSeleccionada = tallaSeleccionada === talla;
                      return (
                        <button
                          key={talla}
                          type="button"
                          className={`btn-talla ${estaSeleccionada ? 'btn-talla--activa' : ''}`}
                          onClick={() => handleSeleccionarTalla(talla)}
                        >
                          {talla}
                        </button>
                      );
                    })}
                  </div>
                  {!tallaSeleccionada ? (
                    <span className="modal-selector-tallas__ayuda texto-aviso">
                      Por favor elige una talla para habilitar la cantidad.
                    </span>
                  ) : (
                    <span className="modal-selector-tallas__ayuda">
                      Talla seleccionada: <strong>{tallaSeleccionada}</strong>
                    </span>
                  )}
                </div>

                {/* PASO 2: Selector de cantidad (Solo habilitado tras seleccionar la talla) */}
                <div
                  className={`modal-selector-cantidad ${!tallaSeleccionada ? 'modal-selector-cantidad--deshabilitado' : ''
                    }`}
                >
                  <label className="modal-selector-cantidad__titulo">
                    Paso 2: Cantidad:
                  </label>
                  <div className="control-cantidad-grupo">
                    <button
                      type="button"
                      className="btn-cantidad-control"
                      onClick={handleDecrementarCantidad}
                      disabled={!tallaSeleccionada || cantidad <= 1}
                    >
                      -
                    </button>
                    <span className="valor-cantidad-display">{cantidad}</span>
                    <button
                      type="button"
                      className="btn-cantidad-control"
                      onClick={handleIncrementarCantidad}
                      disabled={!tallaSeleccionada}
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Mensaje de error o validación */}
                {mensajeError && (
                  <div className="modal-mensaje-error">{mensajeError}</div>
                )}

                {/* Botón para agregar al carrito */}
                <div className="modal-acciones-compra">
                  <button
                    type="button"
                    className="btn-modal-agregar-carrito"
                    onClick={handleAgregarAlCarrito}
                    disabled={!tallaSeleccionada || cantidad <= 0}
                  >
                    {!tallaSeleccionada
                      ? 'Selecciona una talla para continuar'
                      : `Agregar al Carrito • ${formatearMoneda(product.precio * cantidad)}`}
                  </button>
                </div>
              </div>
            )}

            {/* Botón de cierre */}
            <div className="modal-pie">
              <button type="button" className="btn-modal-volver" onClick={onCerrar}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;
