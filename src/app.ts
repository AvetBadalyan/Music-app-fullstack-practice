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
const clientUrl = process.env.CLIENT_URL;

app.use(
  cors({
    origin: clientUrl ? clientUrl.split(',').map(origin => origin.trim()) : true,
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
