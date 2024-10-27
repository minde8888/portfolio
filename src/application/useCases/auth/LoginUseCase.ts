import { Mapper } from '@automapper/core';

import { IAuthService } from '../../../domain/services/IAuthService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../../application/dtos/UserDTO';
import { User } from '../../../domain/entities/User';
import { UserNotFoundError } from '../../../utils/Errors/Errors';
import { IAuthRepository } from '../../../domain/repositories/IAuthRepository';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private mapper: Mapper
  ) { }

  async execute(email: string, password: string): Promise<{ accessToken: string; refreshToken: string, userDTO: UserDTO } | null> {
    const auth = await this.authService.validateUser(email, password);
    

    if (auth) {
      const user = await this.userRepository.findById(auth.id)

      if (!user) {
        throw new UserNotFoundError;
      }

      const accessToken = this.authService.generateAccessToken(user);
      const refreshToken = this.authService.generateRefreshToken(user);
      
      user.refreshToken = refreshToken;
      await this.userRepository.update(user.id, { refreshToken });

      const userDTO = this.mapper.map(user, UserDTO, User);

      return { accessToken, refreshToken, userDTO };
    }
    return null;
  }
}