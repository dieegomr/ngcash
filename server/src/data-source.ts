const dotenvt = require('dotenv');
import process from 'process';
import 'reflect-metadata';
import { DataSource } from 'typeorm';

dotenvt.config({
  path: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.production',
});

const port = process.env.DB_PORT as number | undefined;

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true,
  logging: true,
  entities: [process.env.TYPEORM_ENTITIES as string],
  subscribers: [],
  migrations: [process.env.TYPEORM_MIGRATION as string],
});
