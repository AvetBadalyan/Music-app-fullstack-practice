import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Music } from 'lucide-react';
import { useColorExtract } from '../../hooks/useColorExtract';
import type { IAlbum } from '../../types/api';
import './AlbumList.scss';

interface AlbumListProps {
  albums: IAlbum[];
}

interface AlbumCardProps {
  album: IAlbum;
}

/** Individual album card with per-card cover glow color extraction */
const AlbumCard = ({ album }: AlbumCardProps) => {
  const { dominantColor } = useColorExtract(album.coverImage);

  return (
    <Link
      to={`/albums/${album.id}`}
      className="album-card"
      style={
        dominantColor
          ? ({ '--cover-glow-color': dominantColor } as CSSProperties)
          : undefined
      }
    >
      <div className="album-cover">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt={album.title}
            width="288"
            height="288"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="placeholder" aria-hidden="true">
            <Music size={32} strokeWidth={1.5} />
          </div>
        )}
      </div>
      <p className="album-title">{album.title}</p>
      {album.artist && <p className="album-artist">{album.artist.name}</p>}
    </Link>
  );
};

const AlbumList = ({ albums }: AlbumListProps) => (
  <div className="album-grid">
    {albums.map((album) => (
      <AlbumCard key={album.id} album={album} />
    ))}
  </div>
);

export default AlbumList;
