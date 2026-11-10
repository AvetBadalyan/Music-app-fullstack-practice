import { useState } from 'react';
import {
  useGetAllArtistsQuery,
  useSearchArtistsQuery,
} from '../services/artistsApi';
import { useAppSelector } from '../app/hooks';
import { pluralize } from '../utils/pluralize';
import ArtistList from '../components/artists/ArtistList';
import EmptyState from '../components/common/EmptyState';
import ListControls, { SortSelect } from '../components/common/ListControls';
import ListPage from '../components/common/ListPage';
import PageToolbar from '../components/common/PageToolbar';
import SearchBar from '../components/common/SearchBar';
import { CardGridSkeleton } from '../components/common/Skeleton';
import CreateArtistForm from '../components/forms/CreateArtistForm';

const SORT_OPTIONS = [
  { value: 'name-asc', label: 'Name A–Z' },
  { value: 'name-desc', label: 'Name Z–A' },
];

const ArtistsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name-asc');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);

  // Only one of the two runs: the full list, or the search endpoint once
  // something has been typed.
  const isSearching = searchTerm.length > 0;
  const { data: allArtists, isLoading: isLoadingAll } = useGetAllArtistsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchArtistsQuery(searchTerm, { skip: !isSearching });

  const artists = isSearching ? searchResults : allArtists;
  const isLoading = isSearching ? isLoadingSearch : isLoadingAll;

  const sortedArtists = [...(artists ?? [])].sort((a, b) =>
    sortBy === 'name-desc'
      ? b.name.localeCompare(a.name)
      : a.name.localeCompare(b.name),
  );

  const renderResults = () => {
    if (isLoading) return <CardGridSkeleton count={8} shape="circle" />;

    if (sortedArtists.length === 0) {
      return isSearching ? (
        <EmptyState
          context="no-search-results"
          description={`No artists match “${searchTerm}”.`}
        />
      ) : (
        <EmptyState context="no-artists" />
      );
    }

    return (
      <>
        <ListControls summary={pluralize(sortedArtists.length, 'artist')}>
          <SortSelect
            options={SORT_OPTIONS}
            value={sortBy}
            onChange={setSortBy}
          />
        </ListControls>
        <ArtistList artists={sortedArtists} />
      </>
    );
  };

  return (
    <ListPage>
      <PageToolbar
        title="Artists"
        createLabel="New artist"
        isCreateOpen={isCreateOpen}
        onCreateToggle={
          isAdmin ? () => setIsCreateOpen((open) => !open) : undefined
        }
      />
      {isAdmin && isCreateOpen && <CreateArtistForm />}
      <SearchBar
        placeholder="Search artists by name..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {renderResults()}
    </ListPage>
  );
};

export default ArtistsPage;
