import type { ReactNode } from 'react';
import './StatsBadge.scss';

interface StatsBadgeProps {
  /** Icon element rendered on the left side of the badge. */
  icon: ReactNode;
  /** The primary value displayed in the badge (e.g., "12", "2h 15m"). */
  value: string;
  /** Optional supplementary label rendered after the value. */
  label?: string;
}

/**
 * A small read-only badge that pairs an icon with a stat value.
 * Used on artist and album detail pages to surface song count, duration, etc.
 */
const StatsBadge = ({ icon, value, label }: StatsBadgeProps) => (
  <span
    className="stats-badge"
    aria-label={label ? `${value} ${label}` : value}
  >
    <span className="stats-badge__icon" aria-hidden="true">
      {icon}
    </span>
    <span className="stats-badge__value">{value}</span>
    {label && <span className="stats-badge__label">{label}</span>}
  </span>
);

export default StatsBadge;
