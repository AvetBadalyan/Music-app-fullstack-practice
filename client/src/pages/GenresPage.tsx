import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGetAllGenresQuery } from '../services/genresApi';
import { useAppSelector } from '../app/hooks';
import PageToolbar from '../components/common/PageToolbar';
import { TileGridSkeleton } from '../components/common/Skeleton';
import CreateGenreForm from '../components/forms/CreateGenreForm';
import './GenresPage.scss';

const GenresPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const { data: genres, isLoading } = useGetAllGenresQuery();

  return (
    <div className="page genres-page">
      <PageToolbar
        title="Genres"
        createLabel="New genre"
        isCreateOpen={isCreateOpen}
        onCreateToggle={
          isAdmin ? () => setIsCreateOpen((open) => !open) : undefined
        }
      />
      {isAdmin && isCreateOpen && <CreateGenreForm />}
      {isLoading ? (
        <TileGridSkeleton count={8} />
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
