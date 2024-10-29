import { validate as uuidValidate } from 'uuid';
import { Mapper } from '@automapper/core';

import { UserNotFoundError, ValidationError } from "../../../utils/Errors/Errors";
import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICacheService } from "../../../domain/services/ICacheService";
import { UserDTO } from '../../../application/dtos/UserDTO';

export class GetUserByIdUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: ICacheService,
    private mapper: Mapper
  ) { }

  async execute(id: string): Promise<User> {

    if (!uuidValidate(id)) {
      throw new ValidationError("Invalid user ID");
    }
    
    const cacheKey = `user:${id}`;
    const cachedUser = await this.cacheService.get(cacheKey);

    if (cachedUser) {
      return JSON.parse(cachedUser);
    }

    const user = await this.userRepository.findById(id);
    
    if (!user) {
      throw new UserNotFoundError();
    }

    const userDTO = this.mapper.map(user, UserDTO, User);

    await this.cacheService.set(cacheKey, JSON.stringify(userDTO), 3600);

    return userDTO;
  }
}
