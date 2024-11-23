import "reflect-metadata";
import "dotenv/config";
import { DataSource } from 'typeorm';
import { IDatabase } from "../interfaces/IDatabase";
import { createDataSource } from "./config";
import { IServerConfig } from "../../types/IServerConfig";
import { IDatabaseConfig } from "../../types/IDatabaseConfig";
import { DatabaseManager } from "./utils/DatabaseManager";

export class Database implements IDatabase {
  private static instance: Database;
  private dataSource: DataSource;
  private isConnected: boolean = false;
  private readonly databaseManager: DatabaseManager;

  private constructor(config: IServerConfig) {
    this.dataSource = createDataSource(config);
    this.databaseManager = new DatabaseManager(config.databaseConfig as IDatabaseConfig);
  }

  public static getInstance(config?: IServerConfig): Database {
    if (!Database.instance && config) {
      Database.instance = new Database(config);
    }
    return Database.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      console.log("Database already connected");
      return;
    }

    try {
      await this.databaseManager.createDatabaseIfNotExists();

      if (!this.dataSource.isInitialized) {
        await this.dataSource.initialize()
        this.isConnected = true;
        console.log("Database connected and initialized");
      }
    } catch (error) {
      console.error("Error connecting to database:", error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this.isConnected && this.dataSource.isInitialized) {
      await this.dataSource.destroy();
      this.isConnected = false;
      console.log("Database disconnected");
    }
  }

  getDataSource(): DataSource {
    if (!this.isConnected || !this.dataSource.isInitialized) {
      throw new Error("Database not connected. Call connect() first.");
    }
    return this.dataSource;
  }
}