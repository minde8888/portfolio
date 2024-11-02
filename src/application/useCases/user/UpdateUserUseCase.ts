import { Mapper } from '@automapper/core';
import { validate as uuidValidate } from 'uuid';

import { NotFoundError, ValidationError } from "../../../utils/Errors/Errors";
import { User } from "../../../domain/entities/user/User";
import { Auth } from "../../../domain/entities/auth/Auth";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";

import { UserDTO } from "s../../application/dtos/UserDTO";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly mapper: Mapper
  ) { }

  async execute(id: string, updates: Partial<UserDTO>): Promise<User> {
    this.validateUserId(id);

    const user = await this.getExistingUser(id);

    const userDTO = this.mapper.map(updates, UserDTO, User);

    const updatedUser = await this.userRepository.update(id, userDTO);

    await this.updateAuthRecord(user.email, updates);

    return updatedUser;
  }

  private validateUserId(id: string): void {
    if (!uuidValidate(id)) {
      throw new ValidationError("Invalid user ID format");
    }
  }

  private async getExistingUser(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundError(`User with ID ${id} not found or has been deleted`);
    }
    return user;
  }

  private async updateAuthRecord(userEmail: string, updates: Partial<UserDTO>): Promise<void> {
    const { email, name } = updates;
    if (email === undefined && name === undefined) return;

    const existingAuth: Auth | null = await this.authRepository.findByEmail(userEmail);
    if (!existingAuth) {
      throw new NotFoundError(`Auth record for user ID ${existingAuth} not found`);
    }

    if (email) existingAuth.email = email;
    if (name) existingAuth.name = name;

    await this.authRepository.update(existingAuth.id, existingAuth);
  }
}
