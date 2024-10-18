import { IDecodedToken } from "../../../infrastructure/interfaces/IDecodedToken";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";
import { IAuthService } from "../../../domain/services/IAuthService";

export class RefreshTokenUseCase {
  constructor(
    private authRepository: IAuthRepository,
    private authService: IAuthService
  ) { }

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = this.authService.verifyRefreshToken(refreshToken);
  
      const user = decoded.userId ? await this.authRepository.findById(parseInt(decoded.userId)) : null;

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