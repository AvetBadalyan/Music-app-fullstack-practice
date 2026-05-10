import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { playSong, togglePlay } from '../../features/player/playerSlice';
import EmptyState from '../common/EmptyState';
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
  const { currentSong, isPlaying } = useAppSelector((state) => state.player);

  if (songs.length === 0) {
    return (
      <EmptyState
        title="No songs yet"
        description="Your library is quiet. Add a track to get the music going."
        actionLabel="Add a song"
        actionTo="/create"
      />
    );
  }

  return (
    <div className="song-list">
      {songs.map((song, index) => {
        const isActive = currentSong?.id === song.id;
        const isActivePlaying = isActive && isPlaying;

        const handleClick = () => {
          if (isActive) {
            dispatch(togglePlay());
          } else {
            dispatch(playSong({ song, queue: songs }));
          }
        };

        return (
          <div
            key={song.id}
            className={`song-row${isActive ? ' is-active' : ''}`}
          >
            <button
              className="index-play"
              onClick={handleClick}
              title={isActivePlaying ? `Pause ${song.title}` : `Play ${song.title}`}
              aria-label={isActivePlaying ? `Pause ${song.title}` : `Play ${song.title}`}
            >
              <span className="index">{index + 1}</span>
              <span className="play-icon" aria-hidden="true">
                {isActivePlaying ? '❚❚' : '▶'}
              </span>
            </button>
            <div className="song-info">
              <Link to={`/songs/${song.id}`} className="title">{song.title}</Link>
              {song.artist && (
                <Link to={`/artists/${song.artist.id}`} className="artist">
                  {song.artist.name}
                </Link>
              )}
            </div>
            {song.album ? (
              <Link to={`/albums/${song.album.id}`} className="album-col">
                {song.album.title}
              </Link>
            ) : (
              <span className="album-col empty-col">—</span>
            )}
            <span className="duration">{formatDuration(song.duration)}</span>
          </div>
        );
      })}
    </div>
  );
};

export default SongList;
