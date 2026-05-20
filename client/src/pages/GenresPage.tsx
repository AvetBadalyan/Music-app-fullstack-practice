import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, X } from 'lucide-react';
import { useGetAllGenresQuery } from '../services/genresApi';
import CreateGenreForm from '../components/forms/CreateGenreForm';
import { useAppSelector } from '../app/hooks';
import './GenresPage.scss';

const GenresPage = () => {
  const [showForm, setShowForm] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const { data: genres, isLoading } = useGetAllGenresQuery();

  return (
    <div className="genres-page">
      <div className="page-toolbar">
        <h1>Genres</h1>
        {isAdmin && (
          <button
            type="button"
            className="toolbar-toggle"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showForm ? 'Close' : 'New genre'}</span>
          </button>
        )}
      </div>
      {isAdmin && showForm && <CreateGenreForm />}
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <div className="genre-grid">
          {(genres ?? []).map((genre) => (
            <Link
              key={genre.id}
              to={`/genres/${genre.id}`}
              className="genre-card"
            >
              {genre.name}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default GenresPage;
