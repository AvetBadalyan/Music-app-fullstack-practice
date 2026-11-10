import { Link } from 'react-router-dom';
import type { IGenre } from '../../types/api';
import './GenreTags.scss';

/** Links to the genres an album or song belongs to. */
const GenreTags = ({ genres }: { genres: IGenre[] }) => (
  <ul className="genre-tags" aria-label="Genres">
    {genres.map((genre) => (
      <li key={genre.id}>
        <Link to={`/genres/${genre.id}`} className="genre-tag">
          {genre.name}
        </Link>
      </li>
    ))}
  </ul>
);

export default GenreTags;
