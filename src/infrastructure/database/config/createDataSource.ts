import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { IServerConfig } from '../../../types/ServerConfig';

export function createDataSource(config: IServerConfig = {}): DataSource {
    const options: DataSourceOptions = {
        type: 'postgres',
        host: config.databaseConfig?.host ?? process.env.DB_HOST,
        port: config.databaseConfig?.port ?? parseInt(process.env.DB_PORT || '5432'),
        username: config.databaseConfig?.username ?? process.env.DB_USERNAME,
        password: config.databaseConfig?.password ?? process.env.DB_PASSWORD,
        database: config.databaseConfig?.database ?? process.env.DB_NAME,
        entities: config.databaseConfig?.entities ?? [path.join(__dirname, '../../entities', '*.{ts,js}')],
        migrations: config.databaseConfig?.migrations ?? [path.join(__dirname, '../migrations', '*.{ts,js}')],
        synchronize: config.databaseConfig?.synchronize ?? false,
        logging: config.databaseConfig?.logging ?? true,
        subscribers: []
    };

    return new DataSource(options);
}

export const AppDataSource = createDataSource();