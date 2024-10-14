import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../domain/services/IAuthService";

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService
  ) {}

  async execute(email: string, password: string): Promise<string | null> {
    const user = await this.authService.validateUser(email, password);
    if (user) {
      return this.authService.generateToken(user);
    }
    return null;
  }
}