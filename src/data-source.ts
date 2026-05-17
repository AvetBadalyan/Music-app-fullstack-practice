import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Album, Artist, Genre, Song } from './entities';
import { requireEnv } from './utils/env';

import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: Number(requireEnv('DB_PORT')),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),
  synchronize: true,
  logging: true,
  entities: [Artist, Album, Song, Genre],
  migrations: [],
  subscribers: [],
});
