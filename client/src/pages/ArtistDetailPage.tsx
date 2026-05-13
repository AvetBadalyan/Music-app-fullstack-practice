import { useParams, useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { useGetArtistByIdQuery } from '../services/artistsApi';
import { useDominantColor } from '../app/useDominantColor';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import './ArtistDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: artist, isLoading, error } = useGetArtistByIdQuery(id!);
  const dominant = useDominantColor(artist?.profilePicture);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !artist) return <p className="error">Artist not found.</p>;

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
            alt={artist.name}
          />
        )}
        <div className="artist-info">
          <h1>{artist.name}</h1>
          {artist.bio && <p className="bio">{artist.bio}</p>}
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
    </div>
  );
};

export default ArtistDetailPage;
