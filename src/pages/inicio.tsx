// src/pages/inicio.tsx
// Página principal del Catálogo de Ropa Unisex (Camisas, Pantalones y Buzos en tallas S, M, L, XL)
// Sin calificaciones, sin descuentos ni etiquetas promocionales
import { useState, useMemo, type FC } from 'react';
import type { Product, CategoriaRopa } from '../types/product';
import { MOCK_PRODUCTS } from '../data/mockProducts';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import '../styles/catalogo.css';

// Tipo de opciones para ordenar el catálogo
type OpcionOrden = 'defecto' | 'precio-asc' | 'precio-desc' | 'nombre';

// Categorías fijas de la tienda de ropa
const CATEGORIAS_TIENDA: Array<'Todas' | CategoriaRopa> = ['Todas', 'Camisas', 'Pantalones', 'Buzos'];

export const Inicio: FC = () => {
  const { user } = useAuth();
  const esAdmin = user?.role === 'admin';

  // Lista de prendas disponibles
  const [productos] = useState<Product[]>(MOCK_PRODUCTS);

  // Estados para filtros de búsqueda y navegación
  const [busqueda, setBusqueda] = useState<string>('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<'Todas' | CategoriaRopa>('Todas');
  const [orden, setOrden] = useState<OpcionOrden>('defecto');

  // Estado para el modal de vista detallada de una prenda
  const [productoSeleccionado, setProductoSeleccionado] = useState<Product | null>(null);

  // Mensaje flotante de notificación (toast) cuando se agrega una prenda al carrito
  const [mensajeToast, setMensajeToast] = useState<string | null>(null);

  const mostrarNotificacionToast = (mensaje: string) => {
    setMensajeToast(mensaje);
    setTimeout(() => {
      setMensajeToast(null);
    }, 3500);
  };

  // Filtrado y ordenamiento reactivo de prendas en el Frontend
  const productosFiltrados = useMemo(() => {
    return productos
      .filter((producto) => {
        // Filtro por término de búsqueda (nombre, descripción o categoría)
        if (busqueda.trim() !== '') {
          const termino = busqueda.toLowerCase();
          const coincideNombre = producto.nombre.toLowerCase().includes(termino);
          const coincideDesc = producto.descripcion.toLowerCase().includes(termino);
          const coincideCat = producto.categoria.toLowerCase().includes(termino);
          if (!coincideNombre && !coincideDesc && !coincideCat) {
            return false;
          }
        }

        // Filtro por categoría seleccionada (Camisas, Pantalones, Buzos)
        if (categoriaSeleccionada !== 'Todas' && producto.categoria !== categoriaSeleccionada) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        switch (orden) {
          case 'precio-asc':
            return a.precio - b.precio;
          case 'precio-desc':
            return b.precio - a.precio;
          case 'nombre':
            return a.nombre.localeCompare(b.nombre);
          case 'defecto':
          default:
            return a.id - b.id;
        }
      });
  }, [productos, busqueda, categoriaSeleccionada, orden]);

  // Función para restablecer todos los filtros a su estado inicial
  const restablecerFiltros = () => {
    setBusqueda('');
    setCategoriaSeleccionada('Todas');
    setOrden('defecto');
  };

  return (
    <div className="pagina-catalogo">
      {/* Barra de navegación superior */}
      <Navbar
        terminoBusqueda={busqueda}
        onCambioBusqueda={setBusqueda}
      />

      {/* Notificación flotante al agregar al carrito */}
      {mensajeToast && (
        <div className="notificacion-toast-alerta">
          {mensajeToast}
        </div>
      )}

      {/* Banner informativo de modo Administrador si aplica */}
      {esAdmin && (
        <div className="banner-modo-admin-aviso">
          <span>
            <strong>Sesión de Administrador activa:</strong> Estás visualizando el catálogo en
            modo lectura. No puedes agregar al carrito ni realizar compras.
          </span>
        </div>
      )}

      {/* Cabecera / Banner informativo de la tienda de ropa */}
      <section className="banner-catalogo">
        <div className="banner-catalogo__contenedor">
          <span className="banner-catalogo__etiqueta">Colección Unisex • Dropshipping</span>
          <h1 className="banner-catalogo__titulo">Catálogo de Ropa</h1>
          <p className="banner-catalogo__descripcion">
            Prendas atemporales sin distinción de género. Encuentra camisas, pantalones y buzos
            en tallas S, M, L y XL con despacho directo desde los fabricantes.
          </p>
        </div>
      </section>

      {/* Contenido principal del catálogo */}
      <main className="contenedor-principal-catalogo">
        {/* Barra horizontal con botones de categoría exclusivas: Camisas, Pantalones, Buzos */}
        <div className="barra-categorias">
          <span className="barra-categorias__etiqueta">Prendas:</span>
          <div className="barra-categorias__botones">
            {CATEGORIAS_TIENDA.map((cat) => {
              const estaActiva = categoriaSeleccionada === cat;
              const cantidad =
                cat === 'Todas'
                  ? productos.length
                  : productos.filter((p) => p.categoria === cat).length;

              return (
                <button
                  key={cat}
                  type="button"
                  className={`btn-categoria ${estaActiva ? 'btn-categoria--activa' : ''}`}
                  onClick={() => setCategoriaSeleccionada(cat)}
                >
                  <span>{cat}</span>
                  <span className="contador-categoria">{cantidad}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Panel de control de filtros (ordenamiento) */}
        <div className="panel-filtros">
          <div className="filtro-info-dropshipping">
            <span className="texto-info-dropshipping">
              Tallas estándar unisex disponibles: <strong>S, M, L, XL</strong> en todas las prendas
            </span>
          </div>

          {/* Menú desplegable para ordenar */}
          <div className="filtro-opcion filtro-ordenar">
            <label htmlFor="selector-orden">Ordenar por:</label>
            <select
              id="selector-orden"
              value={orden}
              onChange={(e) => setOrden(e.target.value as OpcionOrden)}
            >
              <option value="defecto">Predeterminado</option>
              <option value="precio-asc">Precio: Menor a Mayor</option>
              <option value="precio-desc">Precio: Mayor a Menor</option>
              <option value="nombre">Nombre (A - Z)</option>
            </select>
          </div>
        </div>

        {/* Resumen de resultados encontrados */}
        <div className="resumen-resultados">
          <p className="conteo-texto">
            Mostrando <strong>{productosFiltrados.length}</strong> de{' '}
            <strong>{productos.length}</strong> prendas
          </p>

          {(busqueda || categoriaSeleccionada !== 'Todas' || orden !== 'defecto') && (
            <button
              type="button"
              className="btn-limpiar-filtros"
              onClick={restablecerFiltros}
            >
              Limpiar filtros
            </button>
          )}
        </div>

        {/* Grilla de prendas o mensaje si no hay resultados */}
        {productosFiltrados.length === 0 ? (
          <div className="estado-vacio">
            <h3>No se encontraron prendas</h3>
            <p>Intenta ajustar el término de búsqueda o cambia la categoría de prenda.</p>
            <button type="button" className="btn-restablecer" onClick={restablecerFiltros}>
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grilla-productos">
            {productosFiltrados.map((producto) => (
              <ProductCard
                key={producto.id}
                product={producto}
                onVerDetalles={(p) => setProductoSeleccionado(p)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Pie de página con información general (sin logos) */}
      <footer className="pie-pagina-catalogo">
        <div className="pie-pagina-catalogo__contenedor">
          <p className="pie-pagina-catalogo__marca">Tienda de Ropa Unisex - Dropshipping SW2</p>
          <p className="pie-pagina-catalogo__derechos">
            Camisas, pantalones y buzos en tallas S, M, L y XL. Despacho directo sin intermediarios.
          </p>
        </div>
      </footer>

      {/* Modal emergente con los detalles de la prenda y selector de talla */}
      <ProductDetailModal
        product={productoSeleccionado}
        onCerrar={() => setProductoSeleccionado(null)}
        onProductoAgregado={mostrarNotificacionToast}
      />
    </div>
  );
};

export default Inicio;
