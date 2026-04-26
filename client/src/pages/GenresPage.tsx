import { useGetAllGenresQuery } from '../services/genresApi';
import { Link } from 'react-router-dom';
import './GenresPage.scss';

const GenresPage = () => {
  const { data: genres, isLoading } = useGetAllGenresQuery();

  return (
    <div className="genres-page">
      <h1>Genres</h1>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="genre-grid">
          {(genres ?? []).map((genre) => (
            <Link key={genre.id} to={`/genres/${genre.id}`} className="genre-card">
              {genre.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenresPage;
