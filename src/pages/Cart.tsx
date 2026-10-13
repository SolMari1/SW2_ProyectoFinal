// Vista del carrito de compras: solo accesible para clientes, con botón de Pagar simulado y placeholder backend
import { useState, type FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { Navbar } from '../components/Navbar';
import { Link, useNavigate } from 'react-router-dom';

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export const Cart: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { cart, actualizarCantidad, eliminarDelCarrito, vaciarCarrito, totalPrecio } = useCart();
  const { registrarPedido } = useOrders();
  const navigate = useNavigate();

  const [procesandoPago, setProcesandoPago] = useState(false);
  const [pedidoCompletadoId, setPedidoCompletadoId] = useState<string | null>(null);

  // RESTRICCIÓN IMPORTANTE: Si un admin intenta acceder a la ruta del carrito
  if (user?.role === 'admin') {
    return (
      <div className="pagina-catalogo">
        <Navbar mostrarBuscador={false} />
        <main className="contenedor-principal-catalogo">
          <div className="aviso-bloqueo-admin">
            <h2>Acción no permitida para administradores</h2>
            <p>
              Los administradores no tienen acceso al carrito de compras ni a funciones
              de pago. Su función en la plataforma es la consulta de informes.
            </p>
            <div className="botones-accion-bloqueo">
              <Link to="/admin/informes" className="btn-ir-informes">
                Ir a Informes de Administrador
              </Link>
              <Link to="/" className="btn-ir-catalogo">
                Ver Catálogo (Solo Lectura)
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Manejador del botón "Pagar"
  const handlePagar = async () => {
    if (!isAuthenticated || !user) {
      alert('Debes iniciar sesión como cliente para completar el pedido.');
      navigate('/login');
      return;
    }

    if (cart.length === 0) return;

    setProcesandoPago(true);

    try {
      // Mapear elementos del carrito a items del pedido
      const itemsPedido = cart.map((item) => ({
        productoId: item.producto.id,
        nombreProducto: item.producto.nombre,
        categoria: item.producto.categoria,
        talla: item.talla,
        cantidad: item.cantidad,
        precioUnitario: item.producto.precio,
        subtotal: item.producto.precio * item.cantidad
      }));

      // =========================================================================
      // TODO: conectar con endpoint POST /pedidos cuando el backend esté listo
      // Placeholder preparado para que el equipo de backend lo conecte:
      // const respuesta = await api.post('/pedidos', { clienteId: user.id, items: itemsPedido, total: totalPrecio });
      // =========================================================================

      // Registro en el estado global reactivo / localStorage
      const pedidoCreado = await registrarPedido({
        clienteId: user.id,
        clienteNombre: user.name,
        clienteEmail: user.email,
        items: itemsPedido,
        total: totalPrecio
      });

      // Vaciar carrito tras confirmar pedido
      vaciarCarrito();
      setPedidoCompletadoId(pedidoCreado.id);
    } finally {
      setProcesandoPago(false);
    }
  };

  return (
    <div className="pagina-catalogo">
      <Navbar mostrarBuscador={false} />

      <main className="contenedor-principal-catalogo">
        <div className="seccion-cabecera-simple">
          <h1 className="titulo-seccion-simple">Carrito de Compras</h1>
          <p className="subtitulo-seccion-simple">
            Revisa tus prendas seleccionadas, verifica las tallas y confirma tu pedido.
          </p>
        </div>

        {/* Mensaje de confirmación cuando el pedido ha sido registrado con éxito */}
        {pedidoCompletadoId && (
          <div className="panel-pedido-exitoso">
            <h3>Pedido registrado correctamente</h3>
            <p>
              Tu pedido <strong>{pedidoCompletadoId}</strong> ha sido generado con éxito y
              ya está visible en tu informe individual.
            </p>
            <div className="botones-exito-grupo">
              <Link to="/mis-pedidos" className="btn-ir-mis-pedidos">
                Ver Mi Informe de Pedidos
              </Link>
              <button
                type="button"
                className="btn-seguir-comprando"
                onClick={() => {
                  setPedidoCompletadoId(null);
                  navigate('/');
                }}
              >
                Continuar Comprando
              </button>
            </div>
          </div>
        )}

        {!pedidoCompletadoId && cart.length === 0 ? (
          <div className="estado-vacio">
            <h3>Tu carrito está vacío</h3>
            <p>Aún no has agregado prendas a tu pedido.</p>
            <Link to="/" className="btn-restablecer">
              Explorar Catálogo de Ropa
            </Link>
          </div>
        ) : !pedidoCompletadoId ? (
          <div className="layout-carrito-grid">
            {/* Lista de productos en el carrito */}
            <div className="tabla-carrito-contenedor">
              <table className="tabla-datos-pedidos">
                <thead>
                  <tr>
                    <th>Prenda</th>
                    <th>Talla</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {cart.map((item) => (
                    <tr key={item.id}>
                      <td className="celda-producto-info">
                        <img
                          src={item.producto.imagen}
                          alt={item.producto.nombre}
                          className="miniatura-carrito"
                        />
                        <div>
                          <strong>{item.producto.nombre}</strong>
                          <span className="categoria-texto-suave">
                            {item.producto.categoria}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className="talla-insignia">{item.talla}</span>
                      </td>
                      <td>{formatearMoneda(item.producto.precio)}</td>
                      <td>
                        <div className="control-cantidad-tabla">
                          <button
                            type="button"
                            className="btn-qty-pequeno"
                            onClick={() => actualizarCantidad(item.id, item.cantidad - 1)}
                          >
                            -
                          </button>
                          <span>{item.cantidad}</span>
                          <button
                            type="button"
                            className="btn-qty-pequeno"
                            onClick={() => actualizarCantidad(item.id, item.cantidad + 1)}
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="columna-total-fuerte">
                        {formatearMoneda(item.producto.precio * item.cantidad)}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn-eliminar-item"
                          onClick={() => eliminarDelCarrito(item.id)}
                          title="Quitar prenda"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="acciones-pie-tabla">
                <button
                  type="button"
                  className="btn-limpiar-filtros"
                  onClick={vaciarCarrito}
                >
                  Vaciar Carrito
                </button>
                <Link to="/" className="enlace-seguir-mirando">
                  ← Agregar más prendas del catálogo
                </Link>
              </div>
            </div>

            {/* Resumen del pedido y botón Pagar */}
            <div className="panel-resumen-compra">
              <h3>Resumen del Pedido</h3>
              <div className="linea-resumen">
                <span>Total de prendas:</span>
                <strong>{cart.reduce((a, b) => a + b.cantidad, 0)} unidades</strong>
              </div>
              <div className="linea-resumen">
                <span>Despacho directo (Dropshipping):</span>
                <span>Incluido</span>
              </div>
              <div className="linea-resumen linea-total-destacada">
                <span>Total a pagar:</span>
                <strong>{formatearMoneda(totalPrecio)}</strong>
              </div>

              {!isAuthenticated && (
                <div className="aviso-login-requerido">
                  <span>Inicia sesión para registrar el pedido a tu nombre.</span>
                </div>
              )}

              <button
                type="button"
                className="btn-pagar-orden"
                onClick={handlePagar}
                disabled={procesandoPago || cart.length === 0}
              >
                {procesandoPago ? 'Procesando pedido...' : 'Pagar Pedido'}
              </button>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
};

export default Cart;
