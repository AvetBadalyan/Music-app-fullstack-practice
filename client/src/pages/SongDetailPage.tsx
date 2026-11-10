import { Link, useParams } from 'react-router-dom';
import { Music } from 'lucide-react';
import {
  useDeleteSongMutation,
  useGetAllSongsQuery,
  useGetSongByIdQuery,
} from '../services/songsApi';
import { useAppSelector } from '../app/hooks';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { formatDuration } from '../utils/formatDuration';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import GenreTags from '../components/common/GenreTags';
import PageStatus from '../components/common/PageStatus';
import PlayAllButton from '../components/common/PlayAllButton';
import SongList from '../components/songs/SongList';
import './SongDetailPage.scss';

/** How many songs to suggest at the bottom of the page. */
const MORE_SONGS_COUNT = 5;

const SongDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: song,
    isLoading,
    error,
  } = useGetSongByIdQuery(id, { skip: !id });
  const { data: allSongs } = useGetAllSongsQuery();
  const [deleteSong, { isLoading: isDeleting }] = useDeleteSongMutation();
  const { isConfirmOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteWithConfirm({ deleteEntity: deleteSong, redirectTo: '/songs' });

  // ISong.album is IAlbumRef which already includes coverImage — no extra fetch needed.
  const coverImage = song?.album?.coverImage;
  const heroStyle = useHeroGradient(coverImage);

  if (isLoading) {
    return (
      <div className="song-detail-page">
        <PageStatus isLoading>Loading song...</PageStatus>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="song-detail-page">
        <PageStatus>Song not found.</PageStatus>
      </div>
    );
  }

  const genres = song.genres ?? [];

  // Other songs that share at least one genre with this one.
  const similarSongs = (allSongs ?? [])
    .filter(
      (other) =>
        other.id !== song.id &&
        other.genres?.some((otherGenre) =>
          genres.some((genre) => genre.id === otherGenre.id),
        ),
    )
    .slice(0, MORE_SONGS_COUNT);

  return (
    <div className="song-detail-page">
      <div className="detail-hero" style={heroStyle}>
        <div className="cover-image">
          {coverImage ? (
            <img
              src={coverImage}
              // Above the fold and the page's LCP element.
              loading="eager"
              fetchPriority="high"
              decoding="async"
              alt={song.album?.title ?? song.title}
            />
          ) : (
            <div className="placeholder" aria-hidden="true">
              <Music size={48} strokeWidth={1.5} />
            </div>
          )}
        </div>
        <div className="detail-hero__info">
          <p className="label">Song</p>
          <h1>{song.title}</h1>
          {song.artist && (
            <p className="artist">
              <Link to={`/artists/${song.artist.id}`}>{song.artist.name}</Link>
            </p>
          )}
          <p className="meta">
            {song.album && (
              <>
                <Link to={`/albums/${song.album.id}`}>{song.album.title}</Link>
                {' · '}
              </>
            )}
            {formatDuration(song.duration)}
          </p>

          <div className="detail-hero__actions">
            <PlayAllButton songs={[song]} label="Play" />
            {isAdmin && (
              <DeleteButton
                label="Delete song"
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

      {similarSongs.length > 0 && (
        <section className="detail-section">
          <h2>More like this</h2>
          <SongList songs={similarSongs} />
        </section>
      )}

      {isAdmin && (
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete song?"
          message={`"${song.title}" will be permanently removed. This cannot be undone.`}
          isLoading={isDeleting}
          onConfirm={() => confirmDelete(song.id, song.title)}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default SongDetailPage;
