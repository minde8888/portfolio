import { Mapper } from '@automapper/core';

import { IAuthService } from '../../../domain/services/IAuthService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/user/User';

import { UserDTO } from '../../dtos/UserDTO';

import { ForbiddenError, NotFoundError } from '../../../utils/Errors/Errors';

export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private mapper: Mapper
  ) { }

  async execute(email: string, password: string): Promise<{ token: { accessToken: string; refreshToken: string }; userDTO: UserDTO }> {
    try {
      const auth = await this.authService.validateUser(email, password);
      if (!auth) throw new ForbiddenError('Invalid email or password');

      const user = await this.userRepository.findById(auth.id);
      if (!user) throw new NotFoundError('User not found');

      const accessToken = this.authService.generateAccessToken(user);
      const refreshToken = this.authService.generateRefreshToken(user);

      user.refreshToken = refreshToken;
      await this.userRepository.update(user.id, { refreshToken });

      const userDTO = this.mapper.map(user, UserDTO, User);

      return { token: { accessToken, refreshToken }, userDTO };
    } catch (error) {
      throw error;
    }
  }
}
