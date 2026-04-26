import { useParams, Link } from 'react-router-dom';
import { useGetSongByIdQuery } from '../services/songsApi';
import { useAppDispatch } from '../app/hooks';
import { playSong } from '../features/player/playerSlice';
import './SongDetailPage.scss';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SongDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: song, isLoading, error } = useGetSongByIdQuery(id!);
  const dispatch = useAppDispatch();

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !song) return <p className="error">Song not found.</p>;

  return (
    <div className="song-detail-page">
      <div className="song-header">
        <div className="song-info">
          <h1>{song.title}</h1>
          {song.artist && (
            <p className="artist">
              <Link to={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
            </p>
          )}
          {song.album && (
            <p className="album">
              <Link to={`/albums/${song.album.id}`}>{song.album.title}</Link>
            </p>
          )}
          {song.duration && (
            <p className="duration">{formatDuration(song.duration)}</p>
          )}
          {song.genres && song.genres.length > 0 && (
            <div className="genres">
              {song.genres.map((genre) => (
                <Link key={genre.id} to={`/genres/${genre.id}`} className="genre-tag">
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <button
        className="play-btn"
        onClick={() => dispatch(playSong({ song }))}
      >
        ▶ Play
      </button>
    </div>
  );
};

export default SongDetailPage;
