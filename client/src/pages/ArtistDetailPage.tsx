import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  useGetArtistByIdQuery,
  useDeleteArtistMutation,
} from '../services/artistsApi';
import { useAppSelector } from '../app/hooks';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import PageStatus from '../components/common/PageStatus';
import './ArtistDetailPage.scss';

const ArtistDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: artist,
    isLoading,
    error,
  } = useGetArtistByIdQuery(id, { skip: !id });
  const [deleteArtist, { isLoading: isDeleting }] = useDeleteArtistMutation();
  const { isConfirmOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteWithConfirm({ deleteEntity: deleteArtist, redirectTo: '/artists' });

  const heroStyle = useHeroGradient(artist?.profilePicture);

  if (isLoading) {
    return (
      <div className="artist-detail-page">
        <PageStatus isLoading>Loading artist...</PageStatus>
      </div>
    );
  }

  if (error || !artist) {
    return (
      <div className="artist-detail-page">
        <PageStatus>Artist not found.</PageStatus>
      </div>
    );
  }

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

  return (
    <div className="artist-detail-page">
      <div className="detail-hero" style={heroStyle}>
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
        <div className="detail-hero__info">
          <h1>{artist.name}</h1>
          {artist.bio && <p className="bio">{artist.bio}</p>}
          {isAdmin && (
            <div className="detail-hero__actions">
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
              <DeleteButton
                label="Delete artist"
                isDeleting={isDeleting}
                onClick={openConfirm}
              />
            </div>
          )}
        </div>
      </div>

      {artist.albums && artist.albums.length > 0 && (
        <section className="detail-section">
          <h2>Albums</h2>
          <AlbumList albums={artist.albums} />
        </section>
      )}

      {artist.songs && artist.songs.length > 0 && (
        <section className="detail-section">
          <h2>Songs</h2>
          <SongList songs={artist.songs} />
        </section>
      )}
      {isAdmin && (
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete artist?"
          message={confirmMessage}
          isLoading={isDeleting}
          onConfirm={() => confirmDelete(artist.id, artist.name)}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default ArtistDetailPage;
