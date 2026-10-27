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
    >
      {ripples.map((r) => (
        <span
          key={r.key}
          className="song-row__ripple"
          style={{ left: r.x, top: r.y }}
        />
      ))}
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
      <div className="song-info">
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
      {!hideAlbumColumn &&
        (song.album ? (
          <Link
            to={`/albums/${song.album.id}`}
            className="album-col"
            onClick={(e) => e.stopPropagation()}
          >
            {song.album.title}
          </Link>
        ) : (
          <span className="album-col empty-col">—</span>
        ))}
      {!hideGenreColumn &&
        (song.genres?.length ? (
          <Link
            to={`/genres/${song.genres[0].id}`}
            className="genre-col"
            onClick={(e) => e.stopPropagation()}
          >
            {song.genres[0].name}
          </Link>
        ) : (
          <span className="genre-col empty-col">—</span>
        ))}
      <span className="duration">
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
        title="No songs yet"
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
    <div className={listClassName}>
      <div className="song-row song-header" aria-hidden="true">
        <span className="index-play">#</span>
        <span>Title</span>
        {!hideAlbumColumn && <span className="album-col">Album</span>}
        {!hideGenreColumn && <span className="genre-col">Genre</span>}
        <span className="duration">Time</span>
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
