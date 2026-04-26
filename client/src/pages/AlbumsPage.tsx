import { useGetAllAlbumsQuery } from '../services/albumsApi';
import AlbumList from '../components/albums/AlbumList';
import './AlbumsPage.scss';

const AlbumsPage = () => {
  const { data: albums, isLoading } = useGetAllAlbumsQuery();

  return (
    <div className="albums-page">
      <h1>Albums</h1>
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <AlbumList albums={albums ?? []} />
      )}
    </div>
  );
};

export default AlbumsPage;
