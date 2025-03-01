import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import type { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../utils/errors';

export function validateRequest<T extends Record<string, any>>(
  dto: new () => T,
) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dtoInstance = plainToInstance(dto, {
        ...req.query,
        ...req.body,
      });

      const errors = await validate(dtoInstance);

      if (errors.length > 0) {
        const errorMessages = errors
          .map(error => Object.values(error.constraints || {}))
          .flat();
        return next(new ValidationError(errorMessages[0]));
      }

      req.validatedData = dtoInstance as T;
      next();
    } catch (error) {
      next(error);
    }
  };
}
