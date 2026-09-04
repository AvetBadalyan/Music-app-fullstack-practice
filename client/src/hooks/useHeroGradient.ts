import { useEffect, useReducer } from 'react';

/** Used while a colour is being sampled, and for entities with no artwork. */
const FALLBACK_COLOR = 'rgb(60, 40, 95)';

/**
 * Sampling the same image always gives the same colour, so results are kept
 * for the session and shared by every page that shows the same artwork.
 */
const colorCache = new Map<string, string>();

const SAMPLE_SIZE = 32; // 1024 pixels is plenty for an average, and quick

/**
 * Average an already-loaded image down to a single colour.
 *
 * Returns null if the canvas is unreadable - a cross-origin image served
 * without CORS headers taints it - or if every pixel is transparent.
 */
const sampleAverageColor = (image: HTMLImageElement): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;

  const context = canvas.getContext('2d');
  if (!context) return null;

  context.drawImage(image, 0, 0, SAMPLE_SIZE, SAMPLE_SIZE);

  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
  } catch {
    return null; // tainted canvas
  }

  let red = 0;
  let green = 0;
  let blue = 0;
  let opaquePixels = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue; // skip mostly-transparent pixels
    red += pixels[i];
    green += pixels[i + 1];
    blue += pixels[i + 2];
    opaquePixels += 1;
  }

  if (opaquePixels === 0) return null;

  red = Math.round(red / opaquePixels);
  green = Math.round(green / opaquePixels);
  blue = Math.round(blue / opaquePixels);

  // Averaging pulls colours toward grey, so lift the strongest channel when
  // the result comes out nearly colourless and would look like a dead panel.
  const spread = Math.max(red, green, blue) - Math.min(red, green, blue);
  if (spread < 40) {
    const boost = 30;
    if (red >= green && red >= blue) red = Math.min(255, red + boost);
    else if (green >= blue) green = Math.min(255, green + boost);
    else blue = Math.min(255, blue + boost);
  }

  return `rgb(${red}, ${green}, ${blue})`;
};

/**
 * Build the detail-page hero background from the dominant colour of the
 * artwork, so each song, album and artist page is tinted by its own cover.
 *
 * Returns a style object ready to put on the hero element: the sampled colour
 * fading into the page background, or the fallback tint while the image loads
 * and for entities with no artwork at all.
 */
export const useHeroGradient = (imageUrl?: string | null) => {
  // The cache is the source of truth, read on every render. This exists only
  // to re-render once a sample lands, rather than mirroring it into state.
  const [, onSampled] = useReducer((sampleCount: number) => sampleCount + 1, 0);

  useEffect(() => {
    if (!imageUrl || colorCache.has(imageUrl)) return;

    let cancelled = false;
    const image = new Image();
    // Required to read the pixels back. Supabase Storage serves its public
    // objects with the matching Access-Control-Allow-Origin header.
    image.crossOrigin = 'anonymous';

    image.onload = () => {
      const sampled = sampleAverageColor(image);
      if (!sampled) return;

      colorCache.set(imageUrl, sampled);
      if (!cancelled) onSampled();
    };

    image.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl, onSampled]);

  const color = (imageUrl && colorCache.get(imageUrl)) || FALLBACK_COLOR;

  return {
    background: `linear-gradient(180deg, ${color} 0%, var(--color-bg) 100%)`,
  };
};
