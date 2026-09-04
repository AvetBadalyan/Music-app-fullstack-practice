import { useParams, Link } from 'react-router-dom';
import { Play, Music } from 'lucide-react';
import {
  useGetSongByIdQuery,
  useDeleteSongMutation,
} from '../services/songsApi';
import { useGetAlbumByIdQuery } from '../services/albumsApi';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { playSong } from '../features/player/playerSlice';
import { formatDuration } from '../utils/formatDuration';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import PageStatus from '../components/common/PageStatus';
import './SongDetailPage.scss';

const SongDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: song,
    isLoading,
    error,
  } = useGetSongByIdQuery(id, { skip: !id });
  const [deleteSong, { isLoading: isDeleting }] = useDeleteSongMutation();
  const { isConfirmOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteWithConfirm({ deleteEntity: deleteSong, redirectTo: '/songs' });

  const { data: album } = useGetAlbumByIdQuery(song?.album?.id ?? '', {
    skip: !song?.album?.id,
  });
  const coverImage = album?.coverImage;
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
                <span>Album: </span>
                <Link to={`/albums/${song.album.id}`}>{song.album.title}</Link>
              </>
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
          <DeleteButton
            label="Delete song"
            isDeleting={isDeleting}
            onClick={openConfirm}
          />
        )}
      </div>
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
