import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import type { IArtist } from '../../types/api';
import './ArtistList.scss';

interface ArtistListProps {
  artists: IArtist[];
}

const ArtistList = ({ artists }: ArtistListProps) => {
  if (artists.length === 0) {
    return (
      <EmptyState
        icon={<Mic2 size={32} strokeWidth={1.75} />}
        title="No artists found"
        description="Try a different search, or add a new artist to your library."
        actionLabel="Add an artist"
        actionTo="/artists"
      />
    );
  }

  return (
    <div className="artist-grid">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          to={`/artists/${artist.id}`}
          className="artist-card"
        >
          <div className="artist-avatar">
            {artist.profilePicture ? (
              <img
                src={artist.profilePicture}
                alt={artist.name}
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="placeholder" aria-hidden="true">
                <Mic2 size={32} strokeWidth={1.5} />
              </div>
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
