import { useEffect, useState } from 'react';

/**
 * Sample a dominant color from a remote image using a canvas.
 * Returns an `rgb(r, g, b)` string, or null while loading / on failure.
 *
 * Notes:
 * - Image must be served with CORS (`Access-Control-Allow-Origin`).
 *   Supabase Storage public objects already are.
 * - On CORS failure or load error, returns null so callers can fall back.
 */
export function useDominantColor(src?: string | null): string | null {
  const [colorBySrc, setColorBySrc] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!src) return;
    if (colorBySrc[src]) return; // already sampled

    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      if (cancelled) return;
      try {
        const size = 32; // sample at low res for speed
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0, size, size);
        const { data } = ctx.getImageData(0, 0, size, size);

        let r = 0,
          g = 0,
          b = 0,
          count = 0;
        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3];
          if (alpha < 128) continue; // skip mostly-transparent pixels
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
          count++;
        }
        if (count === 0) return;
        r = Math.round(r / count);
        g = Math.round(g / count);
        b = Math.round(b / count);

        // Boost saturation a touch so dull averages still feel vibrant.
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        if (max - min < 40) {
          // very desaturated — nudge toward the dominant channel
          const boost = 30;
          if (max === r) r = Math.min(255, r + boost);
          else if (max === g) g = Math.min(255, g + boost);
          else b = Math.min(255, b + boost);
        }

        setColorBySrc((prev) =>
          prev[src] ? prev : { ...prev, [src]: `rgb(${r}, ${g}, ${b})` },
        );
      } catch {
        // Tainted canvas (CORS) — silently fall back. No update needed.
      }
    };
    img.onerror = () => {
      // Load failure — leave the cache untouched so caller falls back.
    };
    img.src = src;

    return () => {
      cancelled = true;
    };
  }, [src, colorBySrc]);

  return src ? (colorBySrc[src] ?? null) : null;
}
