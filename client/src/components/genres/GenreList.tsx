import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { IGenre } from '../../types/api';
import { pluralize } from '../../utils/pluralize';
import './GenreList.scss';

/** How many artist names a card spells out before it says "+N more". */
const MAX_ARTISTS_SHOWN = 3;

/** Each artist who has a song in the genre, listed once. */
const getArtistNames = (genre: IGenre): string[] => {
  const names: string[] = [];

  for (const song of genre.songs ?? []) {
    if (song.artist && !names.includes(song.artist.name)) {
      names.push(song.artist.name);
    }
  }

  return names;
};

/** The brand purple's hue; the first genre gets it. */
const FIRST_HUE = 268;

const GenreList = ({ genres }: { genres: IGenre[] }) => (
  <div className="genre-grid">
    {genres.map((genre, index) => {
      // Spread the genres evenly round the colour wheel so no two look alike.
      const hue = (FIRST_HUE + (index * 360) / genres.length) % 360;
      const songCount = genre.songs?.length ?? 0;
      const artistNames = getArtistNames(genre);
      const hiddenCount = artistNames.length - MAX_ARTISTS_SHOWN;

      return (
        <Link
          key={genre.id}
          to={`/genres/${genre.id}`}
          className="genre-card"
          style={{ '--genre-hue': hue } as CSSProperties}
        >
          <div className="genre-card__header">
            <h2 className="genre-card__name">{genre.name}</h2>
            <span className="genre-card__count">
              {pluralize(songCount, 'song')}
            </span>
          </div>
          <p className="genre-card__artists">
            {artistNames.length === 0
              ? 'No songs yet'
              : artistNames.slice(0, MAX_ARTISTS_SHOWN).join(', ') +
                (hiddenCount > 0 ? ` +${hiddenCount} more` : '')}
          </p>
        </Link>
      );
    })}
  </div>
);

export default GenreList;
