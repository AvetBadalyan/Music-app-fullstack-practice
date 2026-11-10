import { Link } from 'react-router-dom';
import { useGetAllSongsQuery } from '../services/songsApi';
import { useGetRecentAlbumsQuery } from '../services/albumsApi';
import SongList from '../components/songs/SongList';
import HeroSlider from '../components/common/HeroSlider';
import NewReleasesCarousel from '../components/albums/NewReleasesCarousel';
import { SongListSkeleton } from '../components/common/Skeleton';
import './HomePage.scss';

const RECENT_SONG_COUNT = 8;
const RECENT_ALBUM_COUNT = 8;

interface SectionHeaderProps {
  id: string;
  title: string;
  linkTo: string;
  linkLabel: string;
}

/** A section title with a "see all" link on the right. */
const SectionHeader = ({ id, title, linkTo, linkLabel }: SectionHeaderProps) => (
  <div className="home-section__header">
    <h2 id={id} className="home-section__title">
      {title}
    </h2>
    <Link to={linkTo} className="home-section__link">
      {linkLabel}
    </Link>
  </div>
);

const HomePage = () => {
  const { data: songs, isLoading: isLoadingSongs } = useGetAllSongsQuery();
  const { data: albums, isLoading: isLoadingAlbums } =
    useGetRecentAlbumsQuery();

  // An album with no release date cannot be a "new release".
  const recentAlbums = (albums ?? [])
    .filter((album) => album.releaseDate)
    .slice(0, RECENT_ALBUM_COUNT);

  return (
    <div className="page home-page">
      {/* The hero shows its message as an image, so the page needs a real h1 for screen readers. */}
      <h1 className="visually-hidden">MusicAvet - Music library</h1>
      <HeroSlider />

      {/* Hide the whole section, heading included, when there is nothing to show. */}
      {(isLoadingAlbums || recentAlbums.length > 0) && (
        <section className="home-section" aria-labelledby="new-releases-title">
          <SectionHeader
            id="new-releases-title"
            title="New Releases"
            linkTo="/albums"
            linkLabel="See all albums"
          />
          <NewReleasesCarousel
            albums={recentAlbums}
            isLoading={isLoadingAlbums}
          />
        </section>
      )}

      <section className="home-section" aria-labelledby="recent-songs-title">
        <SectionHeader
          id="recent-songs-title"
          title="Recent Songs"
          linkTo="/songs"
          linkLabel="See all songs"
        />
        {isLoadingSongs ? (
          <SongListSkeleton rows={RECENT_SONG_COUNT} />
        ) : (
          <SongList songs={songs?.slice(0, RECENT_SONG_COUNT) ?? []} />
        )}
      </section>
    </div>
  );
};

export default HomePage;
