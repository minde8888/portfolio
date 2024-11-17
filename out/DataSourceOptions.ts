import { PostgresConnectionOptions } from "typeorm/driver/postgres/PostgresConnectionOptions";

export const DataSourceOptions: PostgresConnectionOptions = {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'admin',
    database: process.env.DB_DATABASE || 'test',  
    synchronize: false,
    logging: true,
    subscribers: []
};