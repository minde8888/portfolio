import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

import { ForbiddenError, NotFoundError, UnauthorizedError } from "../../utils/Errors/Errors";

import { IDecodedToken } from "../interfaces/IDecodedToken";

import { IAuthService } from './../../domain/services/IAuthService';
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { User } from "../../domain/entities/user/User";
import { Auth } from "../../domain/entities/auth/Auth";
import { IJwtConfig } from "../types";

export class JwtAuthService implements IAuthService {
  private readonly jwtConfig: IJwtConfig;

  constructor(
    private readonly authRepository: IAuthRepository,
    config?: IJwtConfig
  ) {
    this.jwtConfig = {
      accessTokenSecret: process.env.JWT_ACCESS_SECRET || 'default-access-secret',
      refreshTokenSecret: process.env.JWT_REFRESH_SECRET || 'default-refresh-secret',
      accessTokenExpiry: '15m',
      refreshTokenExpiry: '7d'
    }
    if (config) {
      this.jwtConfig = {
        ...this.jwtConfig,
        ...config
      };
    }

    this.validateConfiguration();
  }

  private validateConfiguration(): void {
    if (!this.jwtConfig.accessTokenSecret || !this.jwtConfig.refreshTokenSecret) {
      throw new Error('JWT secrets must be defined in environment variables or configuration');
    }
  }

  async validateUser(email: string, password: string): Promise<Auth | null> {
    try {
      const user = await this.authRepository.findByEmail(email);

      if (!user) {
        throw new NotFoundError('The email address or password is incorrect. Please retry');
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new ForbiddenError('The email address or password is incorrect. Please retry');
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
      this.jwtConfig.accessTokenSecret,
      { expiresIn: this.jwtConfig.accessTokenExpiry }
    );
  }

  generateRefreshToken(user: User): string {
    return jwt.sign(
      { userId: user.id },
      this.jwtConfig.refreshTokenSecret,
      { expiresIn: this.jwtConfig.refreshTokenExpiry }
    );
  }

  async verifyAccessToken(token: string): Promise<IDecodedToken> {
    return this.verifyToken(token, this.jwtConfig.accessTokenSecret);
  }

  async verifyRefreshToken(token: string): Promise<IDecodedToken> {
    return this.verifyToken(token, this.jwtConfig.refreshTokenSecret);
  }

  private async verifyToken(token: string, secret: string): Promise<IDecodedToken> {
    try {
      return jwt.verify(token, secret) as IDecodedToken;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError || error instanceof jwt.JsonWebTokenError) {
        throw new UnauthorizedError();
      }
      throw new UnauthorizedError();
    }
  }
}