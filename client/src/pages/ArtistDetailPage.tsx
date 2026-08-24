import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetArtistByIdQuery,
  useDeleteArtistMutation,
} from '../services/artistsApi';
import { useAppSelector } from '../app/hooks';
import { useDominantColor } from '../app/useDominantColor';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import './ArtistDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const artistId = id ?? '';
  const [deleteArtist, { isLoading: isDeleting }] = useDeleteArtistMutation();
  const { data: artist, isLoading, error } = useGetArtistByIdQuery(artistId, {
    skip: !id,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);
  const dominant = useDominantColor(artist?.profilePicture);

  if (isLoading)
    return (
      <div className="artist-detail-page">
        <div className="page-status page-status--loading">Loading artist...</div>
      </div>
    );
  if (error || !artist)
    return (
      <div className="artist-detail-page">
        <div className="page-status">Artist not found.</div>
      </div>
    );

  const songCount = artist.songs?.length ?? 0;
  const albumCount = artist.albums?.length ?? 0;
  const cascadeNote =
    songCount || albumCount
      ? `\n\nThis will also delete ${albumCount} album(s) and ${songCount} song(s).`
      : '';
  const confirmMessage =
    `"${artist.name}" will be permanently removed.` +
    cascadeNote +
    `\n\nThis cannot be undone.`;

  const handleConfirmDelete = async () => {
    const target = artist;
    setConfirmOpen(false);
    navigate('/artists');
    try {
      await deleteArtist(target.id).unwrap();
      toast.success(`Deleted "${target.name}"`);
    } catch {
      toast.error(`Failed to delete "${target.name}"`);
    }
  };

  const heroColor = dominant ?? FALLBACK_COLOR;
  const heroStyle = {
    background: `linear-gradient(180deg, ${heroColor} 0%, var(--color-bg) 100%)`,
  };

  return (
    <div className="artist-detail-page">
      <div className="artist-header has-hero" style={heroStyle}>
        {artist.profilePicture && (
          <img
            className="profile-picture"
            src={artist.profilePicture}
            // Above the fold and the page's LCP element.
            loading="eager"
            fetchPriority="high"
            decoding="async"
            alt={artist.name}
          />
        )}
        <div className="artist-info">
          <h1>{artist.name}</h1>
          {artist.bio && <p className="bio">{artist.bio}</p>}
          {isAdmin && (
            <div className="artist-actions">
              <button
                type="button"
                className="toolbar-toggle"
                onClick={() =>
                  navigate('/songs', {
                    state: { createSong: true, artist },
                  })
                }
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add song</span>
              </button>
              <button
                type="button"
                className="delete-btn"
                onClick={() => setConfirmOpen(true)}
                disabled={isDeleting}
                title="Delete artist"
                aria-label="Delete artist"
              >
                <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
                <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {artist.albums && artist.albums.length > 0 && (
        <section className="artist-section">
          <h2>Albums</h2>
          <AlbumList albums={artist.albums} />
        </section>
      )}

      {artist.songs && artist.songs.length > 0 && (
        <section className="artist-section">
          <h2>Songs</h2>
          <SongList songs={artist.songs} />
        </section>
      )}
      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete artist?"
          message={confirmMessage}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default ArtistDetailPage;
