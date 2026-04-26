import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { togglePlay, nextSong, prevSong, pause } from '../../features/player/playerSlice';
import './MusicPlayer.scss';

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const { currentSong, isPlaying, queue, currentIndex } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  useEffect(() => {
    setCurrentTime(0);
    setDuration(0);
  }, [currentSong?.id]);

  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentSong?.audioFile) {
      void audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong?.audioFile]);

  const syncTimeline = () => {
    if (!audioRef.current) {
      return;
    }

    setCurrentTime(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    if (!audioRef.current || duration <= 0) {
      return;
    }

    const nextTime = Math.min(Number(event.currentTarget.value), duration);
    audioRef.current.currentTime = nextTime;
    setCurrentTime(nextTime);
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

    setCurrentTime(0);
    dispatch(pause());
  };

  if (!currentSong) return null;

  const isPreviousDisabled = currentIndex <= 0;
  const isNextDisabled = currentIndex < 0 || currentIndex >= queue.length - 1;
  const progressMax = duration > 0 ? duration : 0;
  const progressValue = progressMax > 0 ? Math.min(currentTime, progressMax) : 0;

  return (
    <div className="music-player">
      <audio
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
          {currentSong.title}
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
            ⏮
          </button>
          <button
            onClick={() => dispatch(togglePlay())}
            className="play-pause"
            title={isPlaying ? 'Pause' : 'Play'}
            aria-label={isPlaying ? 'Pause current song' : 'Play current song'}
          >
          {isPlaying ? '⏸' : '▶'}
          </button>
          <button
            onClick={() => dispatch(nextSong())}
            title="Next"
            aria-label="Next song"
            disabled={isNextDisabled}
          >
            ⏭
          </button>
        </div>

        <div className="progress-row">
          <span className="time">{formatTime(currentTime)}</span>
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
          <span className="time">{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;
