import { Link } from 'react-router-dom';
import { useGetAllSongsQuery } from '../services/songsApi';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import './HomePage.scss';

const HomePage = () => {
  const { data: songs, isLoading: songsLoading } = useGetAllSongsQuery();
  const { data: albums, isLoading: albumsLoading } = useGetAllAlbumsQuery();

  return (
    <div className="home-page">
      <section className="home-section">
        <div className="section-header">
          <h2>Recent Songs</h2>
          <Link to="/songs" className="see-all">See all</Link>
        </div>
        {songsLoading ? (
          <p className="loading">Loading songs...</p>
        ) : (
          <SongList songs={songs?.slice(0, 8) ?? []} />
        )}
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Albums</h2>
          <Link to="/albums" className="see-all">See all</Link>
        </div>
        {albumsLoading ? (
          <p className="loading">Loading albums...</p>
        ) : (
          <AlbumList albums={albums?.slice(0, 6) ?? []} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
