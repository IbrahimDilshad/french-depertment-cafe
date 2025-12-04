
"use client";

import { createContext, useContext, useState, ReactNode, useMemo } from "react";
import { MenuItem } from "@/lib/types";
import { useCollection } from "@/firebase";

type CartContextType = {
  cart: Record<string, number>;
  addToCart: (itemId: string) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  cartItems: (MenuItem & { quantity: number })[];
  totalItems: number;
  totalCost: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const { data: menuItems } = useCollection<MenuItem>("menuItems");

  const addToCart = (itemId: string) => {
    setCart((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
  };

  const removeFromCart = (itemId: string) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[itemId] > 1) {
        newCart[itemId]--;
      } else {
        delete newCart[itemId];
      }
      return newCart;
    });
  };
  
  const updateQuantity = (itemId: string, quantity: number) => {
      setCart((prev) => {
        const newCart = { ...prev };
        if (quantity > 0) {
            newCart[itemId] = quantity;
        } else {
            delete newCart[itemId];
        }
        return newCart;
    });
  }

  const clearCart = () => {
    setCart({});
  };

  const cartItems = useMemo(() => {
    if (!menuItems.length) return [];
    return Object.keys(cart)
      .map(itemId => {
        const item = menuItems.find(mi => mi.id === itemId);
        if (!item) return null;
        return { ...item, quantity: cart[itemId] };
      })
      .filter(Boolean) as (MenuItem & { quantity: number })[];
  }, [cart, menuItems]);
  
  const totalItems = useMemo(() => {
      return Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
  }, [cart]);

  const totalCost = useMemo(() => {
      return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cartItems]);


  const value = {
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    updateQuantity,
    cartItems,
    totalItems,
    totalCost,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
