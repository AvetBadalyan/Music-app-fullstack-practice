import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { connectToDatabase } from './utils/db';
import { errorHandler } from './middlewares/errorhandler';
import { songRouter } from './routes/song';
import { artistRouter } from './routes/artist';
import { albumRouter } from './routes/album';
import { genreRouter } from './routes/genre';
import { DatabaseError } from './utils/errors';

dotenv.config();

const app = express();

const parseClientOrigins = (clientUrl?: string): string[] | true => {
  const origins = clientUrl
    ?.split(',')
    .map(origin => origin.trim())
    .filter(Boolean)
    .map(origin => {
      try {
        return new URL(origin).origin;
      } catch {
        return origin.replace(/\/+$/, '');
      }
    });

  return origins?.length ? origins : true;
};

app.use(
  cors({
    origin: parseClientOrigins(process.env.CLIENT_URL),
  }),
);
app.use(express.json());

// Service descriptor. Sits above the database middleware with /healthz, so
// both still answer when the database is unreachable.
app.get('/', (_req, res) => {
  res.status(200).json({
    name: 'MusicAvet API',
    status: 'ok',
    endpoints: [
      '/healthz',
      '/api/songs',
      '/api/artists',
      '/api/albums',
      '/api/genres',
    ],
  });
});

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Every route below needs a live connection. This resolves instantly on a
// warm serverless instance and connects on demand the first time it isn't.
app.use(async (_req, _res, next) => {
  try {
    await connectToDatabase();
    next();
  } catch (error) {
    // The only place the real cause is visible - the error handler below sees
    // just the generic DatabaseError.
    console.error('[db] connection failed:', error);
    next(new DatabaseError('Failed to connect to the database'));
  }
});

app.use('/api/songs', songRouter);
app.use('/api/artists', artistRouter);
app.use('/api/albums', albumRouter);
app.use('/api/genres', genreRouter);
app.use(errorHandler);

export default app;
