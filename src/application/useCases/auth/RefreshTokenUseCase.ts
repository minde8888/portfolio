import { IDecodedToken } from "../../../infrastructure/interfaces/IDecodedToken";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";
import { IAuthService } from "../../../domain/services/IAuthService";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class RefreshTokenUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) { }

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = this.authService.verifyRefreshToken(refreshToken);
  
      const user = decoded.userId ? await this.userRepository.findById(decoded.userId) : null;

      if (!user || user.refreshToken !== refreshToken) {
        return null;
      }

      const accessToken = this.authService.generateAccessToken(user);
      const newRefreshToken = this.authService.generateRefreshToken(user);

      await this.authRepository.update(user.id, { refreshToken: newRefreshToken });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return null;
    }
  }

  async verityToken(token: string): Promise<IDecodedToken> {
    return await this.authService.verifyAccessToken(token);
  }
}