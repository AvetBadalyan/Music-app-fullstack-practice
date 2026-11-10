import { X } from 'lucide-react';
import { formatDuration } from '../../utils/formatDuration';
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
 * One row of the queue: a button that plays the song, and a second button
 * that removes it. They are separate buttons side by side (not one inside the
 * other), so the keyboard and screen readers handle both without extra code.
 */
const QueueItem = ({
  song,
  index,
  isCurrent,
  onRemove,
  onPlay,
}: QueueItemProps) => (
  <div className={`queue-item${isCurrent ? ' queue-item--current' : ''}`}>
    <button
      type="button"
      className="queue-item__play"
      onClick={() => onPlay(index)}
      aria-current={isCurrent ? 'true' : undefined}
      aria-label={`Play ${song.title}${song.artist ? ` by ${song.artist.name}` : ''}`}
    >
      {/* The current song shows animated bars, the others their position. */}
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

      <span className="queue-item__info">
        <span className="queue-item__title">{song.title}</span>
        {song.artist && (
          <span className="queue-item__artist">{song.artist.name}</span>
        )}
      </span>

      <span className="queue-item__duration">
        {formatDuration(song.duration, '--:--')}
      </span>
    </button>

    <button
      type="button"
      className="queue-item__remove"
      onClick={() => onRemove(index)}
      aria-label={`Remove ${song.title} from queue`}
      title={`Remove ${song.title} from queue`}
    >
      <X size={14} strokeWidth={2} aria-hidden="true" />
    </button>
  </div>
);

export default QueueItem;
