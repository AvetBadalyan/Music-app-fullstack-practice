import { useState } from 'react';
import { Plus, X } from 'lucide-react';
import {
  useGetAllArtistsQuery,
  useSearchArtistsQuery,
} from '../services/artistsApi';
import SearchBar from '../components/common/SearchBar';
import ArtistList from '../components/artists/ArtistList';
import CreateArtistForm from '../components/forms/CreateArtistForm';
import { useAppSelector } from '../app/hooks';

const ArtistsPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const isAdmin = useAppSelector((state) => state.auth.isAdmin);
  const isSearching = searchTerm.length > 0;
  const { data: allArtists, isLoading: isLoadingAll } = useGetAllArtistsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isLoading: isSearchLoading } =
    useSearchArtistsQuery(searchTerm, { skip: !isSearching });

  const artists = isSearching ? searchResults : allArtists;
  const isLoading = isSearching ? isSearchLoading : isLoadingAll;

  return (
    <div className="artists-page">
      <div className="page-toolbar">
        <h1>Artists</h1>
        {isAdmin && (
          <button
            type="button"
            className="toolbar-toggle"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? <X size={16} /> : <Plus size={16} />}
            <span>{showForm ? 'Close' : 'New artist'}</span>
          </button>
        )}
      </div>
      {isAdmin && showForm && <CreateArtistForm />}
      <SearchBar
        placeholder="Search artists by name..."
        value={searchTerm}
        onChange={setSearchTerm}
      />
      {isLoading ? (
        <p className="loading">Loading...</p>
      ) : (
        <ArtistList artists={artists ?? []} />
      )}
    </div>
  );
};

export default ArtistsPage;
