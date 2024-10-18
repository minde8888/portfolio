import { IDecodedToken } from "src/infrastructure/interfaces/IDecodedToken";
import { Auth } from "../entities/Auth";

export interface IAuthService {
  validateUser(email: string, password: string): Promise<Auth | null>;
  generateAccessToken(user: Auth): string;
  generateRefreshToken(user: Auth): string;
  verifyAccessToken(token: string): Promise<IDecodedToken>;
  verifyRefreshToken(token: string): IDecodedToken;
}