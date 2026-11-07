import type { OrderStatus } from '@/types';

export const RESTAURANT_NAME = 'Wickid Chicken';
export const TAX_RATE = 0;
export const TABLE_COUNT = 12;
export const MAX_TABLE_NUMBER = 999;
/** Must match `scheme` in app.json so table QR codes deep-link into the app. */
export const APP_SCHEME = 'selfservicesystem';

export const STORAGE_KEYS = {
  cart: '@sss/cart',
  orders: '@sss/orders',
  menuAvailability: '@sss/menu-availability',
} as const;

export const STATUS_LABELS: Record<OrderStatus, string> = {
  pending: 'Received',
  preparing: 'Preparing',
  ready: 'Ready',
  served: 'Served',
  cancelled: 'Cancelled',
};

/** Customer-facing progression; `cancelled` sits outside the flow. */
export const STATUS_FLOW: OrderStatus[] = ['pending', 'preparing', 'ready', 'served'];

export const ACTIVE_STATUSES: OrderStatus[] = ['pending', 'preparing', 'ready'];
