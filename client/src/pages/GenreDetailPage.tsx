import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import {
  useGetGenreByIdQuery,
  useDeleteGenreMutation,
} from '../services/genresApi';
import SongList from '../components/songs/SongList';
import ConfirmDialog from '../components/common/ConfirmDialog';

const GenreDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [deleteGenre, { isLoading: isDeleting }] = useDeleteGenreMutation();
  const { data: genre, isLoading, error } = useGetGenreByIdQuery(id!);
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (isLoading) return <p className="loading">Loading...</p>;
  if (error || !genre) return <p className="error">Genre not found.</p>;

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
      </div>
      {genre.songs && genre.songs.length > 0 ? (
        <SongList songs={genre.songs} />
      ) : (
        <p className="empty">No songs in this genre yet.</p>
      )}
      <ConfirmDialog
        open={confirmOpen}
        title="Delete genre?"
        message={`"${genre.name}" will be removed. Songs will keep playing — only the genre tag is deleted.`}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </div>
  );
};

export default GenreDetailPage;
