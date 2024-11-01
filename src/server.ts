import "reflect-metadata";
import express from "express";

import { Database } from "./infrastructure/database/Database";

import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";

import { isDeletedMiddleware } from "./presentation/middlewares/deletedEntityMiddleware";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import { IAppError } from "./domain/interfaces/IErrorResponse";

async function bootstrap() {
  const app = express();
  const database = Database.getInstance();

  app.use(express.json());

  const router = express.Router();
  
  // Setup routes
  await userRoutes(router);
  await authRoutes(router);

  app.use("/api/", router);  
  app.use(isDeletedMiddleware);
  app.use(errorMiddleware);

  // Graceful shutdown handling
  const shutdown = async (signal: string) => {
    console.log(`Received ${signal}. Shutting down gracefully...`);
    try {
      await database.disconnect();
      console.log('Database disconnected successfully');
      process.exit(0);
    } catch (error) {
      console.error('Error during shutdown:', error);
      process.exit(1);
    }
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));


  try {
    await database.connect();
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start the application:", error);
    await database.disconnect();
    process.exit(1);
  }
}

// Handle uncaught errors
process.on('uncaughtException', async (error) => {
  console.error("Uncaught exception:", error);
  await Database.getInstance().disconnect();
  process.exit(1);
});

process.on('unhandledRejection', async (error) => {
  console.error("Unhandled rejection:", error);
  await Database.getInstance().disconnect();
  process.exit(1);
});

bootstrap().catch(async (error) => {
  console.error("Bootstrap error:", error);
  await Database.getInstance().disconnect();
  process.exit(1);
});