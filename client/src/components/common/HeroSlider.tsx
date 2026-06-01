import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import './HeroSlider.scss';

const SLIDES = [
  {
    src: '/singers/music_slide_1_1920x1080.jpg',
    alt: '',
  },
  {
    src: '/singers/music_slide_2_1920x1080.jpg',
    alt: '',
  },
  {
    src: '/singers/music_slide_3_1920x1080.jpg',
    alt: '',
  },
  {
    src: '/singers/music_slide_4_1920x1080.jpg',
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
          {SLIDES.map((slide, i) => (
            <div
              key={slide.src}
              className="hero-slider__slide"
              aria-hidden={i !== current}
            >
              <img src={slide.src} alt={slide.alt} draggable={false} />
            </div>
          ))}
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
