import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.scss';

const SLIDES = [
  {
    src: '/singers/music_slide_1_768.webp',
    srcSet:
      '/singers/music_slide_1_768.webp 768w, /singers/music_slide_1_1280.webp 1280w, /singers/music_slide_1_1600.webp 1600w',
    width: 1853,
    height: 1040,
    alt: '',
  },
  {
    src: '/singers/music_slide_2_768.webp',
    srcSet:
      '/singers/music_slide_2_768.webp 768w, /singers/music_slide_2_1280.webp 1280w, /singers/music_slide_2_1600.webp 1600w',
    width: 1858,
    height: 1048,
    alt: '',
  },
  {
    src: '/singers/music_slide_3_768.webp',
    srcSet:
      '/singers/music_slide_3_768.webp 768w, /singers/music_slide_3_1280.webp 1280w, /singers/music_slide_3_1600.webp 1600w',
    width: 1864,
    height: 1040,
    alt: '',
  },
  {
    src: '/singers/music_slide_4_768.webp',
    srcSet:
      '/singers/music_slide_4_768.webp 768w, /singers/music_slide_4_1280.webp 1280w, /singers/music_slide_4_1600.webp 1600w',
    width: 1859,
    height: 1045,
    alt: '',
  },
];

const AUTO_ADVANCE_MS = 5000;

const HeroSlider = () => {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

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

  return (
    <section
      className="hero-slider"
      aria-label="Featured slideshow"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="hero-slider__viewport">
        {/* Track */}
        <div
          className="hero-slider__track"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {SLIDES.map((slide, i) => {
            const shouldLoad =
              i === current || i === (current + 1) % SLIDES.length;

            return (
              <div
                key={slide.src}
                className="hero-slider__slide"
                aria-hidden={i !== current}
              >
                <img
                  src={shouldLoad ? slide.src : undefined}
                  srcSet={shouldLoad ? slide.srcSet : undefined}
                  sizes="100vw"
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
            key={slide.src}
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
