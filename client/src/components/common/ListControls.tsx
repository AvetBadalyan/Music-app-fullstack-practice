import { useId, type ReactNode } from 'react';
import './ListControls.scss';

interface ListControlsProps {
  children: ReactNode;
  /** A short count such as "4 albums", shown at the far end of the row. */
  summary?: string;
}

/** The row of controls above a list (sort dropdown, genre chips). */
const ListControls = ({ children, summary }: ListControlsProps) => (
  <div className="list-controls">
    {children}
    {summary && <p className="list-controls__summary">{summary}</p>}
  </div>
);

interface SortSelectProps {
  options: { value: string; label: string }[];
  value: string;
  onChange: (value: string) => void;
}

/** A native <select>, so keyboard and screen-reader support come for free. */
export const SortSelect = ({ options, value, onChange }: SortSelectProps) => {
  const id = useId();

  return (
    <div className="sort-select">
      <label className="sort-select__label" htmlFor={id}>
        Sort by
      </label>
      <select
        id={id}
        className="sort-select__field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

interface ChipGroupProps {
  /** Names the group for screen readers, e.g. "Filter by genre". */
  label: string;
  options: string[];
  selected: string[];
  onToggle: (option: string) => void;
}

/** Pills that switch on and off; any number can be on at once. */
export const ChipGroup = ({
  label,
  options,
  selected,
  onToggle,
}: ChipGroupProps) => (
  <div className="chip-group" role="group" aria-label={label}>
    {options.map((option) => {
      const isActive = selected.includes(option);

      return (
        <button
          key={option}
          type="button"
          className={`chip${isActive ? ' chip--active' : ''}`}
          aria-pressed={isActive}
          onClick={() => onToggle(option)}
        >
          {option}
        </button>
      );
    })}
  </div>
);

export default ListControls;
