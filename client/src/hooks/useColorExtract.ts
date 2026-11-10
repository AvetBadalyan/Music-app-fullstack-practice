import { useEffect, useState } from 'react';

/** The accent colour as bare HSL values, used when nothing can be sampled. */
const ACCENT_COLOR_HSL = '268, 66%, 67%';

/** Sampling the same image always gives the same colour, so keep the result. */
const colorCache = new Map<string, string>();

const SAMPLE_SIZE = 32; // 1024 pixels is plenty for an average, and quick

export interface ColorExtractResult {
  /** Bare HSL values, e.g. "268, 66%, 67%", for `hsla(var(--cover-glow-color), 0.25)`. */
  dominantColor: string | null;
  /** True while the image is still being sampled. */
  isLoading: boolean;
}

/** Turns RGB (0-255) into bare HSL values, with no `hsl()` wrapper. */
const rgbToHslString = (red: number, green: number, blue: number): string => {
  const r = red / 255;
  const g = green / 255;
  const b = blue / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation =
    delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness - 1));

  let hue = 0;
  if (delta !== 0) {
    if (max === r) hue = ((g - b) / delta + (g < b ? 6 : 0)) / 6;
    else if (max === g) hue = ((b - r) / delta + 2) / 6;
    else hue = ((r - g) / delta + 4) / 6;
  }

  return `${Math.round(hue * 360)}, ${Math.round(saturation * 100)}%, ${Math.round(lightness * 100)}%`;
};

/**
 * Average the centre of an already-loaded image into one HSL colour.
 *
 * The centre 50% is used to dodge the borders common in album art, and each
 * pixel is weighted by its saturation so the most vivid hue wins over grey.
 *
 * Returns null if the canvas is unreadable (a cross-origin image served
 * without CORS headers taints it) or if every pixel is transparent.
 */
const sampleCenterColor = (image: HTMLImageElement): string | null => {
  const canvas = document.createElement('canvas');
  canvas.width = SAMPLE_SIZE;
  canvas.height = SAMPLE_SIZE;

  const context = canvas.getContext('2d');
  if (!context) return null;

  const { naturalWidth: width, naturalHeight: height } = image;
  context.drawImage(
    image,
    width * 0.25,
    height * 0.25,
    width * 0.5,
    height * 0.5,
    0,
    0,
    SAMPLE_SIZE,
    SAMPLE_SIZE,
  );

  let pixels: Uint8ClampedArray;
  try {
    pixels = context.getImageData(0, 0, SAMPLE_SIZE, SAMPLE_SIZE).data;
  } catch {
    return null; // tainted canvas
  }

  let red = 0;
  let green = 0;
  let blue = 0;
  let totalWeight = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue; // skip mostly-transparent pixels

    const max = Math.max(pixels[i], pixels[i + 1], pixels[i + 2]);
    const min = Math.min(pixels[i], pixels[i + 1], pixels[i + 2]);
    const saturation = max === 0 ? 0 : (max - min) / max;
    // A base weight lets grey pixels count a little; saturation boosts vivid ones.
    const weight = 0.1 + saturation * 0.9;

    red += pixels[i] * weight;
    green += pixels[i + 1] * weight;
    blue += pixels[i + 2] * weight;
    totalWeight += weight;
  }

  if (totalWeight === 0) return null;

  return rgbToHslString(
    Math.round(red / totalWeight),
    Math.round(green / totalWeight),
    Math.round(blue / totalWeight),
  );
};

/**
 * The dominant colour of an album cover, for the glow behind cards and the
 * player. Results are cached per URL; anything that cannot be sampled (no
 * image, a CORS error, a failed load) falls back to the accent colour.
 *
 * @example
 * const { dominantColor } = useColorExtract(song.album?.coverImage);
 * <div style={{ '--cover-glow-color': dominantColor } as CSSProperties} />
 */
export const useColorExtract = (
  imageUrl: string | null | undefined,
): ColorExtractResult => {
  // Bumped once a sample settles, only to re-render and re-read the cache.
  const [, setVersion] = useState(0);

  useEffect(() => {
    if (!imageUrl || colorCache.has(imageUrl)) return;

    let cancelled = false;
    const image = new Image();
    // Required to read the pixels back. Supabase Storage serves its public
    // objects with the matching Access-Control-Allow-Origin header.
    image.crossOrigin = 'anonymous';

    const settle = (color: string) => {
      if (cancelled) return;
      colorCache.set(imageUrl, color);
      setVersion((version) => version + 1);
    };

    image.onload = () => settle(sampleCenterColor(image) ?? ACCENT_COLOR_HSL);
    // Cache the fallback too, so a broken image is not retried on every render.
    image.onerror = () => settle(ACCENT_COLOR_HSL);
    image.src = imageUrl;

    return () => {
      cancelled = true;
    };
  }, [imageUrl]);

  if (!imageUrl) return { dominantColor: ACCENT_COLOR_HSL, isLoading: false };

  const cached = colorCache.get(imageUrl);
  if (cached !== undefined) return { dominantColor: cached, isLoading: false };

  return { dominantColor: null, isLoading: true };
};
