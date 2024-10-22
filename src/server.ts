import "reflect-metadata";
import express from "express";
import { Database } from "./infrastructure/database/Database";
import { errorMiddleware } from "./presentation/middlewares/errorMiddleware";
import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";

async function bootstrap() {
  const app = express();
  const database = new Database();

  app.use(express.json());

  const router = express.Router();

  userRoutes(router);
  authRoutes(router);

  app.use("/api/", router);

  app.use(errorMiddleware);

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

bootstrap().catch((error) => {
  console.error("Unhandled error during bootstrap:", error);
  process.exit(1);
});