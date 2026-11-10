import type { ReactNode } from 'react';
import { useCountUp } from '../../hooks/useCountUp';
import './StatCard.scss';

interface StatCardProps {
  icon: ReactNode;
  value: number;
  label: string;
  /** Turns the counting number into text, e.g. seconds into "13 min". */
  format?: (value: number) => string;
}

/** One headline number that counts up when it appears. */
const StatCard = ({
  icon,
  value,
  label,
  format = (number) => String(Math.round(number)),
}: StatCardProps) => {
  const countedValue = useCountUp(value);

  return (
    <div className="stat-card">
      <span className="stat-card__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="stat-card__value">{format(countedValue)}</p>
      <p className="stat-card__label">{label}</p>
    </div>
  );
};

export default StatCard;
