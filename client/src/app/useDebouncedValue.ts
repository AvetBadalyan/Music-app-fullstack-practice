import { useEffect, useState } from 'react';

/**
 * Returns a value that updates only after `delay` ms have elapsed
 * without further changes. Useful for search inputs / API filters.
 */
export function useDebouncedValue<T>(value: T, delay = 250): T {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value), delay);
    return () => window.clearTimeout(id);
  }, [value, delay]);

  return debounced;
}
