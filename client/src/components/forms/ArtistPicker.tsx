import { useRef, useState } from 'react';
import {
  useGetAllArtistsQuery,
  useSearchArtistsQuery,
} from '../../services/artistsApi';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import type { IArtist } from '../../types/artist';
import Modal from '../common/Modal';
import CreateArtistForm from './CreateArtistForm';

interface ArtistPickerProps {
  label: string;
  selectedArtist: IArtist | null;
  onSelect: (artist: IArtist | null) => void;
  required?: boolean;
  hint?: string;
}

const ArtistPicker = ({
  label,
  selectedArtist,
  onSelect,
  required = false,
  hint,
}: ArtistPickerProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const trimmedSearch = searchTerm.trim();
  const isSearching = trimmedSearch.length > 0;

  const { data: allArtists, isFetching: allFetching } = useGetAllArtistsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isFetching: searchFetching } =
    useSearchArtistsQuery(trimmedSearch, { skip: !isSearching });

  const artists = isSearching ? searchResults : allArtists;
  const isFetching = isSearching ? searchFetching : allFetching;
  const showResults = isFocused && !selectedArtist;

  const handleFocus = () => {
    if (blurTimeout.current) clearTimeout(blurTimeout.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    // Delay so option click registers before the list collapses.
    blurTimeout.current = setTimeout(() => setIsFocused(false), 150);
  };

  const handleSelect = (artist: IArtist) => {
    onSelect(artist);
    setSearchTerm('');
    setIsFocused(false);
  };

  const handleCreated = (artist: IArtist) => {
    setIsCreateOpen(false);
    handleSelect(artist);
  };

  return (
    <div className="artist-picker">
      <label>
        <span>
          {label}
          {required && <span className="required-mark">*</span>}
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder="Search artists by name"
          required={required && !selectedArtist}
          maxLength={FIELD_LIMITS.searchQuery}
        />
      </label>

      {hint && <p className="field-hint">{hint}</p>}

      {selectedArtist && (
        <div className="selected-pill">
          <span>Selected: {selectedArtist.name}</span>
          <button type="button" onClick={() => onSelect(null)}>
            Clear
          </button>
        </div>
      )}

      {showResults && (
        <div className="picker-results">
          {isFetching ? (
            <p>Loading...</p>
          ) : artists && artists.length > 0 ? (
            artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                className="picker-option"
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => handleSelect(artist)}
              >
                <strong>{artist.name}</strong>
                {artist.bio && <span>{artist.bio}</span>}
              </button>
            ))
          ) : (
            <p>No artists found.</p>
          )}
          <button
            type="button"
            className="picker-option create-affordance"
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setIsCreateOpen(true)}
          >
            + Create new artist
          </button>
        </div>
      )}

      <Modal
        open={isCreateOpen}
        title="Create new artist"
        onClose={() => setIsCreateOpen(false)}
      >
        <CreateArtistForm onCreated={handleCreated} />
      </Modal>
    </div>
  );
};

export default ArtistPicker;
