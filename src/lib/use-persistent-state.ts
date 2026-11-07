import { useEffect, useState, type Dispatch, type SetStateAction } from 'react';

import { loadJSON, saveJSON } from '@/lib/storage';

/**
 * `useState` backed by AsyncStorage. Returns `hydrated = false` until the stored
 * value has been read. `merge` reconciles the stored value with any state set
 * before hydration finished (e.g. a deep link that arrives on cold start).
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  merge: (stored: T, current: T) => T = (stored) => stored,
): [T, Dispatch<SetStateAction<T>>, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    let cancelled = false;
    loadJSON<T>(key, initialValue).then((stored) => {
      if (cancelled) return;
      setValue((current) => merge(stored, current));
      setHydrated(true);
    });
    return () => {
      cancelled = true;
    };
    // Load once per key; initialValue and merge are only consulted on first read.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (hydrated) saveJSON(key, value);
  }, [key, value, hydrated]);

  return [value, setValue, hydrated];
}
