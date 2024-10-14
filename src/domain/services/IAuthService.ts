import { User } from "../entities/User";

export interface IAuthService {
    validateUser(email: string, password: string): Promise<User | null>;
    generateToken(user: User): string;
    verifyToken(token: string): any;
  }