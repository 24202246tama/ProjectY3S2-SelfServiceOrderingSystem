export type Category =
  | 'BBQ Meals'
  | 'Fried Meals'
  | 'Burgers & Rolls'
  | 'Seafood Meals'
  | 'Sides'
  | 'Drinks'
  | 'Ice Cream';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
  available: boolean;
}

export interface CartItem {
  itemId: string;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'served' | 'cancelled';

export type PaymentMethod = 'card' | 'cash';

export interface Order {
  id: string;
  code: string;
  tableNumber: number;
  customerName: string;
  notes: string;
  paymentMethod: PaymentMethod;
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  status: OrderStatus;
  createdAt: number;
  updatedAt: number;
}
