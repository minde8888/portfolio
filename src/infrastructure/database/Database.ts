import "reflect-metadata";
import "dotenv/config";
import { DataSource } from 'typeorm';
import { IDatabase } from "../interfaces/IDatabase";
import { createDatabaseIfNotExists } from "./utils/createDatabase";
import { AppDataSource } from "./config/AppDataSource";

export class Database implements IDatabase {
  private dataSource: DataSource;

  constructor() {
    this.dataSource = AppDataSource;
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