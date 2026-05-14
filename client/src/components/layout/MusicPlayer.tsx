import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import {
  Pause,
  Play,
  Repeat,
  Repeat1,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
  togglePlay,
  nextSong,
  prevSong,
  pause,
  setVolume,
  toggleMute,
  toggleShuffle,
  cycleRepeat,
  closePlayer,
} from '../../features/player/playerSlice';
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

const isTypingTarget = (target: EventTarget | null) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    target.isContentEditable
  );
};

const MusicPlayer = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [timeline, setTimeline] = useState<TimelineState>({
    songId: '',
    currentTime: 0,
    duration: 0,
  });
  const {
    currentSong,
    isPlaying,
    queue,
    currentIndex,
    volume,
    isMuted,
    shuffle,
    repeat,
  } = useAppSelector((state) => state.player);
  const dispatch = useAppDispatch();

  // Play/pause sync
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying && currentSong?.audioFile) {
      void audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentSong?.audioFile]);

  // Volume / mute sync
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted]);

  // Global keyboard shortcuts
  useEffect(() => {
    if (!currentSong) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isTypingTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          dispatch(togglePlay());
          break;
        case 'ArrowRight':
          if (audioRef.current) {
            event.preventDefault();
            audioRef.current.currentTime = Math.min(
              audioRef.current.currentTime + 5,
              audioRef.current.duration || audioRef.current.currentTime + 5,
            );
          }
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            event.preventDefault();
            audioRef.current.currentTime = Math.max(
              audioRef.current.currentTime - 5,
              0,
            );
          }
          break;
        case 'ArrowUp':
          event.preventDefault();
          dispatch(setVolume(Math.min(1, volume + 0.05)));
          break;
        case 'ArrowDown':
          event.preventDefault();
          dispatch(setVolume(Math.max(0, volume - 0.05)));
          break;
        case 'KeyM':
          event.preventDefault();
          dispatch(toggleMute());
          break;
        case 'KeyN':
          event.preventDefault();
          dispatch(nextSong());
          break;
        case 'KeyP':
          event.preventDefault();
          dispatch(prevSong());
          break;
        case 'KeyS':
          event.preventDefault();
          dispatch(toggleShuffle());
          break;
        case 'KeyR':
          event.preventDefault();
          dispatch(cycleRepeat());
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [dispatch, volume, currentSong]);

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

    const nextTime = Math.min(
      Number(event.currentTarget.value),
      activeTimeline.duration,
    );
    audioRef.current.currentTime = nextTime;
    setTimeline({
      songId: currentSong.id,
      currentTime: nextTime,
      duration: activeTimeline.duration,
    });
  };

  const handleVolumeChange = (event: ChangeEvent<HTMLInputElement>) => {
    dispatch(setVolume(Number(event.currentTarget.value) / 100));
  };

  const handleEnded = () => {
    // Repeat one: replay current song
    if (repeat === 'one' && audioRef.current) {
      audioRef.current.currentTime = 0;
      void audioRef.current.play().catch(() => {});
      return;
    }

    const hasNextInQueue = currentIndex >= 0 && currentIndex < queue.length - 1;
    if (hasNextInQueue || shuffle || repeat === 'all') {
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

  // With repeat=all or shuffle, prev/next are always allowed when queue has items
  const canWrap = repeat === 'all' || shuffle;
  const isPreviousDisabled = !canWrap && currentIndex <= 0;
  const isNextDisabled =
    !canWrap && (currentIndex < 0 || currentIndex >= queue.length - 1);
  const progressMax = activeTimeline.duration > 0 ? activeTimeline.duration : 0;
  const progressValue =
    progressMax > 0 ? Math.min(activeTimeline.currentTime, progressMax) : 0;

  const repeatLabel =
    repeat === 'one'
      ? 'Repeat one (on)'
      : repeat === 'all'
        ? 'Repeat all (on)'
        : 'Repeat (off)';

  const VolumeIcon =
    isMuted || volume === 0
      ? VolumeX
      : volume < 0.4
        ? Volume
        : volume < 0.75
          ? Volume1
          : Volume2;

  const progressPct = progressMax > 0 ? (progressValue / progressMax) * 100 : 0;
  const volumePct = Math.round((isMuted ? 0 : volume) * 100);

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
              <span />
              <span />
              <span />
            </span>
          )}
          <span className="song-title-text">{currentSong.title}</span>
        </Link>
        {currentSong.artist && (
          <Link
            to={`/artists/${currentSong.artist.id}`}
            className="artist-name"
          >
            {currentSong.artist.name}
          </Link>
        )}
      </div>

      <div className="player-center">
        <div className="controls transport-controls">
          <button
            type="button"
            className={`mode-btn${shuffle ? ' is-active' : ''}`}
            onClick={() => dispatch(toggleShuffle())}
            title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            aria-pressed={shuffle}
          >
            <Shuffle
              size={16}
              strokeWidth={2}
              className="transport-icon"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => dispatch(prevSong())}
            title="Previous (P)"
            aria-label="Previous song"
            disabled={isPreviousDisabled}
          >
            <SkipBack
              size={20}
              strokeWidth={2}
              fill="currentColor"
              className="transport-icon"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            onClick={() => dispatch(togglePlay())}
            className="play-pause"
            title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
            aria-label={isPlaying ? 'Pause current song' : 'Play current song'}
          >
            {isPlaying ? (
              <Pause
                size={20}
                strokeWidth={2.5}
                fill="currentColor"
                aria-hidden="true"
              />
            ) : (
              <Play
                size={20}
                strokeWidth={2.5}
                fill="currentColor"
                aria-hidden="true"
                style={{ marginLeft: 2 }}
              />
            )}
          </button>
          <button
            type="button"
            onClick={() => dispatch(nextSong())}
            title="Next (N)"
            aria-label="Next song"
            disabled={isNextDisabled}
          >
            <SkipForward
              size={20}
              strokeWidth={2}
              fill="currentColor"
              className="transport-icon"
              aria-hidden="true"
            />
          </button>
          <button
            type="button"
            className={`mode-btn${repeat !== 'off' ? ' is-active' : ''}`}
            onClick={() => dispatch(cycleRepeat())}
            title={repeatLabel}
            aria-label={repeatLabel}
          >
            {repeat === 'one' ? (
              <Repeat1
                size={16}
                strokeWidth={2}
                className="transport-icon"
                aria-hidden="true"
              />
            ) : (
              <Repeat
                size={16}
                strokeWidth={2}
                className="transport-icon"
                aria-hidden="true"
              />
            )}
          </button>
        </div>

        <div className="progress-row">
          <span className="time">{formatTime(activeTimeline.currentTime)}</span>
          <input
            className="range progress-bar"
            type="range"
            min="0"
            max={progressMax}
            step="1"
            value={progressValue}
            onChange={handleSeek}
            aria-label="Seek within current song"
            disabled={progressMax === 0}
            style={{ ['--progress' as string]: `${progressPct}%` }}
          />
          <span className="time">{formatTime(activeTimeline.duration)}</span>
        </div>
      </div>

      <div className="volume-control">
        <button
          type="button"
          className="volume-btn"
          onClick={() => dispatch(toggleMute())}
          title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
          aria-label={isMuted ? 'Unmute' : 'Mute'}
          aria-pressed={isMuted}
        >
          <VolumeIcon size={18} strokeWidth={2} aria-hidden="true" />
        </button>
        <input
          className="range volume-bar"
          type="range"
          min="0"
          max="100"
          step="1"
          value={volumePct}
          onChange={handleVolumeChange}
          aria-label="Volume"
          style={{ ['--progress' as string]: `${volumePct}%` }}
        />
      </div>

      <button
        type="button"
        className="close-btn"
        onClick={() => dispatch(closePlayer())}
        title="Close player"
        aria-label="Close player"
      >
        <X size={16} strokeWidth={2} aria-hidden="true" />
      </button>
    </div>
  );
};

export default MusicPlayer;
