import { Link } from 'react-router-dom';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: string;
  title: string;
  description?: string;
  actionLabel?: string;
  actionTo?: string;
}

const EmptyState = ({
  icon = '♪',
  title,
  description,
  actionLabel,
  actionTo,
}: EmptyStateProps) => (
  <div className="empty-state">
    <div className="empty-icon" aria-hidden="true">{icon}</div>
    <h3>{title}</h3>
    {description && <p>{description}</p>}
    {actionLabel && actionTo && (
      <Link to={actionTo} className="empty-action">{actionLabel}</Link>
    )}
  </div>
);

export default EmptyState;
