import { createContext, use, type ReactNode } from 'react';

import { STORAGE_KEYS, TAX_RATE } from '@/constants/config';
import { usePersistentState } from '@/lib/use-persistent-state';
import type { CartItem, MenuItem } from '@/types';

interface CartState {
  tableNumber: number | null;
  items: CartItem[];
}

interface CartContextValue {
  tableNumber: number | null;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  tax: number;
  total: number;
  setTableNumber: (tableNumber: number | null) => void;
  addItem: (item: MenuItem) => void;
  increment: (itemId: string) => void;
  decrement: (itemId: string) => void;
  removeItem: (itemId: string) => void;
  clearCart: () => void;
  quantityOf: (itemId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

const EMPTY_CART: CartState = { tableNumber: null, items: [] };

function roundMoney(value: number): number {
  return Math.round(value * 100) / 100;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersistentState<CartState>(STORAGE_KEYS.cart, EMPTY_CART, (stored, current) => ({
    tableNumber: current.tableNumber ?? stored.tableNumber,
    items: current.items.length > 0 ? current.items : stored.items,
  }));

  const updateItems = (update: (items: CartItem[]) => CartItem[]) =>
    setCart((current) => ({ ...current, items: update(current.items) }));

  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = roundMoney(cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  const tax = roundMoney(subtotal * TAX_RATE);

  const value: CartContextValue = {
    tableNumber: cart.tableNumber,
    items: cart.items,
    itemCount,
    subtotal,
    tax,
    total: roundMoney(subtotal + tax),
    setTableNumber: (tableNumber) => setCart((current) => ({ ...current, tableNumber })),
    addItem: (menuItem) =>
      updateItems((items) => {
        const existing = items.find((item) => item.itemId === menuItem.id);
        if (existing) {
          return items.map((item) => (item.itemId === menuItem.id ? { ...item, quantity: item.quantity + 1 } : item));
        }
        return [
          ...items,
          { itemId: menuItem.id, name: menuItem.name, emoji: menuItem.emoji, price: menuItem.price, quantity: 1 },
        ];
      }),
    increment: (itemId) =>
      updateItems((items) =>
        items.map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity + 1 } : item)),
      ),
    decrement: (itemId) =>
      updateItems((items) =>
        items
          .map((item) => (item.itemId === itemId ? { ...item, quantity: item.quantity - 1 } : item))
          .filter((item) => item.quantity > 0),
      ),
    removeItem: (itemId) => updateItems((items) => items.filter((item) => item.itemId !== itemId)),
    clearCart: () => updateItems(() => []),
    quantityOf: (itemId) => cart.items.find((item) => item.itemId === itemId)?.quantity ?? 0,
  };

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = use(CartContext);
  if (!context) throw new Error('useCart must be used inside <CartProvider>');
  return context;
}
