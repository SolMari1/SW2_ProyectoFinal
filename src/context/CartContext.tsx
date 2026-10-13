// src/context/CartContext.tsx
// Contexto para la gestión del carrito de compras (Solo clientes)
import { createContext, useContext, useState, useEffect, type ReactNode, type FC } from 'react';
import type { Product, TallaRopa, CartItem } from '../types/product';
import { useAuth } from '../hooks/useAuth';

interface CartContextType {
  cart: CartItem[];
  agregarAlCarrito: (producto: Product, talla: TallaRopa, cantidad: number) => { exito: boolean; mensaje: string };
  actualizarCantidad: (itemId: string, cantidad: number) => void;
  eliminarDelCarrito: (itemId: string) => void;
  vaciarCarrito: () => void;
  totalArticulos: number;
  totalPrecio: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  // Recuperar carrito de localStorage
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const guardado = localStorage.getItem('sw2_cart');
      return guardado ? JSON.parse(guardado) : [];
    } catch {
      return [];
    }
  });

  // Guardar en localStorage
  useEffect(() => {
    localStorage.setItem('sw2_cart', JSON.stringify(cart));
  }, [cart]);

  // Si el usuario cambia a admin o cierra sesión, limpiamos o restringimos el carrito
  useEffect(() => {
    if (user && user.role === 'admin') {
      setCart([]);
    }
  }, [user]);

  // Agregar al carrito verificando rol, talla y cantidad válidos
  const agregarAlCarrito = (
    producto: Product,
    talla: TallaRopa,
    cantidad: number
  ): { exito: boolean; mensaje: string } => {
    // Si el usuario es administrador, no tiene permitido comprar
    if (user?.role === 'admin') {
      return {
        exito: false,
        mensaje: 'Acción no permitida para administradores'
      };
    }

    // Validación estricta de talla
    if (!talla) {
      return {
        exito: false,
        mensaje: 'Debes seleccionar una talla primero'
      };
    }

    // Validación de cantidad mayor a cero
    if (!cantidad || cantidad <= 0) {
      return {
        exito: false,
        mensaje: 'La cantidad debe ser mayor a 0'
      };
    }

    const itemId = `prod-${producto.id}-${talla}`;

    setCart((prev) => {
      const indiceExistente = prev.findIndex((item) => item.id === itemId);
      if (indiceExistente >= 0) {
        const nuevoCarrito = [...prev];
        nuevoCarrito[indiceExistente] = {
          ...nuevoCarrito[indiceExistente],
          cantidad: nuevoCarrito[indiceExistente].cantidad + cantidad
        };
        return nuevoCarrito;
      }
      return [
        ...prev,
        {
          id: itemId,
          producto,
          talla,
          cantidad
        }
      ];
    });

    return {
      exito: true,
      mensaje: `Se agregaron ${cantidad} unidad(es) de ${producto.nombre} (Talla ${talla}) al carrito`
    };
  };

  const actualizarCantidad = (itemId: string, cantidad: number) => {
    if (cantidad <= 0) {
      eliminarDelCarrito(itemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, cantidad } : item))
    );
  };

  const eliminarDelCarrito = (itemId: string) => {
    setCart((prev) => prev.filter((item) => item.id !== itemId));
  };

  const vaciarCarrito = () => {
    setCart([]);
  };

  const totalArticulos = cart.reduce((acc, item) => acc + item.cantidad, 0);
  const totalPrecio = cart.reduce((acc, item) => acc + item.producto.precio * item.cantidad, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        agregarAlCarrito,
        actualizarCantidad,
        eliminarDelCarrito,
        vaciarCarrito,
        totalArticulos,
        totalPrecio
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart debe usarse dentro de un CartProvider');
  }
  return context;
};
