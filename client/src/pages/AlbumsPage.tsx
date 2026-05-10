import { useGetAllAlbumsQuery } from '../services/albumsApi';
import AlbumList from '../components/albums/AlbumList';
import { AlbumGridSkeleton } from '../components/common/Skeleton';
import './AlbumsPage.scss';

const AlbumsPage = () => {
  const { data: albums, isLoading } = useGetAllAlbumsQuery();

  return (
    <div className="albums-page">
      <h1>Albums</h1>
      {isLoading ? (
        <AlbumGridSkeleton count={12} />
      ) : (
        <AlbumList albums={albums ?? []} />
      )}
    </div>
  );
};

export default AlbumsPage;
