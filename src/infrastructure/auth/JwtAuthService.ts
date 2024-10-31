import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { AuthError } from "../../utils/Errors/Errors";

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
    
    const user = await this.authRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
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
        throw new AuthError('Token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid token');
      }
      throw new AuthError('Token verification failed');
    }
  }

  async verifyRefreshToken(token: string): Promise<IDecodedToken> {
    try {
      const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IDecodedToken;
      return decoded;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new AuthError('Refresh token has expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new AuthError('Invalid refresh token');
      }
      throw new AuthError('Refresh token verification failed');
    }
  }
}