import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetGenreByIdQuery,
  useDeleteGenreMutation,
} from '../services/genresApi';
import { useAppSelector } from '../app/hooks';
import SongList from '../components/songs/SongList';
import ConfirmDialog from '../components/common/ConfirmDialog';

const GenreDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const genreId = id ?? '';
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();
  const {
    data: genre,
    isLoading,
    error,
  } = useGetGenreByIdQuery(genreId, {
    skip: !id,
  });
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="genre-detail-page">
        <div className="page-status page-status--loading">Loading genre...</div>
      </div>
    );
  }

  if (error || !genre) {
    return (
      <div className="genre-detail-page">
        <div className="page-status">Genre not found.</div>
      </div>
    );
  }

  const handleConfirmDelete = async () => {
    const target = genre;
    setConfirmOpen(false);
    navigate('/genres');
    try {
      await deleteGenre(target.id).unwrap();
      toast.success(`Deleted "${target.name}"`);
    } catch {
      toast.error(`Failed to delete "${target.name}"`);
    }
  };

  return (
    <div className="genre-detail-page">
      <div className="page-toolbar">
        <h1>{genre.name}</h1>
        {isAdmin && (
          <button
            type="button"
            className="delete-btn"
            onClick={() => setConfirmOpen(true)}
            disabled={isDeleting}
            title="Delete genre"
            aria-label="Delete genre"
          >
            <Trash2 size={16} strokeWidth={2} aria-hidden="true" />
            <span>{isDeleting ? 'Deleting…' : 'Delete'}</span>
          </button>
        )}
      </div>
      {genre.songs && genre.songs.length > 0 ? (
        <SongList songs={genre.songs} hideGenreColumn />
      ) : (
        <div className="page-status">No songs in this genre yet.</div>
      )}
      {isAdmin && (
        <ConfirmDialog
          open={confirmOpen}
          title="Delete genre?"
          message={`"${genre.name}" will be removed. Songs will keep playing — only the genre tag is deleted.`}
          isLoading={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
};

export default GenreDetailPage;
