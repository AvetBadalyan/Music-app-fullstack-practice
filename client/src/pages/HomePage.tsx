import { Link } from 'react-router-dom';
import { Play } from 'lucide-react';
import { useGetAllSongsQuery } from '../services/songsApi';
import { useGetAllAlbumsQuery } from '../services/albumsApi';
import { useAppDispatch } from '../app/hooks';
import { playSong } from '../features/player/playerSlice';
import SongList from '../components/songs/SongList';
import AlbumList from '../components/albums/AlbumList';
import {
  SongListSkeleton,
  AlbumGridSkeleton,
} from '../components/common/Skeleton';
import './HomePage.scss';

const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 18) return 'Good afternoon';
  return 'Good evening';
};

const HomePage = () => {
  const { data: songs, isLoading: songsLoading } = useGetAllSongsQuery();
  const { data: albums, isLoading: albumsLoading } = useGetAllAlbumsQuery();
  const dispatch = useAppDispatch();

  const recentSongs = songs?.slice(0, 8) ?? [];
  const featuredSongs = songs?.slice(0, 20) ?? [];

  const handlePlayAll = () => {
    if (featuredSongs.length === 0) return;
    dispatch(playSong({ song: featuredSongs[0], queue: featuredSongs }));
  };

  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <span className="hero-eyebrow">Welcome back</span>
          <h1>{getGreeting()}</h1>
          <p>
            Dive into your library — recent tracks, fresh albums, all in one
            place.
          </p>
          <button
            type="button"
            className="hero-play"
            onClick={handlePlayAll}
            disabled={featuredSongs.length === 0}
          >
            <span className="hero-play-icon" aria-hidden="true">
              <Play size={14} strokeWidth={2.5} fill="currentColor" />
            </span>
            Play featured
          </button>
        </div>
      </section>

      <section className="home-section">
        <div className="section-header">
          <h2>Recent Songs</h2>
          <Link to="/songs" className="see-all">
            See all
          </Link>
        </div>
        {songsLoading ? (
          <SongListSkeleton rows={8} />
        ) : (
          <SongList songs={recentSongs} />
        )}
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
