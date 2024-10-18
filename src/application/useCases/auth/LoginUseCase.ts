import { IAuthService } from './../../../domain/services/IAuthService';
import { IAuthRepository } from './../../../domain/repositories/IAuthRepository';

export class LoginUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private authService: IAuthService
  ) { }

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    const auth = await this.authService.validateUser(email, password);
    if (auth) {
      const accessToken = this.authService.generateAccessToken(auth);
      const refreshToken = this.authService.generateRefreshToken(auth);
      auth.refreshToken = refreshToken;
      await this.authRepository.update(auth.id, { refreshToken });
      return { accessToken, refreshToken };
    }
    return null;
  }
}