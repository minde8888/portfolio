export interface DatabaseConfig {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    database?: string;
    logging?: boolean;
    synchronize?: boolean;
    entities?: string[];
    migrations?: string[];
   }