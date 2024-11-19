import { Client } from 'pg';

import { DatabaseConnectionOptions } from '../../interfaces/DatabaseConnectionOptions';


export class DatabaseConnection {
  private client: Client | null = null;

  constructor(private options: DatabaseConnectionOptions) {}

  async connect(): Promise<void> {
    this.client = new Client({
      host: this.options.host,
      port: this.options.port,
      user: this.options.username,
      password: this.options.password,
      database: this.options.database,
      connectionTimeoutMillis: this.options.connectionTimeoutMillis
    });

    await this.client.connect();
  }

  async disconnect(): Promise<void> {
    if (this.client) {
      await this.client.end();
      this.client = null;
    }
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (!this.client) {
      throw new Error('Not connected to database');
    }
    return this.client.query(sql, params);
  }

  isConnected(): boolean {
    return this.client !== null;
  }
}