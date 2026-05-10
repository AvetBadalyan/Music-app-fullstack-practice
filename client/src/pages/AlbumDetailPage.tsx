import { useParams, Link } from 'react-router-dom';
import { useGetAlbumByIdQuery } from '../services/albumsApi';
import { useDominantColor } from '../app/useDominantColor';
import './AlbumDetailPage.scss';

const FALLBACK_COLOR = 'rgb(60, 40, 95)';

const AlbumDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: album, isLoading, error } = useGetAlbumByIdQuery(id!);
  const dominant = useDominantColor(album?.coverImage);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !album) return <p className="error">Album not found.</p>;

  const heroColor = dominant ?? FALLBACK_COLOR;
  const heroStyle = {
    background: `linear-gradient(180deg, ${heroColor} 0%, var(--color-bg) 100%)`,
  };

  return (
    <div className="album-detail-page">
      <div className="album-header has-hero" style={heroStyle}>
        {album.coverImage && (
          <img className="cover-image" src={album.coverImage} alt={album.title} />
        )}
        <div className="album-info">
          <p className="label">Album</p>
          <h1>{album.title}</h1>
          {album.artist && (
            <p className="artist">
              <Link to={`/artists/${album.artist.id}`}>{album.artist.name}</Link>
            </p>
          )}
          {album.releaseDate && (
            <p className="release-date">{new Date(album.releaseDate).getFullYear()}</p>
          )}
        </div>
      </div>

      {album.songs && album.songs.length > 0 && (
        <section className="tracklist">
          <h2>Tracklist</h2>
          <ol>
            {album.songs.map((song) => (
              <li key={song.id}>
                <Link to={`/songs/${song.id}`}>{song.title}</Link>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  );
};

export default AlbumDetailPage;
