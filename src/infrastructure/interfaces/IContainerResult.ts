
import { AuthController } from "../../presentation/controllers/AuthController";
import { UserController } from "../../presentation/controllers/UserController";

export interface IContainerResult {
    userController: UserController;
    authController: AuthController;
  }