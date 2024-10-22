import { Request, Response, NextFunction } from "express";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/useCases/GetUserByIdUseCase";
import { ValidationError } from "../../utils/Errors/Errors";
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

  // createUser = async (
  //   req: Request,
  //   res: Response,
  //   next: NextFunction
  // ): Promise<void> => {
  //   try {
  //     const { email, name } = req.body;

  //     const user = await this.createUserUseCase.execute(email, name);
  //     res.status(201).json(user);
  //   } catch (error) {
  //     next(error);
  //   }
  // };

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

      const user = await this.getUserByIdUseCase.execute(req.params.id);
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

      const { email, name } = req.body;

      const updatedUser = await this.updateUserUseCase.execute(req.params.id, {
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

      const user = await this.removeUserUseCase.execute(req.params.id);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };
}
