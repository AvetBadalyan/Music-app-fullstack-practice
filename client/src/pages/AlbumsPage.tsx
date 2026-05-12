import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import AlbumList from '../components/albums/AlbumList';
import { AlbumGridSkeleton } from '../components/common/Skeleton';
import CreateAlbumForm from '../components/forms/CreateAlbumForm';

const AlbumsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const { data: albums, isLoading } = useGetAllAlbumsQuery();

  return (
    <div className="albums-page">
      <div className="page-toolbar">
        <h1>Albums</h1>
        <button
          type="button"
          className="toolbar-toggle"
          onClick={() => setShowForm((v) => !v)}
        >
          {showForm ? <X size={16} /> : <Plus size={16} />}
          <span>{showForm ? 'Close' : 'New album'}</span>
        </button>
      </div>
      {showForm && <CreateAlbumForm />}
      {isLoading ? (
        <AlbumGridSkeleton count={12} />
      ) : (
        <AlbumList albums={albums ?? []} />
      )}
    </div>
  );
};

export default AlbumsPage;
