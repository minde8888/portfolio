import "reflect-metadata";
import express from "express";
import { AppDataSource } from "./infrastructure/config/database";
import { errorHandler } from "./presentation/middlewares/errorHandler";
import userRoutes from "./presentation/routes/userRoutes";
import authRoutes from "./presentation/routes/authRoutes";

const app = express();

app.use(express.json());

const router = express.Router();

userRoutes(router);
authRoutes(router);

app.use("/api/", router);

app.use(errorHandler);

AppDataSource.initialize()
  .then(() => {
    console.log("Database connected");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((error: any) => console.log(error));


