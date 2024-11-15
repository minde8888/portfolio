import express, { Application, Router } from "express";
import { Database } from "./infrastructure/database/Database";
import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";
import { isDeletedMiddleware } from "./presentation/middlewares/deletedEntityMiddleware";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import { IServerConfig } from "./types/ServerConfig";

export class Server {
    private app: Application;
    private database: Database;

    constructor(private config: IServerConfig = {}) {
        this.app = express();
        this.database = Database.getInstance(config);
        this.setupMiddlewares();
        this.setupRoutes();
    }

    private setupMiddlewares(): void {
        this.app.use(express.json());
        this.app.use(isDeletedMiddleware);
    }

    private async setupRoutes(): Promise<void> {
        const router = Router();
        await userRoutes(router);
        await authRoutes(router);
        this.app.use(this.config.apiPrefix || "/api", router);
        this.app.use(errorMiddleware);
    }

    async start(): Promise<void> {
        await this.database.connect();
        const port = this.config.port || 3000;
        this.app.listen(port, () => console.log(`Server listening on port ${port}`));
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
