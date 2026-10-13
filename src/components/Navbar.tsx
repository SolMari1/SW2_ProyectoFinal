
import type { FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  terminoBusqueda?: string;
  onCambioBusqueda?: (valor: string) => void;
  mostrarBuscador?: boolean;
}

export const Navbar: FC<NavbarProps> = ({
  terminoBusqueda = '',
  onCambioBusqueda,
  mostrarBuscador = true
}) => {
  // Obtenemos el estado de autenticación y datos del usuario del contexto
  const { user, logout, isAuthenticated } = useAuth();
  const { totalArticulos } = useCart();
  const esAdmin = user?.role === 'admin';

  return (
    <header className="navbar-catalogo">
      <div className="navbar-catalogo__contenedor">
        {/* Título de la marca / aplicación en texto limpio  */}
        <Link to="/" className="navbar-catalogo__marca">
          <span className="navbar-catalogo__titulo">Tienda Virtual</span>
          <span className="navbar-catalogo__subtitulo">Catálogo</span>
        </Link>

        {/* Barra de búsqueda integrada en la cabecera (opcional) */}
        {mostrarBuscador && onCambioBusqueda && (
          <div className="navbar-catalogo__buscador">
            <input
              type="text"
              placeholder="Buscar por nombre, descripción o categoría..."
              value={terminoBusqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              aria-label="Buscar productos"
            />
            {terminoBusqueda && (
              <button
                type="button"
                className="navbar-catalogo__btn-limpiar"
                onClick={() => onCambioBusqueda('')}
                title="Borrar búsqueda"
              >
                ✕
              </button>
            )}
          </div>
        )}

        {/* Sección de acciones y perfil de usuario */}
        <div className="navbar-catalogo__acciones">
          {/* Si es cliente o visitante (no admin), mostrar botón/enlace al carrito */}
          {!esAdmin && (
            <Link to="/carrito" className="nav-enlace nav-enlace--carrito" title="Ver carrito de compras">
              🛒 Carrito {totalArticulos > 0 ? `(${totalArticulos})` : ''}
            </Link>
          )}

          {/* Si es cliente autenticado, enlace a sus pedidos anteriores */}
          {isAuthenticated && !esAdmin && (
            <Link to="/mis-pedidos" className="nav-enlace" title="Ver mis pedidos anteriores">
              Mis Pedidos
            </Link>
          )}

          {/* Si es administrador, enlace a los informes consolidados */}
          {isAuthenticated && esAdmin && (
            <Link to="/admin/informes" className="nav-enlace nav-enlace--admin" title="Panel de informes administrativos">
              📊 Informes Admin
            </Link>
          )}

          {/* Si el usuario ha iniciado sesión, mostramos su nombre, badge y opción de salir */}
          {isAuthenticated ? (
            <div className="navbar-catalogo__usuario">
              <div className="usuario-badge-contenedor">
                <span className="usuario-nombre">{user?.name || user?.email || 'Usuario'}</span>
                <span className={`usuario-rol-badge ${esAdmin ? 'rol-admin' : 'rol-cliente'}`}>
                  {esAdmin ? 'Admin' : 'Cliente'}
                </span>
              </div>
              <button
                type="button"
                className="btn-cerrar-sesion"
                onClick={logout}
                title="Cerrar sesión actual"
              >
                Salir
              </button>
            </div>
          ) : (
            // Si no está autenticado, enlaces directos a Login y Registro
            <div className="navbar-catalogo__auth-links">
              <Link to="/login" className="link-login">
                Iniciar Sesión
              </Link>
              <Link to="/register" className="link-registro">
                Registrarse
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
