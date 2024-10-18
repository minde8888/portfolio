import { Client } from 'pg';

export async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: 'postgres', 
  });

  try {
    await client.connect();
    const dbName = process.env.DB_NAME;
    const result = await client.query(`SELECT 1 FROM pg_database WHERE datname='${dbName}'`);
    if (result.rowCount === 0) {
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created.`);
    } else {
      console.log(`Database ${dbName} already exists.`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}