import { useNavigate, useParams } from 'react-router-dom';
import { Clock, Music2, Plus } from 'lucide-react';
import {
  useDeleteArtistMutation,
  useGetAllArtistsQuery,
  useGetArtistByIdQuery,
} from '../services/artistsApi';
import { useAppSelector } from '../app/hooks';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { useHeroGradient } from '../hooks/useHeroGradient';
import { formatTotalDuration } from '../utils/formatTotalDuration';
import { pluralize } from '../utils/pluralize';
import AlbumList from '../components/albums/AlbumList';
import ArtistList from '../components/artists/ArtistList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import EmptyState from '../components/common/EmptyState';
import PageStatus from '../components/common/PageStatus';
import PlayAllButton from '../components/common/PlayAllButton';
import StatsBadge from '../components/common/StatsBadge';
import SongList from '../components/songs/SongList';
import '../components/common/PageToolbar.scss';
import './ArtistDetailPage.scss';

/** How many other artists to suggest at the bottom of the page. */
const MORE_ARTISTS_COUNT = 4;

const ArtistDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const {
    data: artist,
    isLoading,
    error,
  } = useGetArtistByIdQuery(id, { skip: !id });
  const { data: allArtists } = useGetAllArtistsQuery();

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

  const songs = artist.songs ?? [];
  const albums = artist.albums ?? [];
  const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);
  const otherArtists = (allArtists ?? [])
    .filter((other) => other.id !== artist.id)
    .slice(0, MORE_ARTISTS_COUNT);

  const confirmMessage =
    `"${artist.name}" will be permanently removed.` +
    (songs.length || albums.length
      ? `\n\nThis will also delete ${pluralize(albums.length, 'album')} and ${pluralize(songs.length, 'song')}.`
      : '') +
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

          <div className="detail-hero__stats">
            <StatsBadge
              icon={<Music2 size={14} strokeWidth={2} />}
              value={String(songs.length)}
              label={songs.length === 1 ? 'song' : 'songs'}
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
              <>
                <button
                  type="button"
                  className="toolbar-toggle"
                  onClick={() =>
                    navigate('/songs', { state: { createSong: true, artist } })
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
              </>
            )}
          </div>
        </div>
      </div>

      {albums.length === 0 && songs.length === 0 && (
        <section className="detail-section">
          <EmptyState
            context="no-songs"
            title="No music yet"
            description="This artist doesn't have any albums or songs yet."
          />
        </section>
      )}

      {albums.length > 0 && (
        <section className="detail-section">
          <h2>Albums</h2>
          <AlbumList albums={albums} />
        </section>
      )}

      {songs.length > 0 && (
        <section className="detail-section">
          <h2>Songs</h2>
          <SongList songs={songs} />
        </section>
      )}

      {otherArtists.length > 0 && (
        <section className="detail-section">
          <h2>More artists</h2>
          <ArtistList artists={otherArtists} />
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
