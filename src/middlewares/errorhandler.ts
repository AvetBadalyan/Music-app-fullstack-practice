import type { Request, Response, NextFunction } from 'express'
import { CustomError } from '../utils/errors'

const GENERIC_ERROR_MESSAGE = 'An unexpected error occurred!'

export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const isKnownError = err instanceof CustomError
    const isProduction = process.env.NODE_ENV === 'production'
    const statusCode = isKnownError ? (err as CustomError).statusCode : 500

    // Show err.message for known errors or in development, otherwise show generic message
    const message =
        (isKnownError || !isProduction) && err.message
            ? err.message
            : GENERIC_ERROR_MESSAGE

    console.error(`${err.name || 'Error'}: ${err.message}`)

    res.status(statusCode).json({
        error: message
    })
}
