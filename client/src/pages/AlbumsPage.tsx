import { useState } from 'react';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import { useAppSelector } from '../app/hooks';
import AlbumList from '../components/albums/AlbumList';
import PageToolbar from '../components/common/PageToolbar';
import { CardGridSkeleton } from '../components/common/Skeleton';
import CreateAlbumForm from '../components/forms/CreateAlbumForm';

const AlbumsPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const { data: albums, isLoading } = useGetAllAlbumsQuery();

  return (
    <div className="page">
      <PageToolbar
        title="Albums"
        createLabel="New album"
        isCreateOpen={isCreateOpen}
        onCreateToggle={
          isAdmin ? () => setIsCreateOpen((open) => !open) : undefined
        }
      />
      {isAdmin && isCreateOpen && <CreateAlbumForm />}
      {isLoading ? (
        <CardGridSkeleton count={12} />
      ) : (
        <AlbumList albums={albums ?? []} />
      )}
    </div>
  );
};

export default AlbumsPage;
