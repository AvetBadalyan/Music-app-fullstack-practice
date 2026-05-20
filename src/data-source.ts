import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Album, Artist, Genre, Song } from './entities';
import { requireEnv } from './utils/env';

import dotenv from 'dotenv';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';
const commonOptions = {
  synchronize: process.env.DB_SYNCHRONIZE === 'true' || !isProduction,
  logging: process.env.DB_LOGGING === 'true' || !isProduction,
  entities: [Artist, Album, Song, Genre],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(process.env.DATABASE_URL ? {
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  ...commonOptions,
} : {
  type: 'postgres',
  host: requireEnv('DB_HOST'),
  port: Number(requireEnv('DB_PORT')),
  username: requireEnv('DB_USERNAME'),
  password: requireEnv('DB_PASSWORD'),
  database: requireEnv('DB_NAME'),
  ssl: isProduction ? { rejectUnauthorized: false } : false,
  ...commonOptions,
});
