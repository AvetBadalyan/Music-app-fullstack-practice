import type { Request, Response, NextFunction } from 'express';
import { CustomError } from '../utils/errors';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const isKnownError = err instanceof CustomError;
  const statusCode = isKnownError ? (err as CustomError).statusCode : 500;
  const message = isKnownError ? err.message : 'An unexpected error occurred!';

  console.error(`${err.name || 'Error'}: ${err.message}`);

  res.status(statusCode).json({
    error: message,
  });
};
