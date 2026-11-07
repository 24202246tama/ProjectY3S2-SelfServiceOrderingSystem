import { createContext, use, useMemo, type ReactNode } from 'react';

import { STORAGE_KEYS } from '@/constants/config';
import { MENU_ITEMS } from '@/data/menu';
import { usePersistentState } from '@/lib/use-persistent-state';
import type { MenuItem } from '@/types';

interface MenuContextValue {
  items: MenuItem[];
  getItem: (id: string) => MenuItem | undefined;
  toggleAvailability: (id: string) => void;
  resetAvailability: () => void;
}

const MenuContext = createContext<MenuContextValue | null>(null);

type AvailabilityMap = Record<string, boolean>;

export function MenuProvider({ children }: { children: ReactNode }) {
  const [availability, setAvailability] = usePersistentState<AvailabilityMap>(
    STORAGE_KEYS.menuAvailability,
    {},
    (stored, current) => ({ ...stored, ...current }),
  );

  const items = useMemo(
    () =>
      MENU_ITEMS.map((item) => ({
        ...item,
        // Unpriced items can never be ordered, whatever the stored toggle says.
        available: item.price > 0 && (availability[item.id] ?? item.available),
      })),
    [availability],
  );

  const value: MenuContextValue = {
    items,
    getItem: (id) => items.find((item) => item.id === id),
    toggleAvailability: (id) =>
      setAvailability((current) => {
        const base = MENU_ITEMS.find((item) => item.id === id)?.available ?? true;
        return { ...current, [id]: !(current[id] ?? base) };
      }),
    resetAvailability: () => setAvailability({}),
  };

  return <MenuContext value={value}>{children}</MenuContext>;
}

export function useMenu(): MenuContextValue {
  const context = use(MenuContext);
  if (!context) throw new Error('useMenu must be used inside <MenuProvider>');
  return context;
}
