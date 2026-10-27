import { Play } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { playSong } from '../../features/player/playerSlice';
import type { ISong } from '../../types/api';
import './PlayAllButton.scss';

interface PlayAllButtonProps {
  songs: ISong[];
  disabled?: boolean;
  disabledReason?: string;
  /** Optional sort function: receives the song array and returns a sorted copy. */
  sortFn?: (songs: ISong[]) => ISong[];
}

const PlayAllButton = ({
  songs,
  disabled = false,
  disabledReason,
  sortFn,
}: PlayAllButtonProps) => {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    if (disabled || songs.length === 0) return;

    const queue = sortFn ? sortFn(songs) : [...songs];
    dispatch(playSong({ song: queue[0], queue }));
  };

  const isDisabled = disabled || songs.length === 0;
  const tooltip = isDisabled ? (disabledReason ?? undefined) : undefined;

  return (
    <button
      type="button"
      className="play-all-btn"
      onClick={handleClick}
      disabled={isDisabled}
      title={tooltip}
      aria-label={tooltip ?? 'Play all songs'}
      aria-disabled={isDisabled}
    >
      <Play size={16} strokeWidth={2} aria-hidden="true" />
      <span>Play All</span>
    </button>
  );
};

export default PlayAllButton;
