import { useState } from 'react';
import { useSearchArtistsQuery } from '../../services/artistsApi';
import type { IArtist } from '../../types/artist';

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
  const trimmedSearch = searchTerm.trim();
  const { data: artists, isFetching } = useSearchArtistsQuery(trimmedSearch, {
    skip: trimmedSearch.length === 0,
  });

  return (
    <div className="artist-picker">
      <label>
        <span>{label}</span>
        <input
          type="text"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search artists by name"
          required={required && !selectedArtist}
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

      {trimmedSearch.length > 0 && (
        <div className="picker-results">
          {isFetching ? (
            <p>Searching...</p>
          ) : artists && artists.length > 0 ? (
            artists.map((artist) => (
              <button
                key={artist.id}
                type="button"
                className="picker-option"
                onClick={() => {
                  onSelect(artist);
                  setSearchTerm('');
                }}
              >
                <strong>{artist.name}</strong>
                {artist.bio && <span>{artist.bio}</span>}
              </button>
            ))
          ) : (
            <p>No artists found.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ArtistPicker;
