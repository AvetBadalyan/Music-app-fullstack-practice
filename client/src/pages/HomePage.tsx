import { Link } from 'react-router-dom';
import { useGetAllSongsQuery } from '../services/songsApi';
import SongList from '../components/songs/SongList';
import HeroSlider from '../components/common/HeroSlider';
import NewReleasesCarousel from '../components/albums/NewReleasesCarousel';
import { SongListSkeleton } from '../components/common/Skeleton';
import './HomePage.scss';

const RECENT_SONG_COUNT = 8;

const HomePage = () => {
  const { data: songs, isLoading: isLoadingSongs } = useGetAllSongsQuery();

  return (
    <div className="home-page">
      <section className="home-hero">
        <HeroSlider />
        <NewReleasesCarousel />

        <section className="home-hero__recent home-section">
          <div className="section-header">
            <h2>Recent Songs</h2>
            <Link to="/songs" className="see-all">
              See all songs
            </Link>
          </div>
          {isLoadingSongs ? (
            <SongListSkeleton rows={RECENT_SONG_COUNT} />
          ) : (
            <SongList songs={songs?.slice(0, RECENT_SONG_COUNT) ?? []} />
          )}
        </section>
      </section>
    </div>
  );
};

export default HomePage;
