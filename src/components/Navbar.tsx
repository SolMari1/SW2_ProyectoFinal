
// Barra de navegación superior para el catálogo 
import type { FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

interface NavbarProps {
  terminoBusqueda: string;
  onCambioBusqueda: (valor: string) => void;
  // NOTA: Conteo del carrito y apertura comentados por ahora
  // cantidadCarrito?: number;
  // onAbrirCarrito?: () => void;
}

export const Navbar: FC<NavbarProps> = ({
  terminoBusqueda,
  onCambioBusqueda
}) => {
  // Obtenemos el estado de autenticación y datos del usuario del contexto
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <header className="navbar-catalogo">
      <div className="navbar-catalogo__contenedor">
        {/* Título de la marca / aplicación en texto limpio  */}
        <Link to="/" className="navbar-catalogo__marca">
          <span className="navbar-catalogo__titulo">Tienda Virtual</span>
          <span className="navbar-catalogo__subtitulo">Catálogo</span>
        </Link>

        {/* Barra de búsqueda integrada en la cabecera */}
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

        {/* Sección de acciones y perfil de usuario */}
        <div className="navbar-catalogo__acciones">
          {/* NOTA: Botón de carrito de compras comentado según requerimiento
          <button
            type="button"
            className="navbar-catalogo__btn-carrito"
            onClick={onAbrirCarrito}
          >
            Carrito ({cantidadCarrito})
          </button>
          */}

          {/* Si el usuario ha iniciado sesión, mostramos su nombre y opción de salir */}
          {isAuthenticated ? (
            <div className="navbar-catalogo__usuario">
              <span className="usuario-nombre">{user?.name || user?.email || 'Usuario'}</span>
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
