import { useEffect, useRef } from 'react';
import { ListMusic, Repeat, Repeat1, Shuffle, X } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { closeQueueSidebar } from '../../features/ui/uiSlice';
import { pluralize } from '../../utils/pluralize';
import {
  removeFromQueue,
  playFromQueue,
} from '../../features/player/playerSlice';
import QueueItem from './QueueItem';
import './QueueSidebar.scss';

/**
 * Slide-out panel that shows the playback queue.
 *
 * It opens and closes through the Redux `ui.isQueueSidebarOpen` flag, and
 * slides in from the right. Escape, the close button and a click on the dimmed
 * area all close it.
 *
 * Keyboard: focus moves into the panel when it opens and goes back to the
 * button that opened it when it closes. While the panel is closed it is
 * hidden with CSS `visibility`, so its buttons are not in the tab order.
 */
const QueueSidebar = () => {
  const dispatch = useAppDispatch();
  const isOpen = useAppSelector((state) => state.ui.isQueueSidebarOpen);
  const { queue, currentIndex, shuffle, repeat } = useAppSelector(
    (state) => state.player,
  );

  const closeButtonRef = useRef<HTMLButtonElement>(null);
  // The element that had focus before the panel opened (the queue button).
  const openerRef = useRef<HTMLElement | null>(null);

  // Move focus into the panel when it opens, and give it back when it closes.
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    } else {
      openerRef.current?.focus();
      openerRef.current = null;
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
        className={`queue-sidebar${isOpen ? ' queue-sidebar--open' : ''}`}
        aria-label="Now playing queue"
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
            {pluralize(queue.length, 'song')}
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
            <ul className="queue-sidebar__list" aria-label="Queue items">
              {queue.map((song, index) => (
                <li key={`${song.id}-${index}`}>
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
