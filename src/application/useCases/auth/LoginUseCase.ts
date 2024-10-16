import { IAuthService } from './../../../domain/services/IAuthService';
import { IUserRepository } from './../../../domain/repositories/IUserRepository';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const user = await this.authService.validateUser(email, password);
    if (user) {
      const accessToken = this.authService.generateAccessToken(user);
      const refreshToken = this.authService.generateRefreshToken(user);
      user.refreshToken = refreshToken;
      await this.userRepository.update(user.id, { refreshToken });
      return { accessToken, refreshToken };
    }
    return null;
  }
}