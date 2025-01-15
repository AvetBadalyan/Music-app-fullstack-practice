import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Artist } from './src/entities/Artist';
import { Album } from './src/entities/Album';
import { Song } from './src/entities/Song';
import { Genre } from './src/entities/Genre';
import dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [Artist, Album, Song, Genre, 'src/entities/*.ts'],
  migrations: [],
  subscribers: [],
});
