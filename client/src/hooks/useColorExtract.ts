import { useEffect, useState } from 'react';

/** Accent color HSL values as fallback (no `hsl()` wrapper) for use in `hsla()` */
const ACCENT_COLOR_HSL = '268, 66%, 67%';

/** Module-level cache — shared across all component instances, persists for the session */
const colorCache = new Map<string, string>();

export interface ColorExtractResult {
  /** Dominant color as HSL values, e.g. `"268, 66%, 67%"`, for `hsla(var(--cover-glow-color), 0.25)` */
  dominantColor: string | null;
  /** Whether canvas extraction is in progress */
  isLoading: boolean;
}

/** Convert RGB components to a comma-separated HSL string (no `hsl()` wrapper) */
function rgbToHslString(r: number, g: number, b: number): string {
  const rn = r / 255;
  const gn = g / 255;
  const bn = b / 255;

  const max = Math.max(rn, gn, bn);
  const min = Math.min(rn, gn, bn);
  const delta = max - min;

  let h = 0;
  const l = (max + min) / 2;
  const s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1));

  if (delta !== 0) {
    if (max === rn) {
      h = ((gn - bn) / delta + (gn < bn ? 6 : 0)) / 6;
    } else if (max === gn) {
      h = ((bn - rn) / delta + 2) / 6;
    } else {
      h = ((rn - gn) / delta + 4) / 6;
    }
  }

  return `${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%`;
}

/**
 * Draw the center 50% of the image onto a small off-screen canvas and return
 * a saturation-weighted average color as an HSL string.
 *
 * Sampling the center region avoids border/edge artifacts common in album art.
 * Weighting pixels by their saturation pulls the result toward the most vivid
 * hue rather than averaging toward grey.
 *
 * Returns `null` on CORS errors (tainted canvas) or if all pixels are transparent.
 */
function extractCenterHsl(image: HTMLImageElement): string | null {
  const SIZE = 32; // 32×32 = 1 024 pixels — enough for a reliable average
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;

  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const { naturalWidth: w, naturalHeight: h } = image;
  // Crop to the center 50% × 50% region before scaling down
  ctx.drawImage(image, w * 0.25, h * 0.25, w * 0.5, h * 0.5, 0, 0, SIZE, SIZE);

  let pixels: Uint8ClampedArray;
  try {
    pixels = ctx.getImageData(0, 0, SIZE, SIZE).data;
  } catch {
    // Canvas tainted by CORS — image served without Access-Control-Allow-Origin header
    return null;
  }

  let wR = 0, wG = 0, wB = 0, totalW = 0;

  for (let i = 0; i < pixels.length; i += 4) {
    if (pixels[i + 3] < 128) continue; // skip mostly-transparent pixels

    const r = pixels[i];
    const g = pixels[i + 1];
    const b = pixels[i + 2];

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    // Saturation in HSV space: 0 for grey, 1 for fully saturated
    const sat = max === 0 ? 0 : (max - min) / max;
    // Base weight of 0.1 ensures even grey pixels contribute; saturation boosts vivid ones
    const weight = 0.1 + sat * 0.9;

    wR += r * weight;
    wG += g * weight;
    wB += b * weight;
    totalW += weight;
  }

  if (totalW === 0) return null;

  return rgbToHslString(
    Math.round(wR / totalW),
    Math.round(wG / totalW),
    Math.round(wB / totalW),
  );
}

/**
 * Extracts the dominant color from an album cover image for Cover_Glow effects.
 *
 * - Samples the **center 50%** of the image to avoid edge artifacts
 * - Weights pixels by saturation so the dominant hue wins over grey tones
 * - Caches results per URL in a module-level `Map` — no re-extraction on remount
 * - Falls back to the accent color (`268, 66%, 67%`) on CORS errors, canvas
 *   failures, extraction returning no opaque pixels, or when `imageUrl` is missing
 *
 * The returned `dominantColor` is a bare HSL value string, e.g. `"152, 48%, 42%"`,
 * intended for use as `hsla(var(--cover-glow-color), 0.25)`.
 *
 * @example
 * ```tsx
 * const { dominantColor, isLoading } = useColorExtract(song.album.coverImage);
 *
 * <div
 *   style={{ '--cover-glow-color': dominantColor ?? '268, 66%, 67%' } as React.CSSProperties}
 *   className={dominantColor ? 'player--has-glow' : undefined}
 * />
 * ```
 */
export function useColorExtract(imageUrl: string | null | undefined): ColorExtractResult {
  // A version counter that increments once extraction settles (success or error).
  // Using a functional updater avoids stale-closure issues inside the effect.
  const [, setVersion] = useState(0);

  useEffect(() => {
    // Nothing to do — null/undefined URL or result already cached
    if (!imageUrl || colorCache.has(imageUrl)) return;

    let cancelled = false;
    const img = new Image();
    // crossOrigin must be set before src to request a CORS-enabled fetch.
    // Supabase Storage serves public objects with Access-Control-Allow-Origin.
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      const hsl = extractCenterHsl(img);
      // Store the extracted color or the accent fallback on canvas failure
      colorCache.set(imageUrl, hsl ?? ACCENT_COLOR_HSL);
      setVersion(v => v + 1);
    };

    img.onerror = () => {
      if (cancelled) return;
      // Network or format error — store fallback so we don't retry on next render
      colorCache.set(imageUrl, ACCENT_COLOR_HSL);
      setVersion(v => v + 1);
    };

    img.src = imageUrl;

    return () => {
      // Prevent stale callbacks from updating state after unmount or URL change
      cancelled = true;
    };
  }, [imageUrl]);

  // Derive return values directly from the cache — no duplicate state
  if (!imageUrl) {
    // Missing URL: return accent fallback immediately
    return { dominantColor: ACCENT_COLOR_HSL, isLoading: false };
  }

  const cached = colorCache.get(imageUrl);
  if (cached !== undefined) {
    // Cache hit: extraction already done (or failed with fallback stored)
    return { dominantColor: cached, isLoading: false };
  }

  // Cache miss: extraction is in flight
  return { dominantColor: null, isLoading: true };
}
