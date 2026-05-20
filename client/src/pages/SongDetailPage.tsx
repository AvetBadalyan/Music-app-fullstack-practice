import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Play, Music, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetSongByIdQuery,
  useDeleteSongMutation,
} from '../services/songsApi';
import { useGetAlbumByIdQuery } from '../services/albumsApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useDominantColor } from '../app/useDominantColor';
import { playSong } from '../features/player/playerSlice';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './SongDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const SongDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const songId = id ?? '';
  const [deleteSong, { isLoading: isDeleting }] = useDeleteSongMutation();
  const { data: song, isLoading, error } = useGetSongByIdQuery(songId, {
    skip: !id,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const { data: album } = useGetAlbumByIdQuery(song?.album?.id ?? '', {
    skip: !song?.album?.id,
  });
  const coverImage = album?.coverImage;
  const dominant = useDominantColor(coverImage);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !song) return <p className="error">Song not found.</p>;

  const handleConfirmDelete = async () => {
    const target = song;
    setConfirmOpen(false);
    navigate('/songs');
    try {
      await deleteSong(target.id).unwrap();
      toast.success(`Deleted "${target.title}"`);
    } catch {
      toast.error(`Failed to delete "${target.title}"`);
    }
  };

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
        {isAdmin && (
          <button
            type="button"
            className="delete-btn"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            title="Delete song"
            aria-label="Delete song"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
          </button>
        )}
      </div>
      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete song?"
          message={`"${song.title}" will be permanently removed. This cannot be undone.`}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default SongDetailPage;
