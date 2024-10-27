import { Repository } from "typeorm";
import { HttpStatus } from '@nestjs/common';

import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";

import { EmailAlreadyExistsError, UserNotFoundError, UserUpdateError } from "../../utils/Errors/Errors";

import { UserEntity } from "../entities/UserEntity";

export class TypeORMUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) { }

  async create(user: User): Promise<{ status: number; error?: string }> {
    try {
      const existingUser = await this.repository.findOne({ where: { email: user.email } });
      if (existingUser) {
        throw new EmailAlreadyExistsError();
      }

      const userEntity = UserEntity.fromDomain(user);
      await this.repository.save(userEntity);

      return { status: HttpStatus.CREATED };
    } catch (error) {

      throw error;
    }
  }

  async findById(id: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) throw new UserNotFoundError(`User with id ${id} not found`); 

    return userEntity.toDomain();
  }

  async getAll(): Promise<User[] | undefined> {
    const userEntities = await this.repository.find({ 
      where: { isDeleted: false } 
    });

    return userEntities.map(entity => entity.toDomain());
  }

  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    if (!userEntity) throw new UserNotFoundError(`User with email ${email} not found`);
    
    return userEntity.toDomain();
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }

    try {
      const updatedData = { ...userEntity, ...userData };
      await this.repository.save(UserEntity.fromDomain(updatedData));
      const updatedEntity = await this.repository.findOne({ where: { id } });
      if (!updatedEntity) {
        throw new UserUpdateError('User not found after update');
      }

      return updatedEntity.toDomain();
    } catch (error) {

      throw new UserUpdateError('Failed to update user');
    }
  }

  async remove(id: string): Promise<{ status: number; error?: string }> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }

    try {
      userEntity.isDeleted = true;
      await this.repository.save(userEntity);
      
      return { status: HttpStatus.OK };
    } catch (error) {
      throw error;
    }
  }
}
