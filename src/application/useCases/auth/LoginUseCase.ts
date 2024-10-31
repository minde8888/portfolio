import { Mapper } from '@automapper/core';
import { IAuthService } from '../../../domain/services/IAuthService';
import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserDTO } from '../../dtos/UserDTO';
import { User } from '../../../domain/entities/user/User';
import { UserNotFoundError } from '../../../utils/Errors/Errors';


export class LoginUseCase {
  constructor(
    private userRepository: IUserRepository,
    private authService: IAuthService,
    private mapper: Mapper
  ) {}

  async execute(email: string, password: string): Promise<{ token: { accessToken: string; refreshToken: string }; userDTO: UserDTO }> {
    const auth = await this.authService.validateUser(email, password);

    if (!auth) {
      throw new UserNotFoundError('User validation failed');
    }

    const user = await this.userRepository.findById(auth.id);
    if (!user) {
      throw new UserNotFoundError('User not found');
    }

    const accessToken = this.authService.generateAccessToken(user);
    const refreshToken = this.authService.generateRefreshToken(user);

    user.refreshToken = refreshToken;
    await this.userRepository.update(user.id, { refreshToken });

    const userDTO = this.mapper.map(user, UserDTO, User);

    console.log({ 
      token: { accessToken, refreshToken },
      userDTO 
    });
    

    return { 
      token: { accessToken, refreshToken },
      userDTO 
    };
  }
}
