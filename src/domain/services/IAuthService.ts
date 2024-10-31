import { IDecodedToken } from "src/infrastructure/interfaces/IDecodedToken";
import { Auth } from "../entities/Auth";
import { User } from "../entities/user/User";

export interface IAuthService {
  validateUser(email: string, password: string): Promise<Auth | null>;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
  verifyAccessToken(token: string): Promise<IDecodedToken>;
  verifyRefreshToken(token: string): IDecodedToken;
}