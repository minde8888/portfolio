import { Mapper } from '@automapper/core';
import { validate as uuidValidate } from 'uuid';

import { User } from "../../../domain/entities/user/User";
import { Auth } from "../../../domain/entities/auth/Auth";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthRepository } from "../../../domain/repositories/IAuthRepository";

import { UserDTO } from '../../dtos/user/UserDTO';
import { UpdateUserDTO } from "../../dtos/user/UpdateUserDTO";

import { NotFoundError, ValidationError } from "../../../utils/Errors/Errors";

export class UpdateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly authRepository: IAuthRepository,
    private readonly mapper: Mapper
  ) {}

  async execute(id: string, updates: Partial<UpdateUserDTO>): Promise<UserDTO> {
    this.ensureValidUserId(id);

    const user = await this.getUserOrThrow(id);
    await this.ensureEmailIsUnique(updates.email, id);

    const updatedUser = await this.updateUserEntity(id, user, updates);
    await this.updateAuthRecord(user.email, updates);

    return this.mapper.map(updatedUser, User, UserDTO);
  }

  private ensureValidUserId(id: string): void {
    if (!uuidValidate(id)) {
      throw new ValidationError("Invalid user ID format");
    }
  }

  private async getUserOrThrow(id: string): Promise<User> {
    const user = await this.userRepository.findById(id);
    if (!user || user.isDeleted) {
      throw new NotFoundError(`User with ID ${id} not found or has been deleted`);
    }
    return user;
  }

  private async ensureEmailIsUnique(newEmail?: string, currentUserId?: string): Promise<void> {
    if (!newEmail) return;

    const existingUser = await this.userRepository.findByEmail(newEmail);
    if (existingUser && existingUser.id !== currentUserId) {
      throw new ValidationError(`Email ${newEmail} is already in use by another user`);
    }
  }

  private async updateUserEntity(id: string, user: User, updates: Partial<UpdateUserDTO>): Promise<User> {
    const userUpdates = this.mapper.map(updates, UpdateUserDTO, User);
    userUpdates.createdAt = user.createdAt; 

    return this.userRepository.update(id, userUpdates);
  }

  private async updateAuthRecord(userEmail: string, updates: Partial<UpdateUserDTO>): Promise<void> {
    const { email, name, password } = updates;
    if (!email && !name && !password) return; 

    const authRecord = await this.authRepository.findByEmail(userEmail);
    if (!authRecord) {
      throw new NotFoundError(`Auth record for email ${userEmail} not found`);
    }

    Object.assign(authRecord, { email, name, password });
    await this.authRepository.update(authRecord.id, authRecord);
  }
}
