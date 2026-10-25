// src/pages/AdminReports.tsx
// Panel con los 3 informes del Administrador (datos calculados en el backend, GET /reportes/*):
// Informe 1: Tabular de clientes y compras con paginación de 5 registros por página
// Informe 2: Gráfico consolidado (Producto, Cantidad de productos pedidos, Cantidad de pedidos)
// Informe 3: Consolidado (Resumen general con totales y métricas)
import { useState, useEffect, type FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Navbar } from '../components/Navbar';
import { Link, Navigate } from 'react-router-dom';
import {
  obtenerInformeClientesComprasApi,
  obtenerInformeProductosApi,
  obtenerInformeResumenApi
} from '../api/reportes';
import type { ConsolidadoProducto, FilaClienteCompra, Pagina, ResumenGeneral } from '../types/report';
import { mensajeDeError } from '../lib/errores';

const formatearMoneda = (valor: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0
  }).format(valor);
};

const REGISTROS_POR_PAGINA = 5;

const RESUMEN_VACIO: ResumenGeneral = {
  totalPedidos: 0,
  totalFacturado: 0,
  totalProductosVendidos: 0,
  totalClientes: 0,
  topClientes: [],
  topProductos: []
};

export const AdminReports: FC = () => {
  const { user, isAuthenticated } = useAuth();
  const esAdmin = isAuthenticated && user?.role === 'admin';

  // Estado para la pestaña de informe activa (1, 2 o 3)
  const [tabActiva, setTabActiva] = useState<'tabular' | 'grafico' | 'resumen'>('tabular');

  // Estado para la paginación del Informe 1 (5 registros por página, paginado en el backend)
  const [paginaActual, setPaginaActual] = useState<number>(1);

  const [informe1, setInforme1] = useState<Pagina<FilaClienteCompra> | null>(null);
  const [datosConsolidadosPorProducto, setDatosConsolidadosPorProducto] = useState<ConsolidadoProducto[]>([]);
  const [metricasResumen, setMetricasResumen] = useState<ResumenGeneral>(RESUMEN_VACIO);
  const [error, setError] = useState<string | null>(null);

  // Informe 1: se pide al backend cada vez que cambia la página
  useEffect(() => {
    if (!esAdmin) return;
    obtenerInformeClientesComprasApi(paginaActual, REGISTROS_POR_PAGINA)
      .then(setInforme1)
      .catch((err) => setError(mensajeDeError(err, 'No se pudo cargar el informe tabular')));
  }, [esAdmin, paginaActual]);

  // Informes 2 y 3
  useEffect(() => {
    if (!esAdmin) return;
    Promise.all([obtenerInformeProductosApi(), obtenerInformeResumenApi()])
      .then(([productos, resumen]) => {
        setDatosConsolidadosPorProducto(productos);
        setMetricasResumen(resumen);
      })
      .catch((err) => setError(mensajeDeError(err, 'No se pudieron cargar los informes')));
  }, [esAdmin]);

  // Verificación de acceso para rol administrador
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return (
      <div className="pagina-catalogo">
        <Navbar mostrarBuscador={false} />
        <main className="contenedor-principal-catalogo">
          <div className="aviso-bloqueo-admin">
            <h2>Acceso Restringido</h2>
            <p>Esta sección está reservada exclusivamente para administradores del sistema.</p>
            <Link to="/" className="btn-ir-catalogo">
              Volver al Catálogo
            </Link>
          </div>
        </main>
      </div>
    );
  }

  const filasPaginadas = informe1?.filas ?? [];
  const totalFilas = informe1?.total ?? 0;
  const totalPaginas = informe1?.totalPaginas ?? 1;

  return (
    <div className="pagina-catalogo">
      <Navbar mostrarBuscador={false} />

      <main className="contenedor-principal-catalogo">
        {/* Cabecera del panel administrativo */}
        <div className="seccion-cabecera-simple">
          <div className="migas-de-pan">
            <Link to="/">← Ir al Catálogo (Solo Lectura)</Link>
          </div>
          <h1 className="titulo-seccion-simple">Panel de Informes del Administrador</h1>
          <p className="subtitulo-seccion-simple">
            Consulta consolidada de clientes, órdenes tramitadas, comportamiento de compra y métricas generales del sistema.
          </p>
        </div>

        {error && <div className="error">{error}</div>}

        {/* Barra de pestañas para alternar entre los 3 informes */}
        <div className="tabs-informes-contenedor">
          <button
            type="button"
            className={`btn-tab-informe ${tabActiva === 'tabular' ? 'btn-tab-informe--activa' : ''}`}
            onClick={() => setTabActiva('tabular')}
          >
            Informe 1: Tabular de Clientes y Compras
          </button>
          <button
            type="button"
            className={`btn-tab-informe ${tabActiva === 'grafico' ? 'btn-tab-informe--activa' : ''}`}
            onClick={() => setTabActiva('grafico')}
          >
            Informe 2: Gráfico Consolidado
          </button>
          <button
            type="button"
            className={`btn-tab-informe ${tabActiva === 'resumen' ? 'btn-tab-informe--activa' : ''}`}
            onClick={() => setTabActiva('resumen')}
          >
            Informe 3: Consolidado General
          </button>
        </div>

        {/* =====================================================================
            INFORME 1: TABULAR DE CLIENTES Y SUS COMPRAS (Paginación de 5 registros)
            ===================================================================== */}
        {tabActiva === 'tabular' && (
          <div className="seccion-informe-panel">
            <div className="panel-informe-cabecera">
              <h2>Informe 1: Detalle Tabular de Clientes y Compras</h2>
              <p>
                Listado consolidado de todas las órdenes de los clientes con información de
                tallas, cantidades y montos. <strong>(Paginación: 5 registros por página)</strong>.
              </p>
            </div>

            <div className="tabla-responsive-contenedor">
              <table className="tabla-datos-pedidos">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>ID Pedido</th>
                    <th>Fecha</th>
                    <th>Producto</th>
                    <th>Categoría</th>
                    <th>Talla</th>
                    <th>Cantidad</th>
                    <th>Precio Unit.</th>
                    <th>Total</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filasPaginadas.map((fila) => (
                    <tr key={fila.idFila}>
                      <td>
                        <strong>{fila.cliente}</strong>
                        <span className="categoria-texto-suave">{fila.email}</span>
                      </td>
                      <td>
                        <span className="id-pedido-badge">{fila.idPedido}</span>
                      </td>
                      <td>{fila.fecha}</td>
                      <td>{fila.producto}</td>
                      <td>{fila.categoria}</td>
                      <td className="celda-centrada">
                        <span className="talla-insignia">{fila.talla}</span>
                      </td>
                      <td className="celda-centrada">{fila.cantidad}</td>
                      <td>{formatearMoneda(fila.precioUnitario)}</td>
                      <td className="columna-total-fuerte">
                        {formatearMoneda(fila.totalItem)}
                      </td>
                      <td>
                        <span
                          className={`badge-estado estado-${fila.estado
                            .toLowerCase()
                            .replace(' ', '-')}`}
                        >
                          {fila.estado}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de Paginación (5 registros por página) */}
            <div className="paginacion-contenedor">
              <span className="paginacion-info">
                Mostrando registros {(paginaActual - 1) * REGISTROS_POR_PAGINA + 1} a{' '}
                {Math.min(paginaActual * REGISTROS_POR_PAGINA, totalFilas)} de{' '}
                {totalFilas} en total
              </span>

              <div className="paginacion-controles">
                <button
                  type="button"
                  className="btn-pagina"
                  disabled={paginaActual <= 1}
                  onClick={() => setPaginaActual((prev) => Math.max(prev - 1, 1))}
                >
                  Anterior
                </button>

                {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((num) => (
                  <button
                    key={num}
                    type="button"
                    className={`btn-pagina ${paginaActual === num ? 'btn-pagina--activa' : ''}`}
                    onClick={() => setPaginaActual(num)}
                  >
                    {num}
                  </button>
                ))}

                <button
                  type="button"
                  className="btn-pagina"
                  disabled={paginaActual >= totalPaginas}
                  onClick={() => setPaginaActual((prev) => Math.min(prev + 1, totalPaginas))}
                >
                  Siguiente
                </button>
              </div>
            </div>
          </div>
        )}

        {/* =====================================================================
            INFORME 2: GRÁFICO CONSOLIDADO (Barras comparativas de 3 variables)
            Variables: Producto, Cantidad de productos pedidos, Cantidad de pedidos
            ===================================================================== */}
        {tabActiva === 'grafico' && (
          <div className="seccion-informe-panel">
            <div className="panel-informe-cabecera">
              <h2>Informe 2: Gráfico Consolidado de Demanda por Prenda</h2>
              <p>
                Visualización comparativa que correlaciona: <strong>Producto</strong> (Eje X),{' '}
                <span className="leyenda-color-barra-azul">Cantidad total de unidades pedidas</span> y{' '}
                <span className="leyenda-color-barra-verde">Cantidad de pedidos que lo incluyeron</span>.
              </p>
            </div>

            {/* Leyenda interactiva */}
            <div className="grafico-leyenda">
              <div className="item-leyenda">
                <span className="indicador-color barra-azul"></span>
                <span>Cantidad Total de Productos Pedidos (Unidades)</span>
              </div>
              <div className="item-leyenda">
                <span className="indicador-color barra-verde"></span>
                <span>Cantidad de Pedidos donde se solicitó</span>
              </div>
            </div>

            {/* Gráfico de barras SVG responsivo y estructurado */}
            <div className="contenedor-grafico-barras">
              {datosConsolidadosPorProducto.map((item) => {
                const maxUnidades = Math.max(
                  ...datosConsolidadosPorProducto.map((d) => d.cantidadTotal),
                  1
                );
                const porcentajeUnidades = Math.round((item.cantidadTotal / maxUnidades) * 100);
                const porcentajePedidos = Math.round((item.pedidosCount / maxUnidades) * 100);

                return (
                  <div key={item.productoId} className="fila-grafico-producto">
                    <div className="etiqueta-producto-grafico">
                      <strong>{item.nombre}</strong>
                      <span className="subtexto-cat">{item.categoria}</span>
                    </div>

                    <div className="barras-comparativas-grupo">
                      {/* Barra 1: Cantidad de unidades pedidas */}
                      <div className="pista-barra">
                        <div
                          className="barra-progreso barra-azul"
                          style={{ width: `${Math.max(porcentajeUnidades, 8)}%` }}
                        >
                          <span className="valor-barra">{item.cantidadTotal} uds</span>
                        </div>
                      </div>

                      {/* Barra 2: Cantidad de pedidos que lo incluyeron */}
                      <div className="pista-barra">
                        <div
                          className="barra-progreso barra-verde"
                          style={{ width: `${Math.max(porcentajePedidos, 8)}%` }}
                        >
                          <span className="valor-barra">{item.pedidosCount} pedidos</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =====================================================================
            INFORME 3: CONSOLIDADO GENERAL (Resumen de totales y top métricas)
            ===================================================================== */}
        {tabActiva === 'resumen' && (
          <div className="seccion-informe-panel">
            <div className="panel-informe-cabecera">
              <h2>Informe 3: Resumen Consolidado Global</h2>
              <p>
                Visión estratégica del negocio: totales acumulados, facturación, volumen y
                clasificación de clientes y prendas más demandadas.
              </p>
            </div>

            {/* Tarjetas de métricas principales */}
            <div className="grid-metricas-admin">
              <div className="tarjeta-metrica-admin">
                <span className="tarjeta-metrica-admin__titulo">Total de Pedidos</span>
                <span className="tarjeta-metrica-admin__valor">
                  {metricasResumen.totalPedidos}
                </span>
                <span className="tarjeta-metrica-admin__pie">Órdenes procesadas</span>
              </div>

              <div className="tarjeta-metrica-admin">
                <span className="tarjeta-metrica-admin__titulo">Prendas Vendidas</span>
                <span className="tarjeta-metrica-admin__valor">
                  {metricasResumen.totalProductosVendidos}
                </span>
                <span className="tarjeta-metrica-admin__pie">Unidades despachadas</span>
              </div>

              <div className="tarjeta-metrica-admin">
                <span className="tarjeta-metrica-admin__titulo">Total de Clientes</span>
                <span className="tarjeta-metrica-admin__valor">
                  {metricasResumen.totalClientes}
                </span>
                <span className="tarjeta-metrica-admin__pie">Compradores activos</span>
              </div>

              <div className="tarjeta-metrica-admin tarjeta-metrica-admin--destacada">
                <span className="tarjeta-metrica-admin__titulo">Total Facturado</span>
                <span className="tarjeta-metrica-admin__valor">
                  {formatearMoneda(metricasResumen.totalFacturado)}
                </span>
                <span className="tarjeta-metrica-admin__pie">Facturación acumulada</span>
              </div>
            </div>

            {/* Tablas comparativas: Top Productos y Top Clientes */}
            <div className="grid-tablas-resumen">
              <div className="bloque-resumen-card">
                <h3>Top Prendas Más Pedidas</h3>
                <table className="tabla-compacta">
                  <thead>
                    <tr>
                      <th>Prenda</th>
                      <th>Categoría</th>
                      <th>Unidades</th>
                      <th>Pedidos</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricasResumen.topProductos.map((prod, index) => (
                      <tr key={prod.productoId}>
                        <td>
                          <strong>{index + 1}. {prod.nombre}</strong>
                        </td>
                        <td>{prod.categoria}</td>
                        <td className="celda-centrada">
                          <strong>{prod.cantidadTotal}</strong>
                        </td>
                        <td className="celda-centrada">{prod.pedidosCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="bloque-resumen-card">
                <h3>Top Clientes por Cantidad de Pedidos</h3>
                <table className="tabla-compacta">
                  <thead>
                    <tr>
                      <th>Cliente</th>
                      <th>Total Pedidos</th>
                      <th>Monto Acumulado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {metricasResumen.topClientes.map((cl, index) => (
                      <tr key={cl.clienteId}>
                        <td>
                          <strong>{index + 1}. {cl.nombre}</strong>
                        </td>
                        <td className="celda-centrada">
                          <span className="badge-cantidad-pedidos">{cl.pedidos} pedidos</span>
                        </td>
                        <td className="columna-total-fuerte">
                          {formatearMoneda(cl.totalGastado)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReports;
