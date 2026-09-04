import type { NextFunction, Request, Response } from 'express'
import { CustomError } from '../utils/errors'

const GENERIC_ERROR_MESSAGE = 'An unexpected error occurred!'

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction
): void => {
	const isKnownError = err instanceof CustomError
	const statusCode = isKnownError ? (err as CustomError).statusCode : 500

	// Known errors carry a deliberate, client-safe message (a 404, a rejected
	// payload), so it is returned as-is. Anything else is unexpected and its
	// message may expose internals (a raw database or driver error), so the
	// client always gets a generic message while the real cause is logged
	// below. This holds in every environment, so dev responses never leak.
	const message =
		isKnownError && err.message ? err.message : GENERIC_ERROR_MESSAGE

	// A known error is deliberate and self-explanatory (a 404, a rejected
	// payload), so one line is enough. Anything else is unexpected: log the
	// whole error, stack included, because the response deliberately hides it
	// in production and this is the only record of the root cause left.
	if (isKnownError) {
		console.error(`${err.name}: ${err.message}`)
	} else {
		console.error(err)
	}

	res.status(statusCode).json({
		error: message
	})
}
