import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

const uuidRegex =
  /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/;

export const validateId = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const { id } = req.params;

  if (!uuidRegex.test(id)) {
    return next(new ValidationError('Invalid ID format'));
  }

  next();
};
