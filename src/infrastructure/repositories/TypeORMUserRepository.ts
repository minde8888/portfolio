import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserEntity } from "../entities/UserEntity";
import { UserNotFoundError, UserUpdateError } from "../../utils/Errors";
import { HttpStatus } from '@nestjs/common';


export class TypeORMUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) { }
  getAll(): Promise<User[] | undefined> {
    throw new Error("Method not implemented.");
  }
  // remove(id: number): Promise<void> {
  //   throw new Error("Method not implemented.");
  // }

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? userEntity.toDomain() : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? userEntity.toDomain() : null;
  }

  async create(user: User): Promise<{ status: number; error?: string }> {
    try {
      const existingUser = await this.repository.findOne({ where: { email: user.email } });
      if (existingUser) {
        return { status: 409, error: 'User with this email already exists' };
      }

      const userEntity = UserEntity.fromDomain(user);
      const savedEntity = await this.repository.save(userEntity);
      const savedUser = savedEntity.toDomain();
      return { status: 201 };
    } catch (error) {
      console.error('Error creating user:', error);
      return { status: 500, error: 'Failed to create user' };
    }
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, UserEntity.fromDomain({ ...new User(id, "", "", ""), ...userData }));
    const updatedEntity = await this.repository.findOne({ where: { id } });
    if (!updatedEntity) {
      throw new Error("User not found after update");
    }
    return updatedEntity.toDomain();
  }

  // async getAll(): Promise<User[]> {
  //   const userEntities = await this.repository.find();
  //   return userEntities.map(
  //     (entity) => new User(entity.id, entity.email, entity.name)
  //   );
  // }

  // async update(user: User): Promise<User> {
  //   const existingUserEntity = await this.repository.findOne({
  //     where: { id: user.id },
  //   });

  //   if (!existingUserEntity) throw new UserUpdateError();

  //   existingUserEntity.email = user.email;
  //   existingUserEntity.name = user.name;

  //   const updatedEntity = await this.repository.save(existingUserEntity);

  //   return new User(updatedEntity.id, updatedEntity.email, updatedEntity.name);
  // }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }
  }
}
