import { Link } from 'react-router-dom';
import { Disc3, Music, Play } from 'lucide-react';
import EmptyState from '../common/EmptyState';
import type { IAlbum } from '../../types/album';
import './AlbumList.scss';

interface AlbumListProps {
  albums: IAlbum[];
}

const AlbumList = ({ albums }: AlbumListProps) => {
  if (albums.length === 0) {
    return (
      <EmptyState
        icon={<Disc3 size={32} strokeWidth={1.75} />}
        title="No albums to show"
        description="Create your first album to start curating your collection."
        actionLabel="Create an album"
        actionTo="/albums"
      />
    );
  }

  return (
    <div className="album-grid">
      {albums.map((album) => (
        <Link key={album.id} to={`/albums/${album.id}`} className="album-card">
          <div className="album-cover">
            {album.coverImage ? (
              <img src={album.coverImage} alt={album.title} />
            ) : (
              <div className="placeholder" aria-hidden="true">
                <Music size={32} strokeWidth={1.5} />
              </div>
            )}
            <span className="play-overlay" aria-hidden="true">
              <Play size={18} strokeWidth={2.5} fill="currentColor" />
            </span>
          </div>
          <p className="album-title">{album.title}</p>
          {album.artist && <p className="album-artist">{album.artist.name}</p>}
        </Link>
      ))}
    </div>
  );
};

export default AlbumList;
