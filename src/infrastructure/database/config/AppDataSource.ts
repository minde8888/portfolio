import "reflect-metadata";
import "dotenv/config";
import { DataSource } from 'typeorm';
import path from 'path';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [path.join(__dirname, '../../entities', '*.ts')],
    migrations: [path.join(__dirname, '../migrations','*.ts')],
    synchronize: false,
    logging: true,
    subscribers: [],
});
