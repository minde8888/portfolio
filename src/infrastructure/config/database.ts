import "reflect-metadata";
import "dotenv/config";
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME ,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [UserEntity],
  migrations: ["src/infrastructure/database/migrations/*.ts"],
  synchronize: false,
  logging: true,
});