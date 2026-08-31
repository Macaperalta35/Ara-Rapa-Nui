"use client";

import { createContext, useContext, useEffect, useReducer, useState } from "react";
import type { CartItem } from "@/lib/types/cart";
import { cartReducer, type CartState } from "./cart-reducer";
import { loadCart, saveCart } from "./cart-storage";

type CartContextValue = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (lineId: string) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  clear: () => void;
  itemCount: number;
  totalClp: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] } as CartState);
  const [hydrated, setHydrated] = useState(false);

  // Hydrate from localStorage after mount (avoids SSR/client mismatch).
  useEffect(() => {
    dispatch({ type: "HYDRATE", items: loadCart() });
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveCart(state.items);
  }, [state.items, hydrated]);

  const itemCount = state.items.reduce((sum, line) => sum + line.quantity, 0);
  const totalClp = state.items.reduce(
    (sum, line) => sum + line.quantity * line.unitPriceClp,
    0,
  );

  const value: CartContextValue = {
    items: state.items,
    addItem: (item) => dispatch({ type: "ADD_ITEM", item }),
    removeItem: (lineId) => dispatch({ type: "REMOVE_ITEM", lineId }),
    updateQuantity: (lineId, quantity) =>
      dispatch({ type: "UPDATE_QUANTITY", lineId, quantity }),
    clear: () => dispatch({ type: "CLEAR" }),
    itemCount,
    totalClp,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
