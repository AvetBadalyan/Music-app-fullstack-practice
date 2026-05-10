import { useEffect, useRef, useState } from 'react';
import { useDebouncedValue } from '../../app/useDebouncedValue';
import './SearchBar.scss';

interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  /** Debounce delay in ms before notifying the parent. Defaults to 250. */
  debounceMs?: number;
}

const SearchBar = ({ placeholder, value, onChange, debounceMs = 250 }: SearchBarProps) => {
  const [local, setLocal] = useState(value);
  const debounced = useDebouncedValue(local, debounceMs);
  const lastNotifiedRef = useRef(value);

  // Sync local state if the parent resets/overrides the value externally.
  useEffect(() => {
    if (value !== lastNotifiedRef.current) {
      setLocal(value);
      lastNotifiedRef.current = value;
    }
  }, [value]);

  // Notify parent only when the debounced value actually changes.
  useEffect(() => {
    if (debounced !== lastNotifiedRef.current) {
      lastNotifiedRef.current = debounced;
      onChange(debounced);
    }
  }, [debounced, onChange]);

  return (
    <div className="search-bar">
      <span className="search-icon" aria-hidden="true">🔍</span>
      <input
        type="text"
        placeholder={placeholder}
        value={local}
        onChange={(e) => setLocal(e.target.value)}
        aria-label={placeholder}
      />
      {local && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => setLocal('')}
          aria-label="Clear search"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default SearchBar;
