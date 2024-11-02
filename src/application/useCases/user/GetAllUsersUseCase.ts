import { Mapper } from '@automapper/core';

import { UserDTO } from "../../dtos/user/UserDTO";
import { User } from "../../../domain/entities/user/User";

import { IUserRepository } from "../../../domain/repositories/IUserRepository";

export class GetAllUsersUseCase {
  constructor(
    private userRepository: IUserRepository,
    private mapper: Mapper) { }

  async execute(): Promise<UserDTO[] | undefined> {
    try {
      const users = await this.userRepository.getAll();

      const userDTOs = this.mapper.mapArray(users, User, UserDTO);

      return userDTOs;
    } catch (error) {
      throw error;
    }
  }
}
