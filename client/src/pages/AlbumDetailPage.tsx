import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetAlbumByIdQuery,
  useDeleteAlbumMutation,
} from '../services/albumsApi';
import { useAppSelector } from '../app/hooks';
import { useDominantColor } from '../app/useDominantColor';
import SongList from '../components/songs/SongList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './AlbumDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const AlbumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const albumId = id ?? '';
  const [deleteAlbum, { isLoading: isDeleting }] = useDeleteAlbumMutation();
  const { data: album, isLoading, error } = useGetAlbumByIdQuery(albumId, {
    skip: !id,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dominant = useDominantColor(album?.coverImage);

  if (isLoading)
    return (
      <div className="album-detail-page">
        <div className="page-status page-status--loading">Loading album...</div>
      </div>
    );
  if (error || !album)
    return (
      <div className="album-detail-page">
        <div className="page-status">Album not found.</div>
      </div>
    );

  const songCount = album.songs?.length ?? 0;
  const confirmMessage =
    `"${album.title}" will be permanently removed.` +
    (songCount ? `\n\nThis will also delete ${songCount} song(s).` : '') +
    `\n\nThis cannot be undone.`;

  // Wait for the server before closing the dialog and navigating: the delete
  // is not undoable, so the confirm button holds its "Working..." state until
  // it succeeds. On failure the dialog stays open so the action can be retried.
  const handleConfirmDelete = async () => {
    const target = album;
    try {
      await deleteAlbum(target.id).unwrap();
      setConfirmOpen(false);
      navigate('/albums');
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
    <div className="album-detail-page">
      <div className="album-header has-hero" style={heroStyle}>
        {album.coverImage && (
          <img
            className="cover-image"
            src={album.coverImage}
            // Above the fold and the page's LCP element.
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt={album.title}
          />
        )}
        <div className="album-info">
          <p className="label">Album</p>
          <h1>{album.title}</h1>
          {album.artist && (
            <p className="artist">
              <Link to={`/artists/${album.artist.id}`}>
                {album.artist.name}
              </Link>
            </p>
          )}
          {album.releaseDate && (
            <p className="release-date">
              {new Date(album.releaseDate).getFullYear()}
            </p>
          )}
          {isAdmin && (
            <div className="album-actions">
              <button
                type="button"
                className="delete-btn"
                onClick={() => setConfirmOpen(true)}
                disabled={isDeleting}
                title="Delete album"
                aria-label="Delete album"
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {album.songs && album.songs.length > 0 && (
        <section className="tracklist">
          <h2>Tracklist</h2>
          <SongList songs={album.songs} hideAlbumColumn />
        </section>
      )}
      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete album?"
          message={confirmMessage}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default AlbumDetailPage;
