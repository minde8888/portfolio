import { validate as uuidValidate } from 'uuid';
import { Mapper } from '@automapper/core';

import { User } from "../../../domain/entities/user/User";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { ICacheService } from "../../../domain/services/ICacheService";

import { UserDTO } from '../../dtos/user/UserDTO';

import { NotFoundError, ValidationError } from "../../../utils/Errors/Errors";

export class GetUserByIdUseCase {
  constructor(
    private userRepository: IUserRepository,
    private cacheService: ICacheService,
    private mapper: Mapper
  ) { }

  async execute(id: string): Promise<UserDTO> {
    if (!uuidValidate(id)) {
      throw new ValidationError("Invalid user ID");
    }

    try {

      const cacheKey = `user:${id}`;
      const cachedUser = await this.cacheService.get(cacheKey);

      if (cachedUser) {
        return JSON.parse(cachedUser);
      }

      const user = await this.userRepository.findById(id);

      if (!user) {
        throw new NotFoundError("User dose not exist");
      }

      const userDTO = this.mapper.map(user, User, UserDTO);

      await this.cacheService.set(cacheKey, JSON.stringify(userDTO), 3600);

      return userDTO;

    } catch (error) {
      throw error;
    }
  }
}
