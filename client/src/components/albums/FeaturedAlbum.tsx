import { Link } from 'react-router-dom';
import { ArrowRight, Music, Sparkles } from 'lucide-react';
import type { IAlbum } from '../../types/api';
import { getReleaseYear } from '../../utils/getReleaseYear';
import './FeaturedAlbum.scss';

/**
 * A wide banner for one album - the newest release on the albums page. The
 * cover is repeated, blurred, as the backdrop so the banner takes its colour
 * from the artwork instead of sitting on a flat panel.
 */
const FeaturedAlbum = ({ album }: { album: IAlbum }) => {
  const year = getReleaseYear(album.releaseDate);

  return (
    <Link to={`/albums/${album.id}`} className="featured-album">
      {album.coverImage && (
        <img
          className="featured-album__backdrop"
          src={album.coverImage}
          alt=""
          aria-hidden="true"
          decoding="async"
        />
      )}

      <div className="featured-album__cover">
        {album.coverImage ? (
          <img
            src={album.coverImage}
            alt=""
            width="180"
            height="180"
            decoding="async"
          />
        ) : (
          <div className="featured-album__placeholder" aria-hidden="true">
            <Music size={40} strokeWidth={1.5} />
          </div>
        )}
      </div>

      <div className="featured-album__info">
        <span className="featured-album__badge">
          <Sparkles size={12} aria-hidden="true" />
          Latest release
        </span>
        <h2 className="featured-album__title">{album.title}</h2>
        <p className="featured-album__meta">
          {[album.artist?.name, year].filter(Boolean).join(' · ')}
        </p>
      </div>

      <span className="featured-album__cta" aria-hidden="true">
        View album
        <ArrowRight size={16} strokeWidth={2.25} />
      </span>
    </Link>
  );
};

export default FeaturedAlbum;
