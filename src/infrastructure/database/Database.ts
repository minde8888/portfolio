import "reflect-metadata";
import "dotenv/config";
import { DataSource } from 'typeorm';
import { UserEntity } from '../entities/UserEntity';
import { IDatabase } from "../interfaces/IDatabase";
import { AuthEntity } from "../entities/AuthEntity";
import { createDatabaseIfNotExists } from "./utils/createDatabase";

export class Database implements IDatabase {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [AuthEntity, UserEntity],
      migrations: ["src/infrastructure/database/migrations/*.ts"],
      synchronize: false,
      logging: true,
    });
  }

  async connect(): Promise<void> {
    await createDatabaseIfNotExists();
    await this.dataSource.initialize();
    console.log("Database connected and initialized");
  }

  async disconnect(): Promise<void> {
    await this.dataSource.destroy();
    console.log("Database disconnected");
  }

  getDataSource(): DataSource {
    return this.dataSource;
  }
}