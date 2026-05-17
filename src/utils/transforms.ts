import { Transform } from 'class-transformer';

/**
 * Normalizes a `multipart/form-data` field that may arrive as either a single
 * scalar (when one value is appended) or an array (when multiple are appended)
 * into a consistent array shape before validation runs.
 *
 * Empty / missing values are preserved as `undefined` so `@IsOptional()` works.
 */
export const ToArray = () =>
  Transform(({ value }) => {
    if (value === undefined || value === null || value === '') return undefined;
    return Array.isArray(value) ? value : [value];
  });
