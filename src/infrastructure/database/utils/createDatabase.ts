import { Client } from 'pg';
import { DatabaseConfig } from '../../../infrastructure/interfaces/IDatabaseConfig';
import { RunMigrationsForceCommand } from '../../../infrastructure/cli/commands/RunMigrationsForceCommand';

export async function createDatabaseIfNotExists(
  config: DatabaseConfig
): Promise<void> {
  let initialClient: Client | null = null;
  let targetClient: Client | null = null;

  try {
    // First connect to postgres database
    initialClient = new Client({
      host: config.host ?? 'localhost',
      port: config.port ?? 5432,
      user: config.username ?? 'postgres',
      password: config.password ?? 'admin',
      database: 'postgres'
    });

    await initialClient.connect();
    console.log('Connected to postgres database');

    // Check if database exists and its status
    const result = await initialClient.query(
      `SELECT datname, datallowconn 
       FROM pg_database 
       WHERE datname = $1`,
      [config.database]
    );

    if (result.rowCount === 0) {
      console.log(`Creating database ${config.database}...`);
      await initialClient.query(`CREATE DATABASE "${config.database}"`);
      console.log(`Database ${config.database} created successfully.`);
    } else {
      console.log(`Database ${config.database} already exists.`);
      
      // If database exists but connections are not allowed, try to fix it
      if (!result.rows[0].datallowconn) {
        console.log('Database exists but connections are not allowed. Attempting to fix...');
        await initialClient.query(`
          UPDATE pg_database 
          SET datallowconn = true 
          WHERE datname = $1
        `, [config.database]);
      }
    }

    // Close postgres connection before connecting to target database
    await initialClient.end();
    initialClient = null;

    // Add a small delay to ensure the database is ready
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Try to connect to the target database
    targetClient = new Client({
      host: config.host ?? 'localhost',
      port: config.port ?? 5432,
      user: config.username ?? 'postgres',
      password: config.password ?? 'admin',
      database: config.database,
      // Add connection timeout
      connectionTimeoutMillis: 5000
    });

    await targetClient.connect();
    console.log(`Successfully connected to ${config.database} database`);

    // Run migrations
    await RunMigrationsForceCommand.execute();
    console.log('Migrations completed successfully');

  } catch (error) {
    if (error instanceof Error) {
      console.error('Database operation failed:', {
        message: error.message,
        name: error.name,
        ...(error as any)
      });
    } else {
      console.error('Unknown error occurred:', error);
    }
    throw error;
  } finally {
    // Clean up connections
    if (initialClient) {
      try {
        await initialClient.end();
      } catch (endError) {
        console.error('Error closing initial connection:', endError);
      }
    }
    if (targetClient) {
      try {
        await targetClient.end();
      } catch (endError) {
        console.error('Error closing target connection:', endError);
      }
    }
  }
}