import { Request, Response } from "express";
import { CreateUserUseCase } from "../../application/useCases/CreateUserUseCase";

export class UserController {
  private readonly createUserUseCase_: CreateUserUseCase;

  constructor(createUserUseCase: CreateUserUseCase) {
    this.createUserUseCase_ = createUserUseCase;
  }

  async createUser(req: Request, res: Response): Promise<void> {
    const { email, name } = req.body;

    const user = await this.createUserUseCase_.execute(email, name);

    res.status(201).json(user);
  }
}
