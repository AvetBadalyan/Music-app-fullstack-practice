import { Link, useParams } from 'react-router-dom';
import { Clock, Disc } from 'lucide-react';
import {
  useDeleteAlbumMutation,
  useGetAlbumByIdQuery,
  useGetAllAlbumsQuery,
} from '../services/albumsApi';
import { useAppSelector } from '../app/hooks';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { formatTotalDuration } from '../utils/formatTotalDuration';
import { getReleaseYear } from '../utils/getReleaseYear';
import { pluralize } from '../utils/pluralize';
import AlbumList from '../components/albums/AlbumList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import GenreTags from '../components/common/GenreTags';
import PageStatus from '../components/common/PageStatus';
import PlayAllButton from '../components/common/PlayAllButton';
import StatsBadge from '../components/common/StatsBadge';
import SongList from '../components/songs/SongList';
import type { IGenre } from '../types/api';
import './AlbumDetailPage.scss';

/** How many other albums to suggest at the bottom of the page. */
const MORE_ALBUMS_COUNT = 4;

const AlbumDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: album,
    isLoading,
    error,
  } = useGetAlbumByIdQuery(id, { skip: !id });
  const { data: allAlbums } = useGetAllAlbumsQuery();

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

  const songs = album.songs ?? [];
  const releaseYear = getReleaseYear(album.releaseDate);
  const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);
  const otherAlbums = (allAlbums ?? [])
    .filter((other) => other.id !== album.id)
    .slice(0, MORE_ALBUMS_COUNT);

  // The album's genres are the genres of its songs, each listed once.
  const genres: IGenre[] = [];
  for (const song of songs) {
    for (const genre of song.genres ?? []) {
      if (!genres.some((existing) => existing.id === genre.id)) {
        genres.push(genre);
      }
    }
  }

  const confirmMessage =
    `"${album.title}" will be permanently removed.` +
    (songs.length
      ? `\n\nThis will also delete ${pluralize(songs.length, 'song')}.`
      : '') +
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
          {releaseYear && <p className="meta">{releaseYear}</p>}

          <div className="detail-hero__stats">
            <StatsBadge
              icon={<Disc size={14} strokeWidth={2} />}
              value={String(songs.length)}
              label={songs.length === 1 ? 'track' : 'tracks'}
            />
            {totalSeconds > 0 && (
              <StatsBadge
                icon={<Clock size={14} strokeWidth={2} />}
                value={formatTotalDuration(totalSeconds)}
              />
            )}
          </div>

          <div className="detail-hero__actions">
            <PlayAllButton songs={songs} />
            {isAdmin && (
              <DeleteButton
                label="Delete album"
                isDeleting={isDeleting}
                onClick={openConfirm}
              />
            )}
          </div>
        </div>
      </div>

      {genres.length > 0 && (
        <section className="detail-section">
          <GenreTags genres={genres} />
        </section>
      )}

      {songs.length > 0 && (
        <section className="detail-section">
          <h2>Tracklist</h2>
          <SongList songs={songs} hideAlbumColumn />
        </section>
      )}

      {otherAlbums.length > 0 && (
        <section className="detail-section">
          <h2>More albums</h2>
          <AlbumList albums={otherAlbums} />
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
