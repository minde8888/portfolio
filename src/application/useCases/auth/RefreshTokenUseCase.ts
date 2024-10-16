import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../domain/services/IAuthService";

export class RefreshTokenUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(refreshToken: string): Promise<{ accessToken: string; refreshToken: string } | null> {
    try {
      const decoded = this.authService.verifyRefreshToken(refreshToken);
      const user = await this.userRepository.findById(decoded.userId);
      
      if (!user || user.refreshToken !== refreshToken) {
        return null;
      }

      const accessToken = this.authService.generateAccessToken(user);
      const newRefreshToken = this.authService.generateRefreshToken(user);
      
      await this.userRepository.update(user.id, { refreshToken: newRefreshToken });
      
      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      return null;
    }
  }
}