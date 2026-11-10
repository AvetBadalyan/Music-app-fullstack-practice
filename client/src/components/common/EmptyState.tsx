import { Link } from 'react-router-dom';
import {
  Disc3,
  Filter,
  Mic2,
  Music,
  SearchX,
  Tags,
  type LucideIcon,
} from 'lucide-react';
import './EmptyState.scss';

type EmptyStateContext =
  | 'no-albums'
  | 'no-artists'
  | 'no-songs'
  | 'no-genres'
  | 'no-search-results'
  | 'no-filter-results';

/** The icon and wording used for each kind of empty list. */
const CONTENT: Record<
  EmptyStateContext,
  { icon: LucideIcon; title: string; description: string }
> = {
  'no-albums': {
    icon: Disc3,
    title: 'No albums yet',
    description: 'Albums will show up here once they are added.',
  },
  'no-artists': {
    icon: Mic2,
    title: 'No artists yet',
    description: 'Artists will show up here once they are added.',
  },
  'no-songs': {
    icon: Music,
    title: 'No songs yet',
    description: 'Songs will show up here once they are added.',
  },
  'no-genres': {
    icon: Tags,
    title: 'No genres yet',
    description: 'Genres will show up here once they are added.',
  },
  'no-search-results': {
    icon: SearchX,
    title: 'No results found',
    description: 'Try a different search term.',
  },
  'no-filter-results': {
    icon: Filter,
    title: 'No matches',
    description: 'Nothing matches the current filters.',
  },
};

interface EmptyStateProps {
  context: EmptyStateContext;
  /** Replaces the default title for this context. */
  title?: string;
  /** Replaces the default description for this context. */
  description?: string;
  /** An optional button (onClick) or link (to) under the text. */
  action?: { label: string; onClick?: () => void; to?: string };
}

const EmptyState = ({
  context,
  title,
  description,
  action,
}: EmptyStateProps) => {
  const content = CONTENT[context];
  const Icon = content.icon;

  return (
    <div className="empty-state">
      <div className="empty-icon" aria-hidden="true">
        <Icon size={32} strokeWidth={1.75} />
      </div>
      <h3>{title ?? content.title}</h3>
      <p>{description ?? content.description}</p>
      {action?.to && (
        <Link to={action.to} className="empty-action">
          {action.label}
        </Link>
      )}
      {action?.onClick && (
        <button type="button" className="empty-action" onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
