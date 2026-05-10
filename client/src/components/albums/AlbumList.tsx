import { Link } from 'react-router-dom';
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
        icon="◎"
        title="No albums to show"
        description="Create your first album to start curating your collection."
        actionLabel="Create an album"
        actionTo="/create"
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
              <div className="placeholder">♪</div>
            )}
            <span className="play-overlay" aria-hidden="true">▶</span>
          </div>
          <p className="album-title">{album.title}</p>
          {album.artist && <p className="album-artist">{album.artist.name}</p>}
        </Link>
      ))}
    </div>
  );
};

export default AlbumList;
