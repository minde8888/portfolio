import "reflect-metadata";
import express from "express";
import { Database } from "./infrastructure/database/Database";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";

async function bootstrap() {
  const app = express();
  const database = Database.getInstance();

  app.use(express.json());

  const router = express.Router();
  
  // Setup routes
  await userRoutes(router);
  await authRoutes(router);

  app.use("/api/", router);
  app.use(errorMiddleware);

  // Graceful shutdown handling
  const shutdown = async () => {
    console.log('Shutting down gracefully...');
    await database.disconnect();
    process.exit(0);
  };

  process.on('SIGTERM', shutdown);
  process.on('SIGINT', shutdown);

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