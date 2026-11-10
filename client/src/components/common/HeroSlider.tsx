import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.scss';

// Evaluated once at module load. The preference rarely (never in practice)
// changes at runtime, so there is no need to call matchMedia on every render.
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

// How wide the hero is on screen: the page minus the sidebar and the padding.
// Keep in sync with `imagesizes` on the preload link in index.html, so the
// browser picks (and has already started loading) the same image file.
const HERO_IMAGE_SIZES =
  '(min-width: 1025px) calc(100vw - 268px), (min-width: 481px) calc(100vw - 48px), calc(100vw - 32px)';

const SLIDES = [
  {
    src: '/singers/music_slide_1_768.webp',
    srcSet:
      '/singers/music_slide_1_768.webp 768w, /singers/music_slide_1_1280.webp 1280w, /singers/music_slide_1_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: 'Singer smiling into a microphone, quote: Enjoy the music, enjoy the life.',
  },
  {
    src: '/singers/music_slide_2_768.webp',
    srcSet:
      '/singers/music_slide_2_768.webp 768w, /singers/music_slide_2_1280.webp 1280w, /singers/music_slide_2_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: 'Singer in a yellow jacket raising a fist, quote about music as an escape from life.',
  },
  {
    src: '/singers/music_slide_3_768.webp',
    srcSet:
      '/singers/music_slide_3_768.webp 768w, /singers/music_slide_3_1280.webp 1280w, /singers/music_slide_3_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: 'Singer performing, quote: Music can change the world because it can change people.',
  },
  {
    src: '/singers/music_slide_4_768.webp',
    srcSet:
      '/singers/music_slide_4_768.webp 768w, /singers/music_slide_4_1280.webp 1280w, /singers/music_slide_4_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: 'Smiling singer at a piano, quote: Lose yourself in the music and you will find yourself everywhere.',
  },
];

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sliderRef = useRef<HTMLElement>(null);
  const rafIdRef = useRef<number | null>(null);

  // Autoplay: skip if the visitor prefers reduced motion — the fill animation
  // is turned off via CSS so onAnimationEnd never fires, leaving the slider
  // stationary until the user clicks a dot or arrow.
  const autoplay = !prefersReducedMotion;

  const showNext = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  const showPrev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  // Parallax scroll effect — skipped when prefers-reduced-motion is set.
  // The rAF loop only runs while the slider is on-screen (IntersectionObserver).
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;
    if (prefersReducedMotion) return;

    let isVisible = true;

    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (!isVisible && rafIdRef.current !== null) {
          cancelAnimationFrame(rafIdRef.current);
          rafIdRef.current = null;
        }
      },
      { threshold: 0 },
    );
    observer.observe(slider);

    const handleScroll = () => {
      if (!isVisible) return;
      if (rafIdRef.current !== null) return;
      rafIdRef.current = requestAnimationFrame(() => {
        rafIdRef.current = null;
        slider.style.setProperty('--scroll-y', `${window.scrollY}px`);
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      observer.disconnect();
    };
  }, []);

  return (
    <section
      ref={sliderRef}
      className={`hero-slider${isPaused ? ' is-paused' : ''}`}
      aria-label="Featured slideshow"
      aria-roledescription="carousel"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocus={() => setIsPaused(true)}
      onBlur={() => setIsPaused(false)}
    >
      <div className="hero-slider__viewport">
        <div className="hero-slider__track">
          {SLIDES.map((slide, i) => {
            const prevIndex = (current - 1 + SLIDES.length) % SLIDES.length;
            // Keep current + neighbours decoded so crossfade is always smooth.
            const shouldLoad =
              i === current ||
              i === (current + 1) % SLIDES.length ||
              i === prevIndex;

            return (
              <div
                key={slide.src}
                className={`hero-slider__slide${i === current ? ' is-active' : ''}`}
                role="group"
                aria-roledescription="slide"
                aria-label={`${i + 1} of ${SLIDES.length}`}
                aria-hidden={i !== current}
              >
                <img
                  src={shouldLoad ? slide.src : undefined}
                  srcSet={shouldLoad ? slide.srcSet : undefined}
                  sizes={HERO_IMAGE_SIZES}
                  alt={slide.alt}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  fetchPriority={i === 0 ? 'high' : 'low'}
                  decoding="async"
                  width={slide.width}
                  height={slide.height}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Arrows */}
      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={showPrev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={2} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={showNext}
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
      </button>

      {/* Dots — each dot button wraps a visible track bar and a fill bar.
          The fill bar only mounts for the active slide; its animation (5 s)
          drives autoplay via onAnimationEnd, so timing is always in sync. */}
      <div className="hero-slider__dots" role="tablist" aria-label="Slides">
        {SLIDES.map((slide, i) => (
          <button
            key={slide.src}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className="hero-slider__dot"
            onClick={() => setCurrent(i)}
          >
            <span className="hero-slider__dot-track">
              {/* Fill only exists for the active dot. Mounting a fresh element
                  on each slide change restarts the animation from 0. */}
              {i === current && (
                <span
                  className="hero-slider__dot-fill"
                  onAnimationEnd={autoplay ? showNext : undefined}
                />
              )}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
