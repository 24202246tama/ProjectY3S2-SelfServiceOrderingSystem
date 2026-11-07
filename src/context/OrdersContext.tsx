import { createContext, use, type ReactNode } from 'react';

import { STORAGE_KEYS } from '@/constants/config';
import { usePersistentState } from '@/lib/use-persistent-state';
import type { CartItem, Order, OrderStatus, PaymentMethod } from '@/types';

export interface NewOrder {
  tableNumber: number;
  customerName: string;
  notes: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
}

interface OrdersContextValue {
  orders: Order[];
  hydrated: boolean;
  placeOrder: (order: NewOrder) => Order;
  updateStatus: (orderId: string, status: OrderStatus) => void;
  getOrder: (orderId: string) => Order | undefined;
  clearOrders: () => void;
}

const OrdersContext = createContext<OrdersContextValue | null>(null);

function generateId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}

function generateCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) code += alphabet[Math.floor(Math.random() * alphabet.length)];
  return code;
}

export function OrdersProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders, hydrated] = usePersistentState<Order[]>(STORAGE_KEYS.orders, [], (stored, current) => {
    const storedIds = new Set(stored.map((order) => order.id));
    return [...current.filter((order) => !storedIds.has(order.id)), ...stored];
  });

  const value: OrdersContextValue = {
    orders,
    hydrated,
    placeOrder: (input) => {
      const now = Date.now();
      const order: Order = {
        ...input,
        id: generateId(),
        code: generateCode(),
        status: 'pending',
        createdAt: now,
        updatedAt: now,
      };
      setOrders((current) => [order, ...current]);
      return order;
    },
    updateStatus: (orderId, status) =>
      setOrders((current) =>
        current.map((order) => (order.id === orderId ? { ...order, status, updatedAt: Date.now() } : order)),
      ),
    getOrder: (orderId) => orders.find((order) => order.id === orderId),
    clearOrders: () => setOrders([]),
  };

  return <OrdersContext value={value}>{children}</OrdersContext>;
}

export function useOrders(): OrdersContextValue {
  const context = use(OrdersContext);
  if (!context) throw new Error('useOrders must be used inside <OrdersProvider>');
  return context;
}
