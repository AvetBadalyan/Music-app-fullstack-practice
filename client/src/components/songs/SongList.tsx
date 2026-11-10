import { Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Pause, Play } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { playSong, togglePlay } from '../../features/player/playerSlice';
import { formatDuration } from '../../utils/formatDuration';
import EmptyState from '../common/EmptyState';
import useRipple from '../../hooks/useRipple';
import type { ISong } from '../../types/api';
import './SongList.scss';

interface SongListProps {
  songs: ISong[];
  /** Hidden on an album page, where every row shares the same album. */
  hideAlbumColumn?: boolean;
  /** Hidden on a genre page, for the same reason. */
  hideGenreColumn?: boolean;
}

interface SongRowProps {
  song: ISong;
  index: number;
  songs: ISong[];
  isActive: boolean;
  isPlaying: boolean;
  hideAlbumColumn: boolean;
  hideGenreColumn: boolean;
}

const SongRow = ({
  song,
  index,
  songs,
  isActive,
  isPlaying,
  hideAlbumColumn,
  hideGenreColumn,
}: SongRowProps) => {
  const dispatch = useAppDispatch();
  const { ripples, addRipple } = useRipple();

  const isActivePlaying = isActive && isPlaying;
  const playLabel = isActivePlaying
    ? `Pause ${song.title}`
    : `Play ${song.title}`;

  const handlePlayClick = () => {
    dispatch(isActive ? togglePlay() : playSong({ song, queue: songs }));
  };

  return (
    <div
      className={`song-row${isActive ? ' is-active' : ''}`}
      onClick={addRipple}
      role="row"
    >
      {ripples.map((r) => (
        <span
          key={r.key}
          className="song-row__ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
      <div role="cell">
        <button
          type="button"
          className="index-play"
          onClick={handlePlayClick}
          title={playLabel}
          aria-label={playLabel}
        >
          <span className="index">{index + 1}</span>
          {isActive && (
            <span
              className={`equalizer${!isPlaying ? ' is-paused' : ''}`}
              aria-hidden="true"
            >
              <span />
              <span />
              <span />
            </span>
          )}
          <span className="play-icon" aria-hidden="true">
            {isActivePlaying ? (
              <Pause size={14} strokeWidth={2.5} fill="currentColor" />
            ) : (
              <Play size={14} strokeWidth={2.5} fill="currentColor" />
            )}
          </span>
        </button>
      </div>
      <div className="song-info" role="cell">
        <Link
          to={`/songs/${song.id}`}
          className="title"
          onClick={(e) => e.stopPropagation()}
        >
          {song.title}
        </Link>
        {song.artist && (
          <Link
            to={`/artists/${song.artist.id}`}
            className="artist"
            onClick={(e) => e.stopPropagation()}
          >
            {song.artist.name}
          </Link>
        )}
      </div>
      {!hideAlbumColumn && (
        <span
          className={`album-col${song.album ? '' : ' empty-col'}`}
          role="cell"
        >
          {song.album ? (
            <Link
              to={`/albums/${song.album.id}`}
              onClick={(e) => e.stopPropagation()}
            >
              {song.album.title}
            </Link>
          ) : (
            '—'
          )}
        </span>
      )}
      {!hideGenreColumn &&
        (song.genres?.length ? (
          <span className="genre-col" role="cell">
            {song.genres.map((genre, position) => (
              <Fragment key={genre.id}>
                {position > 0 && ', '}
                <Link
                  to={`/genres/${genre.id}`}
                  onClick={(e) => e.stopPropagation()}
                >
                  {genre.name}
                </Link>
              </Fragment>
            ))}
          </span>
        ) : (
          <span className="genre-col empty-col" role="cell">
            —
          </span>
        ))}
      <span className="duration" role="cell">
        {formatDuration(song.duration, '--:--')}
      </span>
    </div>
  );
};

const SongList = ({
  songs,
  hideAlbumColumn = false,
  hideGenreColumn = false,
}: SongListProps) => {
  const { currentSong, isPlaying } = useAppSelector((state) => state.player);

  if (songs.length === 0) {
    return (
      <EmptyState
        context="no-songs"
        description="Your library is quiet. Add a track to get the music going."
      />
    );
  }

  const listClassName = [
    'song-list',
    hideAlbumColumn && 'song-list--hide-album',
    hideGenreColumn && 'song-list--hide-genre',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    // role="table" + row/cell roles give screen readers the column context
    // that a plain <div> grid would otherwise lose. The layout stays CSS grid.
    <div className={listClassName} role="table" aria-label="Songs">
      <div className="song-row song-header" role="row">
        <span className="index-play" role="columnheader">
          #
        </span>
        <span role="columnheader">Title</span>
        {!hideAlbumColumn && (
          <span className="album-col" role="columnheader">
            Album
          </span>
        )}
        {!hideGenreColumn && (
          <span className="genre-col" role="columnheader">
            Genre
          </span>
        )}
        <span className="duration" role="columnheader">
          Time
        </span>
      </div>
      {songs.map((song, index) => {
        const isActive = currentSong?.id === song.id;

        return (
          <SongRow
            key={song.id}
            song={song}
            index={index}
            songs={songs}
            isActive={isActive}
            isPlaying={isPlaying}
            hideAlbumColumn={hideAlbumColumn}
            hideGenreColumn={hideGenreColumn}
          />
        );
      })}
    </div>
  );
};

export default SongList;
