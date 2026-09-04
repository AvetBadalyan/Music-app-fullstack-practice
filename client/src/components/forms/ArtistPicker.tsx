import { useEffect, useRef, useState } from 'react';
import {
  useGetAllArtistsQuery,
  useSearchArtistsQuery,
} from '../../services/artistsApi';
import { useDebouncedValue } from '../../hooks/useDebouncedValue';
import { FIELD_LIMITS } from '../../constants/fieldLimits';
import type { IArtist, IArtistRef } from '../../types/api';
import Modal from '../common/Modal';
import CreateArtistForm from './CreateArtistForm';

interface ArtistPickerProps {
  label: string;
  selectedArtist: IArtistRef | null;
  onSelect: (artist: IArtistRef | null) => void;
  required?: boolean;
  hint?: string;
}

/** Keeps a clicked option alive long enough for its onClick to run. */
const BLUR_GRACE_MS = 150;

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
  const blurTimeout = useRef<ReturnType<typeof setTimeout>>(undefined);

  const debouncedSearch = useDebouncedValue(searchTerm.trim());
  const isSearching = debouncedSearch.length > 0;

  // Only one of the two runs: the full list while the field is empty, the
  // search endpoint once something has been typed.
  const { data: allArtists, isFetching: isFetchingAll } = useGetAllArtistsQuery(
    undefined,
    { skip: isSearching },
  );
  const { data: searchResults, isFetching: isFetchingSearch } =
    useSearchArtistsQuery(debouncedSearch, { skip: !isSearching });

  const artists = (isSearching ? searchResults : allArtists) ?? [];
  const isFetching = isSearching ? isFetchingSearch : isFetchingAll;
  const showResults = isFocused && !selectedArtist;

  useEffect(() => () => clearTimeout(blurTimeout.current), []);

  const handleFocus = () => {
    clearTimeout(blurTimeout.current);
    setIsFocused(true);
  };

  const handleBlur = () => {
    blurTimeout.current = setTimeout(() => setIsFocused(false), BLUR_GRACE_MS);
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
          {isFetching && <p>Loading...</p>}
          {!isFetching && artists.length === 0 && <p>No artists found.</p>}
          {artists.map((artist) => (
            <button
              key={artist.id}
              type="button"
              className="picker-option"
              // The input's blur would otherwise fire first and collapse the
              // list before this button ever received the click.
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => handleSelect(artist)}
            >
              <strong>{artist.name}</strong>
              {artist.bio && <span>{artist.bio}</span>}
            </button>
          ))}
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
