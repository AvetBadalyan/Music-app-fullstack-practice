import { Play } from 'lucide-react';
import { useAppDispatch } from '../../app/hooks';
import { playSong } from '../../features/player/playerSlice';
import type { ISong } from '../../types/api';
import './PlayAllButton.scss';

interface PlayAllButtonProps {
  songs: ISong[];
  label?: string;
}

/** Starts the first song and queues the rest, in the order they are shown. */
const PlayAllButton = ({ songs, label = 'Play All' }: PlayAllButtonProps) => {
  const dispatch = useAppDispatch();
  const hasNoSongs = songs.length === 0;

  return (
    <button
      type="button"
      className="play-all-btn"
      onClick={() => dispatch(playSong({ song: songs[0], queue: songs }))}
      disabled={hasNoSongs}
      title={hasNoSongs ? 'No songs to play' : undefined}
    >
      <Play size={16} strokeWidth={2} aria-hidden="true" />
      <span>{label}</span>
    </button>
  );
};

export default PlayAllButton;
