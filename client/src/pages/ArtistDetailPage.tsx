import { useParams } from 'react-router-dom';
import { useGetArtistByIdQuery } from '../services/artistsApi';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import './ArtistDetailPage.scss';

const ArtistDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: artist, isLoading, error } = useGetArtistByIdQuery(id!);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !artist) return <p className="error">Artist not found.</p>;

  return (
    <div className="artist-detail-page">
      <div className="artist-header">
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
