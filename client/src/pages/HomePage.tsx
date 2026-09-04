import { Link } from 'react-router-dom';
import { useGetAllSongsQuery } from '../services/songsApi';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import HeroSlider from '../components/common/HeroSlider';
import {
  SongListSkeleton,
  CardGridSkeleton,
} from '../components/common/Skeleton';
import './HomePage.scss';

/** How much of the library the landing page previews before "See all". */
const RECENT_SONG_COUNT = 8;
const FEATURED_ALBUM_COUNT = 6;

const HomePage = () => {
  const { data: songs, isLoading: isLoadingSongs } = useGetAllSongsQuery();
  const { data: albums, isLoading: isLoadingAlbums } = useGetAllAlbumsQuery();

  return (
    <div className="home-page">
      <section className="home-hero">
        <HeroSlider />

        <section className="home-hero__recent home-section">
          <div className="section-header">
            <h2>Recent Songs</h2>
            <Link to="/songs" className="see-all">
              See all
            </Link>
          </div>
          {isLoadingSongs ? (
            <SongListSkeleton rows={RECENT_SONG_COUNT} />
          ) : (
            <SongList songs={songs?.slice(0, RECENT_SONG_COUNT) ?? []} />
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
        {isLoadingAlbums ? (
          <CardGridSkeleton count={FEATURED_ALBUM_COUNT} />
        ) : (
          <AlbumList albums={albums?.slice(0, FEATURED_ALBUM_COUNT) ?? []} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
