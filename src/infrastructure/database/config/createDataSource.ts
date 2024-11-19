import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import 'dotenv/config';

import { IServerConfig } from '../../../types/ServerConfig';

export function createDataSource(config?: IServerConfig): DataSource {

    const isDist = __dirname.includes('dist');
    const baseDir = isDist ? path.join(__dirname, '..') : __dirname;

    const entitiesPath = isDist 
    ? [path.join(baseDir, 'entities', '*.js')] // Only .js in production
    : [path.join(baseDir, '../../entities', '*.{ts,js}')];

const migrationsPath = isDist
    ? [path.join(baseDir, 'migrations', '*.js')] // Only .js in production
    : [path.join(baseDir, '../migrations', '*.{ts,js}')];

    const options: DataSourceOptions = {
        type: 'postgres',
        host: config?.databaseConfig?.host ?? process.env.DB_HOST,
        port: config?.databaseConfig?.port ?? parseInt(process.env.DB_PORT || '5432'),
        username: config?.databaseConfig?.username ?? process.env.DB_USERNAME,
        password: config?.databaseConfig?.password ?? process.env.DB_PASSWORD,
        database: config?.databaseConfig?.database ?? process.env.DB_NAME,
        entities: entitiesPath,
        migrations: migrationsPath,
        synchronize: config?.databaseConfig?.synchronize ?? process.env.NODE_ENV === 'development',
        logging: config?.databaseConfig?.logging ?? process.env.DB_LOGGING === 'true',
        subscribers: []
    };
    return new DataSource(options);
}

export const AppDataSource = createDataSource();
