import { X } from 'lucide-react';
import { formatDuration } from '../../utils/formatDuration';
import { truncateText } from '../../utils/truncateText';
import type { ISong } from '../../types/api';
import './QueueItem.scss';

interface QueueItemProps {
  song: ISong;
  index: number;
  isCurrent: boolean;
  onRemove: (index: number) => void;
  onPlay: (index: number) => void;
}

/**
 * A single row in the Now Playing queue sidebar.
 *
 * Clicking the row (except the remove button) calls onPlay with the item's
 * index. The remove button stops event propagation so it doesn't trigger
 * playback. When isCurrent is true the row gets an accent background and an
 * animated equalizer indicator replaces the position number.
 */
const QueueItem = ({
  song,
  index,
  isCurrent,
  onRemove,
  onPlay,
}: QueueItemProps) => {
  const title = truncateText(song.title, 40);
  const artistName = song.artist ? truncateText(song.artist.name, 30) : null;

  const handleRowKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onPlay(index);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove(index);
  };

  // Prevent the row's Enter/Space handler from also firing when the
  // remove button is activated via keyboard.
  const handleRemoveKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
    }
  };

  return (
    <div
      className={`queue-item${isCurrent ? ' queue-item--current' : ''}`}
      role="button"
      tabIndex={0}
      onClick={() => onPlay(index)}
      onKeyDown={handleRowKeyDown}
      aria-current={isCurrent ? 'true' : undefined}
      aria-label={`Play ${song.title}${song.artist ? ` by ${song.artist.name}` : ''}`}
    >
      {/* Position indicator — equalizer bars when playing, number otherwise */}
      <span className="queue-item__indicator" aria-hidden="true">
        {isCurrent ? (
          <span className="equalizer">
            <span />
            <span />
            <span />
          </span>
        ) : (
          <span className="queue-item__index">{index + 1}</span>
        )}
      </span>

      {/* Title + artist */}
      <div className="queue-item__info">
        <span className="queue-item__title">{title}</span>
        {artistName && (
          <span className="queue-item__artist">{artistName}</span>
        )}
      </div>

      {/* Duration */}
      <span className="queue-item__duration">
        {formatDuration(song.duration, '--:--')}
      </span>

      {/* Remove from queue */}
      <button
        type="button"
        className="queue-item__remove"
        onClick={handleRemoveClick}
        onKeyDown={handleRemoveKeyDown}
        aria-label={`Remove ${song.title} from queue`}
        title={`Remove ${song.title} from queue`}
      >
        <X size={14} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
};

export default QueueItem;
