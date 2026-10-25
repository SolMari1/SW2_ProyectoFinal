// src/pages/CustomerOrders.tsx
// Informe tabular individual de pedidos anteriores para el cliente autenticado
import { type FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../context/OrderContext';
import { Navbar } from '../components/Navbar';
import { Link, Navigate } from 'react-router-dom';

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

export const CustomerOrders: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { obtenerPedidosPorCliente, cargando, error } = useOrders();

  // Si no está autenticado, redirigir a Login
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Si es admin, redirigir a los informes consolidados
  if (user.role === 'admin') {
    return <Navigate to="/admin/informes" replace />;
  }

  // Obtenemos EXCLUSIVAMENTE los pedidos de este cliente (aislamiento de datos)
  const misPedidos = obtenerPedidosPorCliente(user.id);

  // Totales acumulados para el cliente
  const totalInvertido = misPedidos.reduce((acc, p) => acc + p.total, 0);
  const totalPrendasCompradas = misPedidos.reduce(
    (acc, p) => acc + p.items.reduce((sum, item) => sum + item.cantidad, 0),
    0
  );

  return (
    <div className="pagina-catalogo">
      <Navbar mostrarBuscador={false} />

      <main className="contenedor-principal-catalogo">
        {/* Cabecera del informe individual */}
        <div className="seccion-cabecera-simple">
          <div className="migas-de-pan">
            <Link to="/">← Volver al Catálogo</Link>
          </div>
          <h1 className="titulo-seccion-simple">Mi Informe de Pedidos Anteriores</h1>
          <p className="subtitulo-seccion-simple">
            Historial de compras registradas para <strong>{user.name}</strong> ({user.email}).
            Aquí puedes consultar el detalle de prendas, tallas, montos y estado de entrega.
          </p>
        </div>

        {/* Tarjetas de métricas del cliente */}
        <div className="grid-metricas-cliente">
          <div className="tarjeta-metrica">
            <span className="metrica-etiqueta">Total Pedidos</span>
            <span className="metrica-valor">{misPedidos.length}</span>
          </div>
          <div className="tarjeta-metrica">
            <span className="metrica-etiqueta">Prendas Adquiridas</span>
            <span className="metrica-valor">{totalPrendasCompradas} uds</span>
          </div>
          <div className="tarjeta-metrica">
            <span className="metrica-etiqueta">Total Facturado</span>
            <span className="metrica-valor">{formatearMoneda(totalInvertido)}</span>
          </div>
        </div>

        {/* Tabla individual de pedidos */}
        {cargando ? (
          <div className="estado-vacio">
            <h3>Cargando pedidos...</h3>
          </div>
        ) : error ? (
          <div className="estado-vacio">
            <h3>No se pudieron cargar tus pedidos</h3>
            <p>{error}</p>
          </div>
        ) : misPedidos.length === 0 ? (
          <div className="estado-vacio">
            <h3>No tienes pedidos anteriores registrados</h3>
            <p>Explora nuestro catálogo para realizar tu primera orden.</p>
            <Link to="/" className="btn-restablecer">
              Ir al Catálogo de Ropa
            </Link>
          </div>
        ) : (
          <div className="tabla-responsive-contenedor">
            <table className="tabla-datos-pedidos">
              <thead>
                <tr>
                  <th>ID Pedido</th>
                  <th>Fecha</th>
                  <th>Prendas y Tallas</th>
                  <th>Cant. Total</th>
                  <th>Total Pagado</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {misPedidos.map((pedido) => (
                  <tr key={pedido.id}>
                    <td>
                      <strong className="id-pedido-badge">{pedido.id}</strong>
                    </td>
                    <td>{pedido.fecha}</td>
                    <td>
                      <ul className="lista-items-pedido">
                        {pedido.items.map((item, idx) => (
                          <li key={idx} className="item-pedido-fila">
                            <span className="item-nombre">{item.nombreProducto}</span>
                            <span className="talla-insignia">Talla {item.talla}</span>
                            <span className="item-cant-precio">
                              ({item.cantidad} x {formatearMoneda(item.precioUnitario)})
                            </span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="celda-centrada">
                      {pedido.items.reduce((s, it) => s + it.cantidad, 0)}
                    </td>
                    <td className="columna-total-fuerte">
                      {formatearMoneda(pedido.total)}
                    </td>
                    <td>
                      <span className={`badge-estado estado-${pedido.estado.toLowerCase().replace(' ', '-')}`}>
                        {pedido.estado}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerOrders;
