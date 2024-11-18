import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { IServerConfig } from '../../../types/ServerConfig';

const configPath = path.join(process.cwd(), 'DataSourceOptions.ts');

let customDbConfig: any;
try {
    console.log(`Attempting to load config from: ${configPath}`);
    const imported = require(configPath);
    customDbConfig = imported.DataSourceOptions || imported.default?.DataSourceOptions;
} catch (error) {
    console.error(`Failed to load database configuration from ${configPath}`);
    console.error('Error:', error);
    throw new Error('Database configuration file not found');
}

export function createDataSource(config?: IServerConfig): DataSource {
    const options: DataSourceOptions = {
        type: 'postgres',
        host: config?.databaseConfig?.host ?? customDbConfig.host,
        port: config?.databaseConfig?.port ?? customDbConfig.port,
        username: config?.databaseConfig?.username ?? customDbConfig.username,
        password: config?.databaseConfig?.password ?? customDbConfig.password,
        database: config?.databaseConfig?.database ?? customDbConfig.database,
        entities: config?.databaseConfig?.entities ?? [path.join(__dirname, '../../entities', '*.{ts,js}')],
        migrations: config?.databaseConfig?.migrations ?? [path.join(__dirname, '../migrations', '*.{ts,js}')],
        synchronize: config?.databaseConfig?.synchronize ?? false,
        logging: config?.databaseConfig?.logging ?? true,
        subscribers: []
    };

    return new DataSource(options);
}

export const AppDataSource = createDataSource();
