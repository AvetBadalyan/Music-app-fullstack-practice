import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorhandler';
import { songRouter } from './routes/song';
import { artistRouter } from './routes/artist';
import { albumRouter } from './routes/album';
import { genreRouter } from './routes/genre';
import { DatabaseError } from './utils/errors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

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

app.get('/healthz', (_req, res) => {
  res.status(200).json({ status: 'ok' });
});

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    app.use('/api/songs', songRouter);
    app.use('/api/artists', artistRouter);
    app.use('/api/albums', albumRouter);
    app.use('/api/genres', genreRouter);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error(new DatabaseError('Failed to connect to the database'));
    console.error(error);
    process.exit(1);
  });
