import { useParams, Link } from 'react-router-dom';
import {
  useGetAlbumByIdQuery,
  useDeleteAlbumMutation,
} from '../services/albumsApi';
import { useAppSelector } from '../app/hooks';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import SongList from '../components/songs/SongList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import PageStatus from '../components/common/PageStatus';
import './AlbumDetailPage.scss';

const AlbumDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: album,
    isLoading,
    error,
  } = useGetAlbumByIdQuery(id, { skip: !id });
  const [deleteAlbum, { isLoading: isDeleting }] = useDeleteAlbumMutation();
  const { isConfirmOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteWithConfirm({ deleteEntity: deleteAlbum, redirectTo: '/albums' });

  const heroStyle = useHeroGradient(album?.coverImage);

  if (isLoading) {
    return (
      <div className="album-detail-page">
        <PageStatus isLoading>Loading album...</PageStatus>
      </div>
    );
  }

  if (error || !album) {
    return (
      <div className="album-detail-page">
        <PageStatus>Album not found.</PageStatus>
      </div>
    );
  }

  const songCount = album.songs?.length ?? 0;
  const confirmMessage =
    `"${album.title}" will be permanently removed.` +
    (songCount ? `\n\nThis will also delete ${songCount} song(s).` : '') +
    `\n\nThis cannot be undone.`;

  return (
    <div className="album-detail-page">
      <div className="detail-hero" style={heroStyle}>
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
        <div className="detail-hero__info">
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
            <p className="meta">{new Date(album.releaseDate).getFullYear()}</p>
          )}
          {isAdmin && (
            <div className="detail-hero__actions">
              <DeleteButton
                label="Delete album"
                isDeleting={isDeleting}
                onClick={openConfirm}
              />
            </div>
          )}
        </div>
      </div>

      {album.songs && album.songs.length > 0 && (
        <section className="detail-section">
          <h2>Tracklist</h2>
          <SongList songs={album.songs} hideAlbumColumn />
        </section>
      )}
      {isAdmin && (
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete album?"
          message={confirmMessage}
          isLoading={isDeleting}
          onConfirm={() => confirmDelete(album.id, album.title)}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default AlbumDetailPage;
