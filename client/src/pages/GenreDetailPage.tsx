import { useParams } from 'react-router-dom';
import {
  useGetGenreByIdQuery,
  useDeleteGenreMutation,
} from '../services/genresApi';
import { useAppSelector } from '../app/hooks';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import SongList from '../components/songs/SongList';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import PageStatus from '../components/common/PageStatus';

const GenreDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const { data: genre, isLoading, error } = useGetGenreByIdQuery(id);
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();
  const { isConfirmOpen, openConfirm, closeConfirm, confirmDelete } =
    useDeleteWithConfirm({ deleteEntity: deleteGenre, redirectTo: '/genres' });

  if (isLoading) {
    return (
      <div className="page">
        <PageStatus isLoading>Loading genre...</PageStatus>
      </div>
    );
  }

  if (error || !genre) {
    return (
      <div className="page">
        <PageStatus>Genre not found.</PageStatus>
      </div>
    );
  }

  const songs = genre.songs ?? [];

  return (
    <div className="page">
      <div className="page-toolbar">
        <h1>{genre.name}</h1>
        {isAdmin && (
          <DeleteButton
            label="Delete genre"
            isDeleting={isDeleting}
            onClick={openConfirm}
          />
        )}
      </div>

      {songs.length > 0 ? (
        <SongList songs={songs} hideGenreColumn />
      ) : (
        <PageStatus>No songs in this genre yet.</PageStatus>
      )}

      {isAdmin && (
        <ConfirmDialog
          open={isConfirmOpen}
          title="Delete genre?"
          message={`"${genre.name}" will be removed. Songs will keep playing — only the genre tag is deleted.`}
          isLoading={isDeleting}
          onConfirm={() => confirmDelete(genre.id, genre.name)}
          onCancel={closeConfirm}
        />
      )}
    </div>
  );
};

export default GenreDetailPage;
