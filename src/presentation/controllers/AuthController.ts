import { Request, Response } from "express";
import { LoginUseCase } from "../../../application/use-cases/LoginUseCase";
import { RegisterUseCase } from "../../../application/use-cases/RegisterUseCase";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase
  ) {}

  login = async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const token = await this.loginUseCase.execute(email, password);
    if (token) {
      res.json({ token });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  };

  register = async (req: Request, res: Response) => {
    const { email, password, role } = req.body;
    const userId = await this.registerUseCase.execute(email, password, role);
    res.status(201).json({ message: "User created successfully", userId });
  };
}