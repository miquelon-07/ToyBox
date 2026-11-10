import { useState, useEffect } from 'react';
import { CartItem, Producto } from '../types';

const CART_STORAGE_KEY = 'la_casita_3d_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Error loading cart from localStorage', e);
      return [];
    }
  });

  // Save to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Error saving cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (producto: Producto, selectedColor?: string, quantity: number = 1) => {
    const finalColor = selectedColor || producto.color;
    const cartItemId = `${producto.id}-${finalColor}`;

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.cart_item_id === cartItemId);
      if (existingIndex > -1) {
        const next = [...prevItems];
        next[existingIndex] = {
          ...next[existingIndex],
          cantidad: next[existingIndex].cantidad + quantity,
        };
        return next;
      } else {
        const newItem: CartItem = {
          cart_item_id: cartItemId,
          producto_id: producto.id,
          nombre: producto.nombre,
          material: producto.material,
          color: finalColor,
          precio: producto.precio,
          imagen: producto.imagen,
          cantidad: quantity,
          tiempo_impresion: producto.tiempo_impresion,
        };
        return [...prevItems, newItem];
      }
    });
  };

  const updateQuantity = (cartItemId: string, delta: number) => {
    setItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.cart_item_id === cartItemId) {
            const newQty = item.cantidad + delta;
            return newQty > 0 ? { ...item, cantidad: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((i) => i.cart_item_id !== cartItemId));
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.cantidad, 0);
  const subtotal = items.reduce((sum, item) => sum + item.precio * item.cantidad, 0);

  return {
    items,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
    totalCount,
    subtotal,
  };
}
