import { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import './SearchBar.scss';

interface SearchBarProps {
  placeholder: string;
  value: string;
  /** Called with the debounced term, not on every keystroke. */
  onChange: (value: string) => void;
  /** Max characters, capped to what the API accepts. */
  maxLength?: number;
}

/**
 * Search input that owns what the visitor is typing and reports it to the page
 * only once they pause, so a page can drive a query straight off `onChange`
 * without firing a request per keystroke.
 */
const SearchBar = ({
  placeholder,
  value,
  onChange,
  maxLength = FIELD_LIMITS.searchQuery,
}: SearchBarProps) => {
  const [term, setTerm] = useState(value);
  const debouncedTerm = useDebouncedValue(term);

  useEffect(() => {
    onChange(debouncedTerm);
  }, [debouncedTerm, onChange]);

  return (
    <div className="search-bar">
      <Search
        size={16}
        strokeWidth={2}
        className="search-icon"
        aria-hidden="true"
      />
      <input
        type="text"
        placeholder={placeholder}
        value={term}
        onChange={(event) => setTerm(event.target.value)}
        aria-label={placeholder}
        maxLength={maxLength}
      />
      {term && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => setTerm('')}
          aria-label="Clear search"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
