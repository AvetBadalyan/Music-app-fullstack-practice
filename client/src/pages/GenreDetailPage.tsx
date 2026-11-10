import { useParams } from 'react-router-dom';
import {
  useDeleteGenreMutation,
  useGetGenreByIdQuery,
} from '../services/genresApi';
import { useAppSelector } from '../app/hooks';
import { useDeleteWithConfirm } from '../hooks/useDeleteWithConfirm';
import { formatTotalDuration } from '../utils/formatTotalDuration';
import { pluralize } from '../utils/pluralize';
import ConfirmDialog from '../components/common/ConfirmDialog';
import DeleteButton from '../components/common/DeleteButton';
import EmptyState from '../components/common/EmptyState';
import ListPage from '../components/common/ListPage';
import PageStatus from '../components/common/PageStatus';
import SongList from '../components/songs/SongList';
import '../components/common/PageToolbar.scss';
import './GenreDetailPage.scss';

const GenreDetailPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  const { data: genre, isLoading, error } = useGetGenreByIdQuery(id, { skip: !id });
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
  const totalSeconds = songs.reduce((sum, song) => sum + song.duration, 0);

  return (
    <ListPage>
      <div className="page-toolbar">
        <div>
          <h1>{genre.name}</h1>
          {songs.length > 0 && (
            <p className="genre-summary">
              {pluralize(songs.length, 'song')} ·{' '}
              {formatTotalDuration(totalSeconds)}
            </p>
          )}
        </div>
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
        <EmptyState
          context="no-songs"
          description="No songs in this genre yet."
        />
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
    </ListPage>
  );
};

export default GenreDetailPage;
