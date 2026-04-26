import { Link } from 'react-router-dom';
import type { IAlbum } from '../../types/album';
import './AlbumList.scss';

interface AlbumListProps {
  albums: IAlbum[];
}

const AlbumList = ({ albums }: AlbumListProps) => {
  if (albums.length === 0) {
    return <p className="empty">No albums found.</p>;
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
          </div>
          <p className="album-title">{album.title}</p>
          {album.artist && <p className="album-artist">{album.artist.name}</p>}
        </Link>
      ))}
    </div>
  );
};

export default AlbumList;
