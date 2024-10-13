import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";
import { GetAllUsersUseCase } from "../../application/useCases/GetAllUsersUseCase";

export class UserController {
  private readonly createUserUseCase: CreateUserUseCase;
  private readonly getAllUsersUseCase: GetAllUsersUseCase;

  constructor(
    createUserUseCase: CreateUserUseCase,
    getAllUsersUseCase: GetAllUsersUseCase
  ) {
    this.createUserUseCase = createUserUseCase;
    this.getAllUsersUseCase = getAllUsersUseCase;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const { email, name } = req.body;

    const user = await this.createUserUseCase.execute(email, name);

    res.status(201).json(user);
  }

  async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.getAllUsersUseCase.execute();
      res.status(200).json(users);
    } catch (error) {
      console.error("Error getting all users:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
