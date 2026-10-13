// src/App.tsx
// Configuración de rutas principales de la aplicación con contextos de autenticación, órdenes y carrito
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OrderProvider } from './context/OrderContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Inicio from './pages/inicio';
import Cart from './pages/Cart';
import CustomerOrders from './pages/CustomerOrders';
import AdminReports from './pages/AdminReports';

function App() {
  return (
    <AuthProvider>
      <OrderProvider>
        <CartProvider>
          <BrowserRouter>
            <Routes>
              {/* Ruta principal: Catálogo de ropa unisex */}
              <Route path="/" element={<Inicio />} />
              <Route path="/catalogo" element={<Inicio />} />

              {/* Ruta del Carrito de compras (solo para clientes) */}
              <Route path="/carrito" element={<Cart />} />

              {/* Informe individual de pedidos anteriores (para clientes) */}
              <Route path="/mis-pedidos" element={<CustomerOrders />} />

              {/* Panel de 3 Informes para el Administrador */}
              <Route path="/admin/informes" element={<AdminReports />} />

              {/* Rutas de autenticación */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Redirección para cualquier ruta no encontrada hacia el catálogo */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}

export default App;