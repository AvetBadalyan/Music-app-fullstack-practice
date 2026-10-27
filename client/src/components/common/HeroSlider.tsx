import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.scss';

const SLIDES = [
  {
    src: '/singers/music_slide_1_768.webp',
    srcSet:
      '/singers/music_slide_1_768.webp 768w, /singers/music_slide_1_1280.webp 1280w, /singers/music_slide_1_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: '',
  },
  {
    src: '/singers/music_slide_2_768.webp',
    srcSet:
      '/singers/music_slide_2_768.webp 768w, /singers/music_slide_2_1280.webp 1280w, /singers/music_slide_2_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: '',
  },
  {
    src: '/singers/music_slide_3_768.webp',
    srcSet:
      '/singers/music_slide_3_768.webp 768w, /singers/music_slide_3_1280.webp 1280w, /singers/music_slide_3_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: '',
  },
  {
    src: '/singers/music_slide_4_768.webp',
    srcSet:
      '/singers/music_slide_4_768.webp 768w, /singers/music_slide_4_1280.webp 1280w, /singers/music_slide_4_1600.webp 1600w',
    width: 1600,
    height: 900,
    alt: '',
  },
];

const AUTO_ADVANCE_MS = 5000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);
  const sliderRef = useRef<HTMLElement>(null);
  const rafIdRef = useRef<number | null>(null);

  const prev = useCallback(() => {
    setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length);
  }, []);

  const next = useCallback(() => {
    setCurrent((c) => (c + 1) % SLIDES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, AUTO_ADVANCE_MS);
    return () => clearInterval(id);
  }, [paused]);

  // Parallax scroll effect — skipped when prefers-reduced-motion is set
  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider) return;

    // Bail out early so no listener is registered when reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let isVisible = true;

    // Only drive the rAF loop while the slider is on-screen
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        // If we scroll past the slider, cancel any pending frame
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
      if (rafIdRef.current !== null) return; // a frame is already queued

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
      className="hero-slider"
      aria-label="Featured slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider__viewport">
        {/* Track — crossfade container, no translateX */}
        <div className="hero-slider__track">
          {SLIDES.map((slide, i) => {
            // Load current, next, and previous so both crossfade partners are
            // ready before a transition in either direction begins.
            const prev = (current - 1 + SLIDES.length) % SLIDES.length;
            const shouldLoad =
              i === current ||
              i === (current + 1) % SLIDES.length ||
              i === prev;

            return (
              <div
                key={slide.src}
                className={`hero-slider__slide${i === current ? ' is-active' : ''}`}
                aria-hidden={i !== current}
              >
                <img
                  src={shouldLoad ? slide.src : undefined}
                  srcSet={shouldLoad ? slide.srcSet : undefined}
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 80vw, 1200px"
                  alt={slide.alt}
                  draggable={false}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  // First slide is the LCP element, so it loads at high priority.
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

      {/* Prev / Next arrows */}
      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--prev"
        onClick={prev}
        aria-label="Previous slide"
      >
        <ChevronLeft size={20} strokeWidth={2} />
      </button>
      <button
        type="button"
        className="hero-slider__arrow hero-slider__arrow--next"
        onClick={next}
        aria-label="Next slide"
      >
        <ChevronRight size={20} strokeWidth={2} />
      </button>

      {/* Dot indicators */}
      <div className="hero-slider__dots" role="tablist" aria-label="Slides">
        {SLIDES.map((slide, i) => (
          <button
            key={i === current ? `${slide.src}-${current}` : slide.src}
            type="button"
            role="tab"
            aria-selected={i === current}
            aria-label={`Go to slide ${i + 1}`}
            className={`hero-slider__dot${i === current ? ' hero-slider__dot--active' : ''}`}
            onClick={() => setCurrent(i)}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSlider;
