import dotenv from 'dotenv';
import express from 'express';
import { AppDataSource } from './data-source';
import { errorHandler } from './middlewares/errorHandler';
import { songRouter } from './routes/song';
import { artistRouter } from './routes/artist';
import { albumRouter } from './routes/album';
import { DatabaseError } from './utils/errors';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

AppDataSource.initialize()
  .then(() => {
    console.log('Database connected successfully');

    app.use('/api/songs', songRouter);
    app.use('/api/artists', artistRouter);
    app.use('/api/albums', albumRouter);
    app.use(errorHandler);

    app.listen(port, () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch(error => {
    console.error(new DatabaseError('Failed to connect to the database'));
    process.exit(1);
  });
