import express, { Application, Router } from "express";

import { Database } from "./infrastructure/database/Database";

import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";

import { isDeletedMiddleware } from "./presentation/middlewares/deletedEntityMiddleware";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";

import { IServerConfig } from "./types/ServerConfig";
import { IRedis } from "./types/RedisConfig";
import { IJwtConfig } from "./infrastructure/types";

export class Server {
    private app: Application;
    private database: Database;

    constructor(
        private readonly config: IServerConfig,
        private readonly redisConfig: IRedis,
        private readonly tokenConfig?: Partial<IJwtConfig>
    ) {
        this.app = express();
        this.database = Database.getInstance(config);
        this.setupMiddlewares();
        this.setupRoutes(tokenConfig);
        this.redisConfig = redisConfig;
        this.config = config;  
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(isDeletedMiddleware);
    }

    private async setupRoutes(tokenConfig?: Partial<IJwtConfig>,): Promise<void> {

        const redisOn = this.redisConfig.redisOn ?? false;
        const url = this.redisConfig.url ?? 'redis://localhost:6379';

        const router = Router();

        await Promise.all([
            userRoutes(router, tokenConfig, redisOn, url),
            authRoutes(router, tokenConfig)
        ]);

        const normalizedPrefix = this.config.apiPrefix
            .replace(/\/+$/, '')
            .replace(/^(?!\/)/, '/');

        this.app.use(normalizedPrefix, router);
        this.app.use(errorMiddleware);
    }

    async start(): Promise<void> {
        try {
            await this.database.connect();
            this.app.listen(this.config.port, () => {
                console.log(`Server running on port ${this.config.port}`);
            });
        } catch (error) {
            console.error('Failed to start server:', error);
            throw error;
        }
    }

    async shutdown(): Promise<void> {
        try {
            await this.database.disconnect();
            console.log("Database disconnected successfully");
        } catch (error) {
            console.error("Error during shutdown:", error);
        }
    }

    getExpressApp(): Application {
        return this.app;
    }
}
