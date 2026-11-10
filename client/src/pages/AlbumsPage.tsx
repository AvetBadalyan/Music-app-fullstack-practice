import { useState } from 'react';
import {
  useGetAllAlbumsQuery,
  useSearchAlbumsQuery,
} from '../services/albumsApi';
import { useAppSelector } from '../app/hooks';
import { pluralize } from '../utils/pluralize';
import AlbumList from '../components/albums/AlbumList';
import FeaturedAlbum from '../components/albums/FeaturedAlbum';
import EmptyState from '../components/common/EmptyState';
import ListControls, { SortSelect } from '../components/common/ListControls';
import ListPage from '../components/common/ListPage';
import PageToolbar from '../components/common/PageToolbar';
import SearchBar from '../components/common/SearchBar';
import { CardGridSkeleton } from '../components/common/Skeleton';
import CreateAlbumForm from '../components/forms/CreateAlbumForm';
import type { IAlbum } from '../types/api';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
];

/** Albums with no release date count as the oldest. */
const getReleaseTime = (album: IAlbum): number =>
  album.releaseDate ? new Date(album.releaseDate).getTime() : 0;

const sortAlbums = (albums: IAlbum[], sortBy: string): IAlbum[] => {
  const sorted = [...albums];

  switch (sortBy) {
    case 'oldest':
      return sorted.sort((a, b) => getReleaseTime(a) - getReleaseTime(b));
    case 'title-asc':
      return sorted.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sorted.sort((a, b) => b.title.localeCompare(a.title));
    default:
      return sorted.sort((a, b) => getReleaseTime(b) - getReleaseTime(a));
  }
};

/** The banner only makes sense with a few more albums under it. */
const MIN_ALBUMS_FOR_BANNER = 3;

const AlbumsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  // Only one of the two runs: the full list, or the search endpoint once
  // something has been typed.
  const isSearching = searchTerm.length > 0;
  const { data: allAlbums, isLoading: isLoadingAll } = useGetAllAlbumsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchAlbumsQuery(searchTerm, { skip: !isSearching });
  const albums = isSearching ? searchResults : allAlbums;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;

  const renderResults = () => {
    if (isLoading) return <CardGridSkeleton count={8} />;
    if (!albums?.length) {
      return isSearching ? (
        <EmptyState
          context="no-search-results"
          description={`No albums match “${searchTerm}”.`}
        />
      ) : (
        <EmptyState context="no-albums" />
      );
    }

    // The banner always shows the newest album, whatever the sort below says.
    // Search results are a plain list, so they get no banner.
    const newestAlbum =
      !isSearching && albums.length >= MIN_ALBUMS_FOR_BANNER
        ? sortAlbums(albums, 'newest')[0]
        : null;
    const otherAlbums = sortAlbums(
      albums.filter((album) => album.id !== newestAlbum?.id),
      sortBy,
    );

    return (
      <>
        {newestAlbum && <FeaturedAlbum album={newestAlbum} />}
        <ListControls
          summary={pluralize(
            otherAlbums.length,
            newestAlbum ? 'more album' : 'album',
          )}
        >
          <SortSelect
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </ListControls>
        <AlbumList albums={otherAlbums} />
      </>
    );
  };

  return (
    <ListPage>
      <PageToolbar
        title="Albums"
        createLabel="New album"
        isCreateOpen={isCreateOpen}
        onCreateToggle={
          isAdmin ? () => setIsCreateOpen((open) => !open) : undefined
        }
      />
      {isAdmin && isCreateOpen && <CreateAlbumForm />}
      <SearchBar
        placeholder="Search albums by title..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {renderResults()}
    </ListPage>
  );
};

export default AlbumsPage;
