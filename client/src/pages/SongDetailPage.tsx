import { useParams, Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import { useGetSongByIdQuery } from '../services/songsApi';
import { useGetAlbumByIdQuery } from '../services/albumsApi';
import { useAppDispatch } from '../app/hooks';
import { useDominantColor } from '../app/useDominantColor';
import { playSong } from '../features/player/playerSlice';
import './SongDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SongDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: song, isLoading, error } = useGetSongByIdQuery(id!);
  const dispatch = useAppDispatch();
  const { data: album } = useGetAlbumByIdQuery(song?.album?.id ?? '', {
    skip: !song?.album?.id,
  });
  const coverImage = album?.coverImage;
  const dominant = useDominantColor(coverImage);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !song) return <p className="error">Song not found.</p>;

  const heroColor = dominant ?? FALLBACK_COLOR;
  const heroStyle = {
    background: `linear-gradient(180deg, ${heroColor} 0%, var(--color-bg) 100%)`,
  };

  return (
    <div className="song-detail-page">
      <div className="song-header has-hero" style={heroStyle}>
        <div className="cover-image">
          {coverImage ? (
            <img src={coverImage} alt={song.album?.title ?? song.title} />
          ) : (
            <div className="placeholder" aria-hidden="true">
              <Music size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="song-info">
          <p className="label">Song</p>
          <h1>{song.title}</h1>
          {song.artist && (
            <p className="artist">
              <Link to={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
            </p>
          )}
          <p className="meta">
            {song.album && (
              <Link to={`/albums/${song.album.id}`}>{song.album.title}</Link>
            )}
            {song.album && song.duration ? <span> · </span> : null}
            {song.duration && <span>{formatDuration(song.duration)}</span>}
          </p>
          {song.genres && song.genres.length > 0 && (
            <div className="genres">
              {song.genres.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/genres/${genre.id}`}
                  className="genre-tag"
                >
                  {genre.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="song-actions">
        <button
          className="play-btn"
          onClick={() => dispatch(playSong({ song }))}
        >
          <Play
            size={16}
            strokeWidth={2.5}
            fill="currentColor"
            aria-hidden="true"
          />
          <span>Play</span>
        </button>
      </div>
    </div>
  );
};

export default SongDetailPage;
