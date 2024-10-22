import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { IAuthService } from './../../domain/services/IAuthService';
import { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import { Auth } from "../../domain/entities/Auth";
import { AuthError } from "../../utils/Errors/Errors";
import { IDecodedToken } from "../interfaces/IDecodedToken";

export class JwtAuthService implements IAuthService {
  constructor(private authRepository: IAuthRepository) {}

  async validateUser(email: string, password: string): Promise<Auth | null> {
    const user = await this.authRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  generateAccessToken(user: Auth): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_ACCESS_SECRET!,
      { expiresIn: '15m' }
    );
  }

  generateRefreshToken(user: Auth): string {
    return jwt.sign(
      { userId: user.id },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: '7d' }
    );
  }

  async  verifyAccessToken(token: string): Promise<IDecodedToken> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET!, (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            reject(new AuthError('Token has expired'));
          } else {
            reject(new AuthError('Invalid token'));
          }
        } else {
          resolve(decoded as IDecodedToken);
        }
      });
    });
  }

  verifyRefreshToken(token: string): IDecodedToken {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!) as IDecodedToken;
  }
}