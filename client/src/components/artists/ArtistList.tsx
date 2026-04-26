import { Link } from 'react-router-dom';
import type { IArtist } from '../../types/artist';
import './ArtistList.scss';

interface ArtistListProps {
  artists: IArtist[];
}

const ArtistList = ({ artists }: ArtistListProps) => {
  if (artists.length === 0) {
    return <p className="empty">No artists found.</p>;
  }

  return (
    <div className="artist-grid">
      {artists.map((artist) => (
        <Link key={artist.id} to={`/artists/${artist.id}`} className="artist-card">
          <div className="artist-avatar">
            {artist.profilePicture ? (
              <img src={artist.profilePicture} alt={artist.name} />
            ) : (
              <div className="placeholder">🎤</div>
            )}
          </div>
          <p className="artist-name">{artist.name}</p>
          <p className="artist-label">Artist</p>
        </Link>
      ))}
    </div>
  );
};

export default ArtistList;
