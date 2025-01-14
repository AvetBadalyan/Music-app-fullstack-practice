import { DataSource } from 'typeorm';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'music_app',
  synchronize: true,
  logging: true,
  entities: ['src/entities/*.ts'],
});

export default AppDataSource;
