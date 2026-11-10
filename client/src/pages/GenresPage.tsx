import { useState } from 'react';
import { useGetAllGenresQuery } from '../services/genresApi';
import { useAppSelector } from '../app/hooks';
import EmptyState from '../components/common/EmptyState';
import ListPage from '../components/common/ListPage';
import PageToolbar from '../components/common/PageToolbar';
import { TileGridSkeleton } from '../components/common/Skeleton';
import CreateGenreForm from '../components/forms/CreateGenreForm';
import GenreList from '../components/genres/GenreList';

const GenresPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const { data: genres, isLoading } = useGetAllGenresQuery();

  const renderResults = () => {
    if (isLoading) return <TileGridSkeleton count={8} />;
    if (!genres?.length) return <EmptyState context="no-genres" />;

    // The API returns genres in no particular order, so list them A to Z.
    const sortedGenres = [...genres].sort((a, b) => a.name.localeCompare(b.name));

    return <GenreList genres={sortedGenres} />;
  };

  return (
    <ListPage>
      <PageToolbar
        title="Genres"
        createLabel="New genre"
        isCreateOpen={isCreateOpen}
        onCreateToggle={
          isAdmin ? () => setIsCreateOpen((open) => !open) : undefined
        }
      />
      {isAdmin && isCreateOpen && <CreateGenreForm />}
      {renderResults()}
    </ListPage>
  );
};

export default GenresPage;
