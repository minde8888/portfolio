import { User } from "../entities/User";

export interface IAuthService {
  validateUser(email: string, password: string): Promise<User | null>;
  generateAccessToken(user: User): string;
  generateRefreshToken(user: User): string;
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}