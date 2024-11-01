import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../utils/Errors/Errors";

import { IDecodedToken } from "../interfaces/IDecodedToken";

import { IAuthService } from './../../domain/services/IAuthService';
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/user/User";
import { Auth } from "../../domain/entities/auth/Auth";

export class JwtAuthService implements IAuthService {

  constructor(private authRepository: IAuthRepository) {

    if (!process.env.JWT_ACCESS_SECRET || !process.env.JWT_REFRESH_SECRET) {
      throw new Error('JWT secrets must be defined in environment variables');
    }
  }

  async validateUser(email: string, password: string): Promise<Auth | null> {
    try {
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        throw new NotFoundError("The email address or password is incorrect. Please retry");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ForbiddenError("The email address or password is incorrect. Please retry");
      }

      return user;
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ForbiddenError) {
        throw error;
      }
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
  }

  async verifyAccessToken(token: string): Promise<IDecodedToken> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET!) as IDecodedToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError();
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError();
      }
      throw new UnauthorizedError();
    }
  }

  async verifyRefreshToken(token: string): Promise<IDecodedToken> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IDecodedToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new UnauthorizedError();
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError();
      }
      throw new UnauthorizedError();
    }
  }
}