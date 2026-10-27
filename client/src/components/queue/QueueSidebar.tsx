import { useEffect, useRef } from 'react';
import { ListMusic, Repeat, Repeat1, Shuffle, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeQueueSidebar } from '../../features/ui/uiSlice';
import {
  removeFromQueue,
  playFromQueue,
} from '../../features/player/playerSlice';
import QueueItem from './QueueItem';
import './QueueSidebar.scss';

/**
 * Slide-out sidebar that shows the current playback queue.
 *
 * Opens/closes via the Redux ui.isQueueSidebarOpen flag. Slides in from the
 * right with a 300ms CSS transform transition. Closes on Escape key or when
 * the user clicks the close button.
 *
 * Accessibility:
 * - The panel has role="complementary" and aria-label
 * - Focus moves to the panel header on open and returns to the queue button
 *   (if it still exists) on close
 * - Escape key closes the panel
 */
const QueueSidebar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQueueSidebarOpen);
  const { queue, currentIndex, shuffle, repeat } = useAppSelector(
    (state) => state.player,
  );

  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Move focus into the sidebar when it opens; restore on close.
  useEffect(() => {
    if (isOpen) {
      // Short rAF so the transition has kicked off before we shift focus
      const id = requestAnimationFrame(() => {
        closeButtonRef.current?.focus();
      });
      return () => cancelAnimationFrame(id);
    }
  }, [isOpen]);

  // Close on Escape key press.
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        dispatch(closeQueueSidebar());
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, dispatch]);

  const handleRemove = (index: number) => {
    dispatch(removeFromQueue(index));
  };

  const handlePlay = (index: number) => {
    dispatch(playFromQueue(index));
  };

  const handleClose = () => {
    dispatch(closeQueueSidebar());
  };

  const repeatLabel =
    repeat === 'one' ? 'Repeat one' : repeat === 'all' ? 'Repeat all' : null;

  return (
    <>
      {/* Backdrop — click outside to close */}
      <div
        className={`queue-sidebar-backdrop${isOpen ? ' queue-sidebar-backdrop--visible' : ''}`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sidebar panel */}
      <aside
        ref={panelRef}
        className={`queue-sidebar${isOpen ? ' queue-sidebar--open' : ''}`}
        role="complementary"
        aria-label="Now playing queue"
        aria-hidden={!isOpen}
      >
        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div className="queue-sidebar__header">
          <div className="queue-sidebar__title-row">
            <ListMusic
              size={18}
              strokeWidth={2}
              className="queue-sidebar__title-icon"
              aria-hidden="true"
            />
            <h2 className="queue-sidebar__title">Queue</h2>

            {/* Mode badges */}
            {shuffle && (
              <span
                className="queue-sidebar__badge queue-sidebar__badge--shuffle"
                title="Shuffle on"
                aria-label="Shuffle is on"
              >
                <Shuffle size={12} strokeWidth={2} aria-hidden="true" />
                Shuffle
              </span>
            )}
            {repeat !== 'off' && repeatLabel && (
              <span
                className="queue-sidebar__badge queue-sidebar__badge--repeat"
                title={repeatLabel}
                aria-label={`${repeatLabel} is on`}
              >
                {repeat === 'one' ? (
                  <Repeat1 size={12} strokeWidth={2} aria-hidden="true" />
                ) : (
                  <Repeat size={12} strokeWidth={2} aria-hidden="true" />
                )}
                {repeatLabel}
              </span>
            )}
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className="queue-sidebar__close"
            onClick={handleClose}
            aria-label="Close queue"
            title="Close queue (Esc)"
          >
            <X size={16} strokeWidth={2} aria-hidden="true" />
          </button>
        </div>

        {/* ── Song count ─────────────────────────────────────────────────── */}
        {queue.length > 0 && (
          <p className="queue-sidebar__count" aria-live="polite">
            {queue.length} {queue.length === 1 ? 'song' : 'songs'}
          </p>
        )}

        {/* ── Queue list / empty state ────────────────────────────────────── */}
        <div className="queue-sidebar__body">
          {queue.length === 0 ? (
            <div className="queue-sidebar__empty">
              <ListMusic
                size={40}
                strokeWidth={1.25}
                className="queue-sidebar__empty-icon"
                aria-hidden="true"
              />
              <p className="queue-sidebar__empty-title">Queue is empty</p>
              <p className="queue-sidebar__empty-hint">
                Play a song or album to start building your queue.
              </p>
            </div>
          ) : (
            <ul
              className="queue-sidebar__list"
              role="list"
              aria-label="Queue items"
            >
              {queue.map((song, index) => (
                <li key={`${song.id}-${index}`} role="listitem">
                  <QueueItem
                    song={song}
                    index={index}
                    isCurrent={index === currentIndex}
                    onRemove={handleRemove}
                    onPlay={handlePlay}
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  );
};

export default QueueSidebar;
