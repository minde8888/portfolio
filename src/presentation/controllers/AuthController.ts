import { Request, Response } from "express";

import { LoginUseCase } from './../../application/useCases/auth/LoginUseCase';
import { RefreshTokenUseCase } from '../../application/useCases/auth/RefreshTokenUseCase';
import { RegisterUseCase } from "../../application/useCases/auth/RegisterUseCase";

import { IDecodedToken } from "../../infrastructure/interfaces/IDecodedToken";

import { IRegisterRequest } from "../../domain/entities/auth/IRegisterRequest";
import { ILoginRequest } from "../../domain/entities/auth/ILoginRequest";
import { IRefreshTokenRequest } from "../../domain/entities/auth/IRefreshTokenRequest";

export class AuthController {
  constructor(
    private loginUseCase: LoginUseCase,
    private registerUseCase: RegisterUseCase,
    private refreshTokenUseCase: RefreshTokenUseCase
  ) { }

  login = async (req: Request, res: Response) => {
    const { email, password }:ILoginRequest = req.body;
    const result = await this.loginUseCase.execute(email, password);
    res.json(result);
  };

  register = async (req: Request, res: Response) => {
    const { email, name, password }:IRegisterRequest = req.body;
    const result = await this.registerUseCase.execute(email, name, password);
    res.json(result);
  };

  refreshToken = async (req: Request, res: Response) => {
    const { refreshToken }:IRefreshTokenRequest = req.body;
    const result = await this.refreshTokenUseCase.execute(refreshToken);
    res.json(result);
  };

  verifyToken = async (token: string): Promise<IDecodedToken> => {
    return await this.refreshTokenUseCase.verityToken(token);
  }
}
