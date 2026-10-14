"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem } from "@/types/cart";
import { Product, ProductVariant } from "@/types/database";
import { toast } from "sonner";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isInitialized: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "click_modas_cart_v1";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error("Falha ao carregar carrinho local:", error);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (!isInitialized) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error("Falha ao salvar carrinho no armazenamento local:", error);
    }
  }, [items, isInitialized]);

  const addItem = (product: Product, variant: ProductVariant, quantity: number = 1): boolean => {
    const compositeId = `${product.id}-${variant.id}`;
    const existing = items.find((item) => item.id === compositeId);

    const currentQty = existing ? existing.quantity : 0;
    const requestedQty = currentQty + quantity;

    if (requestedQty > variant.stock) {
      toast.error(`Estoque máximo atingido para o tamanho ${variant.size} (${variant.stock} disponíveis).`);
      return false;
    }

    if (existing) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === compositeId ? { ...item, quantity: requestedQty } : item
        )
      );
      toast.success(`Quantidade atualizada no carrinho (${requestedQty} un).`);
    } else {
      setItems((prev) => [
        ...prev,
        {
          id: compositeId,
          product,
          variant,
          quantity,
        },
      ]);
      toast.success(`${product.name} (Tam ${variant.size}) adicionado ao carrinho!`);
    }

    return true;
  };

  const removeItem = (cartItemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== cartItemId));
    toast.info("Item removido do carrinho.");
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(cartItemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.id === cartItemId) {
          if (quantity > item.variant.stock) {
            toast.error(`Quantidade máxima disponível: ${item.variant.stock}`);
            return item;
          }
          return { ...item, quantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch {}
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const subtotal = items.reduce((sum, item) => {
    const unitPrice = item.product.promotional_price ?? item.product.price;
    return sum + unitPrice * item.quantity;
  }, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isInitialized,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart deve ser utilizado dentro de um CartProvider");
  }
  return context;
}
