import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';
import 'dotenv/config';

import { IServerConfig } from '../../../types/IServerConfig';

import { AuthEntity } from '../../entities/AuthEntity';
import { UserEntity } from '../../entities/UserEntity';
import { BaseEntity } from '../../entities/BaseEntity';


export function createDataSource(config?: IServerConfig): DataSource {
    const projectRoot = process.cwd();
    const migrationsPath = [path.join(projectRoot, 'dist', 'infrastructure', 'database', 'migrations', '*.ts')];

    const options: DataSourceOptions = {
        type: 'postgres',
        host: config?.databaseConfig?.host ?? process.env.DB_HOST,
        port: config?.databaseConfig?.port ?? parseInt(process.env.DB_PORT || '5432'),
        username: config?.databaseConfig?.username ?? process.env.DB_USERNAME,
        password: config?.databaseConfig?.password ?? process.env.DB_PASSWORD,
        database: config?.databaseConfig?.database ?? process.env.DB_NAME,
        entities: [AuthEntity, UserEntity, BaseEntity],
        migrations: migrationsPath,
        synchronize: config?.databaseConfig?.synchronize ?? process.env.NODE_ENV === 'development',
        logging: true,
        entitySkipConstructor: true
    };
    return new DataSource(options);
}

export const AppDataSource = createDataSource();