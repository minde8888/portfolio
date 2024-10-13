import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/useCases/GetUserByIdUseCase";
import { ValidationError } from "../../utils/errors";
import { UpdateUserUseCase } from "../../application/useCases/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/RemoveUserUseCase";

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase
  ) {}

  createUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const { email, name } = req.body;

      if (!email || !name) {
        throw new ValidationError("Email and name are required");
      }

      const user = await this.createUserUseCase.execute(email, name);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      next(error);
    }
  };

  getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new ValidationError("Invalid user ID");
      }

      const user = await this.getUserByIdUseCase.execute(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  updateUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id, 10);
      const { email, name } = req.body;

      const updatedUser = await this.updateUserUseCase.execute(id, {
        email,
        name,
      });
      res.status(200).json(updatedUser);
    } catch (error) {
      next(error);
    }
  };

  removeUser = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const id = parseInt(req.params.id);
      if (isNaN(id)) {
        throw new ValidationError("Invalid user ID");
      }

      const user = await this.removeUserUseCase.execute(id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
