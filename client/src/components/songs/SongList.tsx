import { Link } from 'react-router-dom';
import { useAppDispatch } from '../../app/hooks';
import { playSong } from '../../features/player/playerSlice';
import type { ISong } from '../../types/song';
import './SongList.scss';

interface SongListProps {
  songs: ISong[];
}

const formatDuration = (seconds?: number): string => {
  if (!seconds) return '--:--';
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SongList = ({ songs }: SongListProps) => {
  const dispatch = useAppDispatch();

  if (songs.length === 0) {
    return <p className="empty">No songs found.</p>;
  }

  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div key={song.id} className="song-row">
          <span className="index">{index + 1}</span>
          <div className="song-info">
            <Link to={`/songs/${song.id}`} className="title">{song.title}</Link>
            {song.artist && (
              <Link to={`/artists/${song.artist.id}`} className="artist">
                {song.artist.name}
              </Link>
            )}
          </div>
          <span className="duration">{formatDuration(song.duration)}</span>
          <button
            className="play-btn"
            onClick={() => dispatch(playSong({ song, queue: songs }))}
            title="Play"
          >
            ▶
          </button>
        </div>
      ))}
    </div>
  );
};

export default SongList;
