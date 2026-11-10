import { Link } from 'react-router-dom';
import { Mic2 } from 'lucide-react';
import { useGetAllAlbumsQuery } from '../../services/albumsApi';
import { useGetAllSongsQuery } from '../../services/songsApi';
import type { IArtist } from '../../types/api';
import { pluralize } from '../../utils/pluralize';
import './ArtistList.scss';

interface ArtistListProps {
  artists: IArtist[];
}

/** Counts how many songs (or albums) each artist has, keyed by artist id. */
const countByArtist = (items: { artist?: { id: string } }[]) => {
  const counts: Record<string, number> = {};
  for (const item of items) {
    if (!item.artist) continue;
    counts[item.artist.id] = (counts[item.artist.id] ?? 0) + 1;
  }
  return counts;
};

const ArtistList = ({ artists }: ArtistListProps) => {
  // The artist endpoints carry no totals, so the cards count them from the
  // song and album lists (cached, and shared with the other pages).
  const { data: songs } = useGetAllSongsQuery();
  const { data: albums } = useGetAllAlbumsQuery();
  const songCounts = countByArtist(songs ?? []);
  const albumCounts = countByArtist(albums ?? []);
  const hasCounts = songs !== undefined && albums !== undefined;

  const describeArtist = (artistId: string) =>
    `${pluralize(songCounts[artistId] ?? 0, 'song')} · ${pluralize(albumCounts[artistId] ?? 0, 'album')}`;

  return (
    <div className="artist-grid">
      {artists.map((artist) => (
        <Link
          key={artist.id}
          to={`/artists/${artist.id}`}
          className="artist-card"
        >
          <div className="artist-avatar">
            {artist.profilePicture ? (
              <img
                src={artist.profilePicture}
                alt={artist.name}
                width="224"
                height="224"
                loading="lazy"
                decoding="async"
              />
            ) : (
              <div className="placeholder" aria-hidden="true">
                <Mic2 size={32} strokeWidth={1.5} />
              </div>
            )}
          </div>
          <p className="artist-name">{artist.name}</p>
          {/* A non-breaking space keeps the line's height until the counts arrive. */}
          <p className="artist-stats">
            {hasCounts ? describeArtist(artist.id) : '\u00A0'}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default ArtistList;
