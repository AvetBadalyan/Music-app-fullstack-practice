import { useState } from 'react';
import {
  useGetAllArtistsQuery,
  useSearchArtistsQuery,
} from '../services/artistsApi';
import { useAppSelector } from '../app/hooks';
import ArtistList from '../components/artists/ArtistList';
import PageToolbar from '../components/common/PageToolbar';
import SearchBar from '../components/common/SearchBar';
import { CardGridSkeleton } from '../components/common/Skeleton';
import CreateArtistForm from '../components/forms/CreateArtistForm';

const ArtistsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
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

  return (
    <div className="page">
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
      {isLoading ? (
        <CardGridSkeleton count={12} shape="circle" />
      ) : (
        <ArtistList artists={artists ?? []} />
      )}
    </div>
  );
};

export default ArtistsPage;
