import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import { IServerConfig } from '../../../types/ServerConfig';

export function createDataSource(config: IServerConfig = {}): DataSource {
   const options: DataSourceOptions = {
       type: 'postgres',
       host: config.databaseConfig?.host ?? 'localhost',
       port: config.databaseConfig?.port ?? 5432,
       username: config.databaseConfig?.username ?? 'postgres', 
       password: config.databaseConfig?.password ?? 'postgres',
       database: config.databaseConfig?.database ?? 'postgres',
       entities: config.databaseConfig?.entities ?? [path.join(__dirname, '../../entities', '*.{ts,js}')],
       migrations: config.databaseConfig?.migrations ?? [path.join(__dirname, '../migrations', '*.{ts,js}')],
       synchronize: config.databaseConfig?.synchronize ?? false,
       logging: config.databaseConfig?.logging ?? true,
       subscribers: []
   };

   return new DataSource(options);
}

export const AppDataSource = createDataSource();