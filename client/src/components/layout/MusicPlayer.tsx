import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
} from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  ListMusic,
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
import {
  closeQueueSidebar,
  toggleQueueSidebar,
} from '../../features/ui/uiSlice';
import { useColorExtract } from '../../hooks/useColorExtract';
import { formatDuration } from '../../utils/formatDuration';
import './MusicPlayer.scss';

type TimelineState = {
  songId: string;
  currentTime: number;
  duration: number;
};

// Shortcuts must not steal keys from something that is already using them:
// typing in a field, or pressing Space on a focused button or link.
const isInteractiveTarget = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable ||
    target.closest('input, textarea, select, button, a, [tabindex="0"]') !==
      null);

const getRepeatLabel = (repeat: string) => {
  if (repeat === 'one') return 'Repeat one (on)';
  if (repeat === 'all') return 'Repeat all (on)';
  return 'Repeat (off)';
};

// Picks the speaker icon for the current loudness (0 means muted) and returns
// it already rendered, so the caller just drops it in. Returning the element
// (not the component) keeps React from treating it as a new component type.
const renderVolumeIcon = (level: number) => {
  const props = { size: 18, strokeWidth: 2, 'aria-hidden': true } as const;
  if (level === 0) return <VolumeX {...props} />;
  if (level < 0.4) return <Volume {...props} />;
  if (level < 0.75) return <Volume1 {...props} />;
  return <Volume2 {...props} />;
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

  const { dominantColor } = useColorExtract(currentSong?.album?.coverImage);

  // Play/pause sync. A song with no audio file, or one the browser can't
  // load, can't actually play - fall back to paused rather than leaving the
  // UI stuck showing "Pause".
  useEffect(() => {
    if (!audioRef.current) return;

    if (!isPlaying) {
      audioRef.current.pause();
      return;
    }

    if (!currentSong?.audioFile) {
      dispatch(pause());
      return;
    }

    void audioRef.current.play().catch(() => dispatch(pause()));
  }, [isPlaying, currentSong?.audioFile, dispatch]);

  // Volume / mute sync. The <audio> element is re-created when currentSong.id
  // changes (it's the key), so the effect must also depend on the song to apply
  // volume and mute to the new element.
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume;
    audioRef.current.muted = isMuted;
  }, [volume, isMuted, currentSong?.id]);

  // Global keyboard shortcuts. Up and Down are left out on purpose: they keep
  // scrolling the page (the volume slider already answers to the arrow keys).
  useEffect(() => {
    if (!currentSong) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (isInteractiveTarget(event.target)) return;
      if (event.metaKey || event.ctrlKey || event.altKey) return;

      switch (event.code) {
        case 'Space':
          event.preventDefault();
          dispatch(togglePlay());
          break;
        // The browser keeps currentTime between 0 and the song length.
        case 'ArrowRight':
          if (audioRef.current) {
            event.preventDefault();
            audioRef.current.currentTime += 5;
          }
          break;
        case 'ArrowLeft':
          if (audioRef.current) {
            event.preventDefault();
            audioRef.current.currentTime -= 5;
          }
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
  }, [dispatch, currentSong]);

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

  // The browser could not load or decode the audio file (missing file,
  // network problem). Without this the play button would silently do nothing.
  const handleAudioError = () => {
    dispatch(pause());
    toast.error('This song could not be played.');
  };

  const handleEnded = () => {
    // Repeat one, or a one-song queue that should loop (repeat all or
    // shuffle): there is no other song to switch to, so replay this one.
    const loopsSingleSong = queue.length <= 1 && (repeat === 'all' || shuffle);
    if ((repeat === 'one' || loopsSingleSong) && audioRef.current) {
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

  const handleClosePlayer = () => {
    dispatch(closePlayer());
    dispatch(closeQueueSidebar());
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

  const repeatLabel = getRepeatLabel(repeat);
  const volumeIcon = renderVolumeIcon(isMuted ? 0 : volume);

  const progressPct = progressMax > 0 ? (progressValue / progressMax) * 100 : 0;
  const volumePct = Math.round((isMuted ? 0 : volume) * 100);

  return (
    <div
      className={`music-player${isPlaying && dominantColor ? ' music-player--has-glow' : ''}`}
      style={
        dominantColor
          ? ({ '--cover-glow-color': dominantColor } as CSSProperties)
          : undefined
      }
    >
      <audio
        key={currentSong.id}
        ref={audioRef}
        preload="metadata"
        src={currentSong.audioFile ?? undefined}
        onLoadedMetadata={syncTimeline}
        onDurationChange={syncTimeline}
        onTimeUpdate={syncTimeline}
        onEnded={handleEnded}
        onError={handleAudioError}
      />

      <div className="now-playing">
        <Link to={`/songs/${currentSong.id}`} className="song-title">
          <span
            className={`equalizer now-playing-status${!isPlaying ? ' is-paused' : ''}`}
            aria-hidden="true"
          >
            <span />
            <span />
            <span />
          </span>
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
        <div className="controls">
          <button
            type="button"
            className={`mode-btn${shuffle ? ' is-active' : ''}`}
            onClick={() => dispatch(toggleShuffle())}
            title={shuffle ? 'Shuffle on' : 'Shuffle off'}
            aria-label={shuffle ? 'Disable shuffle' : 'Enable shuffle'}
            aria-pressed={shuffle}
          >
            <Shuffle size={16} strokeWidth={2} aria-hidden="true" />
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
              <Repeat1 size={16} strokeWidth={2} aria-hidden="true" />
            ) : (
              <Repeat size={16} strokeWidth={2} aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="progress-row">
          <span className="time">{formatDuration(activeTimeline.currentTime)}</span>
          <input
            className="range"
            type="range"
            min="0"
            max={progressMax}
            step="1"
            value={progressValue}
            onChange={handleSeek}
            aria-label="Seek within current song"
            disabled={progressMax === 0}
            style={{ '--progress': `${progressPct}%` } as CSSProperties}
          />
          <span className="time">{formatDuration(activeTimeline.duration)}</span>
        </div>
      </div>

      <div className="player-extras">
        <div className="volume-control">
          <button
            type="button"
            className="volume-btn"
            onClick={() => dispatch(toggleMute())}
            title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            aria-pressed={isMuted}
          >
            {volumeIcon}
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
            style={{ '--progress': `${volumePct}%` } as CSSProperties}
          />
        </div>

        <button
          type="button"
          className="queue-btn"
          onClick={() => dispatch(toggleQueueSidebar())}
          title="Queue"
          aria-label="Toggle queue sidebar"
        >
          <ListMusic size={16} strokeWidth={2} aria-hidden="true" />
        </button>

        <button
          type="button"
          className="close-btn"
          onClick={handleClosePlayer}
          title="Close player"
          aria-label="Close player"
        >
          <X size={16} strokeWidth={2} aria-hidden="true" />
        </button>
      </div>
    </div>
  );
};

export default MusicPlayer;
