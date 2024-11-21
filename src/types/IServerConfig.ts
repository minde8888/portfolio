import { IDatabaseConfig } from './IDatabaseConfig';

export interface IServerConfig {
  port: number;
  apiPrefix: string;
  databaseConfig?: IDatabaseConfig;
}