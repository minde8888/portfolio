import { Request, Response, NextFunction } from "express";
import { GetAllUsersUseCase } from "../../application/useCases/user/GetAllUsersUseCase";
import { GetUserByIdUseCase } from "../../application/useCases/user/GetUserByIdUseCase";
import { UpdateUserUseCase } from "../../application/useCases/user/UpdateUserUseCase";
import { RemoveUserUseCase } from "../../application/useCases/user/RemoveUserUseCase";
import { UserDTO } from "src/application/dtos/UserDTO";

export class UserController {
  constructor(
    private readonly getAllUsersUseCase: GetAllUsersUseCase,
    private readonly getUserByIdUseCase: GetUserByIdUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly removeUserUseCase: RemoveUserUseCase
  ) { }

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
      const updates: Partial<UserDTO> = {
        email: req.body.email,
        name: req.body.name,
        role: req.body.role,
      };

      const updatedUser = await this.updateUserUseCase.execute(req.params.id,  updates );
      
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
