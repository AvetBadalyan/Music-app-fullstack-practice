import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { togglePlay, nextSong, prevSong, pause } from '../../features/player/playerSlice';
import './MusicPlayer.scss';

type TimelineState = {
  songId: string;
  currentTime: number;
  duration: number;
};

const formatTime = (timeInSeconds: number) => {
  if (!Number.isFinite(timeInSeconds) || timeInSeconds < 0) {
    return '0:00';
  }

  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60)
    .toString()
    .padStart(2, '0');

  return `${minutes}:${seconds}`;
};

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeline, setTimeline] = useState<TimelineState>({
    songId: '',
    currentTime: 0,
    duration: 0,
  });
  const { currentSong, isPlaying, queue, currentIndex } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentSong?.audioFile) {
      void audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong?.audioFile]);

  const syncTimeline = () => {
    if (!audioRef.current || !currentSong) {
      return;
    }

    setTimeline({
      songId: currentSong.id,
      currentTime: audioRef.current.currentTime,
      duration: audioRef.current.duration || 0,
    });
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || !currentSong || activeTimeline.duration <= 0) {
      return;
    }

    const nextTime = Math.min(Number(event.currentTarget.value), activeTimeline.duration);
    audioRef.current.currentTime = nextTime;
    setTimeline({
      songId: currentSong.id,
      currentTime: nextTime,
      duration: activeTimeline.duration,
    });
  };

  const handleEnded = () => {
    const hasNextSong = currentIndex >= 0 && currentIndex < queue.length - 1;

    if (hasNextSong) {
      dispatch(nextSong());
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = 0;
    }

    setTimeline((current) => ({
      ...current,
      currentTime: 0,
    }));
    dispatch(pause());
  };

  if (!currentSong) return null;

  const activeTimeline =
    timeline.songId === currentSong.id
      ? timeline
      : { songId: currentSong.id, currentTime: 0, duration: 0 };

  const isPreviousDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex < 0 || currentIndex >= queue.length - 1;
  const progressMax = activeTimeline.duration > 0 ? activeTimeline.duration : 0;
  const progressValue = progressMax > 0 ? Math.min(activeTimeline.currentTime, progressMax) : 0;

  return (
    <div className="music-player">
      <audio
        key={currentSong.id}
        ref={audioRef}
        preload="metadata"
        src={currentSong.audioFile}
        onLoadedMetadata={syncTimeline}
        onDurationChange={syncTimeline}
        onTimeUpdate={syncTimeline}
        onEnded={handleEnded}
      />

      <div className="now-playing">
        <Link to={`/songs/${currentSong.id}`} className="song-title">
          {isPlaying && (
            <span className="equalizer now-playing-status" aria-hidden="true">
              <span /><span /><span />
            </span>
          )}
          <span className="song-title-text">{currentSong.title}</span>
        </Link>
        {currentSong.artist && (
          <Link to={`/artists/${currentSong.artist.id}`} className="artist-name">
            {currentSong.artist.name}
          </Link>
        )}
      </div>

      <div className="player-center">
        <div className="controls transport-controls">
          <button
            onClick={() => dispatch(prevSong())}
            title="Previous"
            aria-label="Previous song"
            disabled={isPreviousDisabled}
          >
            <span className="transport-icon" aria-hidden="true">⏮</span>
          </button>
          <button
            onClick={() => dispatch(togglePlay())}
            className="play-pause"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause current song' : 'Play current song'}
          >
            {isPlaying ? (
              <span className="pause-glyph" aria-hidden="true">
                <span />
                <span />
              </span>
            ) : (
              <span className="play-glyph" aria-hidden="true" />
            )}
          </button>
          <button
            onClick={() => dispatch(nextSong())}
            title="Next"
            aria-label="Next song"
            disabled={isNextDisabled}
          >
            <span className="transport-icon" aria-hidden="true">⏭</span>
          </button>
        </div>

        <div className="progress-row">
          <span className="time">{formatTime(activeTimeline.currentTime)}</span>
          <input
            className="progress-bar"
            type="range"
            min="0"
            max={progressMax}
            step="1"
            value={progressValue}
            onChange={handleSeek}
            aria-label="Seek within current song"
            disabled={progressMax === 0}
          />
          <span className="time">{formatTime(activeTimeline.duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
