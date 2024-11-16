import { DatabaseConfig } from "../infrastructure/interfaces/IDatabaseConfig";

export interface IServerConfig {
  port: number;
  apiPrefix: string;
  databaseConfig?: DatabaseConfig;
}