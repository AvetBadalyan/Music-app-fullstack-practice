import { Link } from 'react-router-dom';
import { useGetAllSongsQuery } from '../services/songsApi';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import {
  SongListSkeleton,
  AlbumGridSkeleton,
} from '../components/common/Skeleton';
import HeroSlider from '../components/common/HeroSlider';
import './HomePage.scss';

const HomePage = () => {
  const { data: songs, isLoading: songsLoading } = useGetAllSongsQuery();
  const { data: albums, isLoading: albumsLoading } = useGetAllAlbumsQuery();

  const recentSongs = songs?.slice(0, 8) ?? [];

  return (
    <div className="home-page">
      <section className="home-hero">
        <div className="home-hero__media">
          <HeroSlider />
        </div>

        <section className="home-hero__recent home-section">
          <div className="section-header">
            <h2>Recent Songs</h2>
            <Link to="/songs" className="see-all">
              See all
            </Link>
          </div>
          {songsLoading ? (
            <SongListSkeleton rows={8} />
          ) : (
            <SongList
              songs={recentSongs}
              hideAlbumColumn
              hideGenreColumn
            />
          )}
        </section>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Albums</h2>
          <Link to="/albums" className="see-all">
            See all
          </Link>
        </div>
        {albumsLoading ? (
          <AlbumGridSkeleton count={6} />
        ) : (
          <AlbumList albums={albums?.slice(0, 6) ?? []} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
