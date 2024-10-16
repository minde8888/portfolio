import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { User } from "../../domain/entities/User";
import { IAuthService } from './../../domain/services/IAuthService';
import { IUserRepository } from './../../domain/repositories/IUserRepository';

export class JwtAuthService implements IAuthService {
  constructor(private userRepository: IUserRepository) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.userRepository.findByEmail(email);
    if (user && await bcrypt.compare(password, user.password)) {
      return user;
    }
    return null;
  }

  generateAccessToken(user: User): string {
    return jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
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

  verifyAccessToken(token: string): any {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  }

  verifyRefreshToken(token: string): any {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }
}