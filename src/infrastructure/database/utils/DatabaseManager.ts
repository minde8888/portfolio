import { DatabaseConfig } from "../../../infrastructure/interfaces/IDatabaseConfig";
import { DatabaseConnection } from "./DatabaseConnection";

export class DatabaseManager {
    private static readonly POSTGRES_DB = 'postgres';
    private static readonly CONNECTION_DELAY = 1000;
  
    constructor(private config: DatabaseConfig) {}
  
    async createDatabaseIfNotExists(): Promise<void> {
      const adminConnection = new DatabaseConnection({
        host: this.config.host ?? 'localhost',
        port: this.config.port ?? 5432,
        username: this.config.username ?? 'postgres',
        password: this.config.password ?? 'admin',
        database: DatabaseManager.POSTGRES_DB
      });
  
      try {
        await adminConnection.connect();
        await this.ensureDatabaseExists(adminConnection);
        await this.ensureDatabaseAccessible(adminConnection);
      } finally {
        await adminConnection.disconnect();
      }
  
      await this.verifyTargetConnection();
    }
  
    private async ensureDatabaseExists(connection: DatabaseConnection): Promise<void> {
      const result = await connection.query(
        'SELECT datname, datallowconn FROM pg_database WHERE datname = $1',
        [this.config.database]
      );
  
      if (result.rowCount === 0) {
        console.log(`Creating database ${this.config.database}...`);
        await connection.query(`CREATE DATABASE "${this.config.database}"`);
        console.log(`Database ${this.config.database} created successfully.`);
      } else {
        console.log(`Database ${this.config.database} already exists.`);
      }
    }
  
    private async ensureDatabaseAccessible(connection: DatabaseConnection): Promise<void> {
      const result = await connection.query(
        'SELECT datallowconn FROM pg_database WHERE datname = $1',
        [this.config.database]
      );
  
      if (result.rowCount > 0 && !result.rows[0].datallowconn) {
        console.log('Fixing database connection permissions...');
        await connection.query(
          'UPDATE pg_database SET datallowconn = true WHERE datname = $1',
          [this.config.database]
        );
      }
    }
  
    private async verifyTargetConnection(): Promise<void> {
      await new Promise(resolve => setTimeout(resolve, DatabaseManager.CONNECTION_DELAY));
  
      const targetConnection = new DatabaseConnection({
        host: this.config.host ?? 'localhost',
        port: this.config.port ?? 5432,
        username: this.config.username ?? 'postgres',
        password: this.config.password ?? 'admin',
        database: this.config.database,
        connectionTimeoutMillis: 5000
      });
  
      try {
        await targetConnection.connect();
        console.log(`Successfully connected to ${this.config.database} database`);
      } finally {
        await targetConnection.disconnect();
      }
    }
  }