import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import artistRoutes from './routes/artistRoutes';
import albumRoutes from './routes/albumRoutes';
import songRoutes from './routes/songRoutes';
import genreRoutes from './routes/genreRoutes';

const app: Application = express();

app.use(cors());
app.use(bodyParser.json());

app.use('/api/artists', artistRoutes);
app.use('/api/albums', albumRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/genres', genreRoutes);

export default app;
