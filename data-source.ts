import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { Artist } from './src/entities/Artist';
import { Album } from './src/entities/Album';
import { Song } from './src/entities/Song';
import { Genre } from './src/entities/Genre';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'music_app',
  synchronize: true,
  logging: true,
  entities: [Artist, Album, Song, Genre, 'src/entities/*.ts'],
  migrations: [],
  subscribers: [],
});
