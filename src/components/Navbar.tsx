// src/components/Navbar.tsx
// Barra de navegación adaptada a roles: Cliente (Catálogo, Mis Pedidos, Carrito) y Admin (Catálogo, Informes Admin)
import type { FC } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../context/CartContext';
import { Link, useNavigate } from 'react-router-dom';

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
  const { user, logout, isAuthenticated } = useAuth();
  const { totalArticulos } = useCart();
  const navigate = useNavigate();

  const esAdmin = user?.role === 'admin';
  const esCliente = user?.role === 'cliente';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="navbar-catalogo">
      <div className="navbar-catalogo__contenedor">
        {/* Título de la tienda */}
        <Link to="/" className="navbar-catalogo__marca">
          <span className="navbar-catalogo__titulo">Tienda de Ropa</span>
          <span className="navbar-catalogo__subtitulo">Dropshipping</span>
        </Link>

        {/* Buscador (opcional en páginas donde aplique) */}
        {mostrarBuscador && onCambioBusqueda && (
          <div className="navbar-catalogo__buscador">
            <input
              type="text"
              placeholder="Buscar camisas, pantalones, buzos..."
              value={terminoBusqueda}
              onChange={(e) => onCambioBusqueda(e.target.value)}
              aria-label="Buscar prendas"
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

        {/* Navegación y acciones por rol */}
        <div className="navbar-catalogo__acciones">
          {/* Enlace al Catálogo */}
          <Link to="/" className="nav-enlace">
            Catálogo
          </Link>

          {/* Menú para Administradores: Acceso directo a los Informes */}
          {isAuthenticated && esAdmin && (
            <Link to="/admin/informes" className="nav-enlace nav-enlace--admin">
              Informes Admin
            </Link>
          )}

          {/* Menú para Clientes: Acceso a "Mis Pedidos" y Carrito de Compras */}
          {isAuthenticated && esCliente && (
            <>
              <Link to="/mis-pedidos" className="nav-enlace">
                Mis Pedidos
              </Link>
              <Link to="/carrito" className="nav-enlace nav-enlace--carrito">
                Carrito ({totalArticulos})
              </Link>
            </>
          )}

          {/* Si no está autenticado, puede ver carrito si lo desea o loguearse */}
          {!isAuthenticated && (
            <Link to="/carrito" className="nav-enlace nav-enlace--carrito">
              Carrito ({totalArticulos})
            </Link>
          )}

          {/* Estado del usuario y Cerrar Sesión */}
          {isAuthenticated ? (
            <div className="navbar-catalogo__usuario">
              <div className="usuario-badge-contenedor">
                <span className="usuario-nombre">{user?.name}</span>
                <span className={`usuario-rol-badge rol-${user?.role}`}>
                  {user?.role === 'admin' ? 'Admin' : 'Cliente'}
                </span>
              </div>
              <button
                type="button"
                className="btn-cerrar-sesion"
                onClick={handleLogout}
                title="Cerrar sesión actual"
              >
                Salir
              </button>
            </div>
          ) : (
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
