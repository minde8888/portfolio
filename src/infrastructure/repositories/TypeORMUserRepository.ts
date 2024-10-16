import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserEntity } from "../entities/UserEntity";
import { UserNotFoundError, UserUpdateError } from "../../utils/Errors";

export class TypeORMUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findById(id: number): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { id } });
    return userEntity ? userEntity.toDomain() : null;
  }
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.repository.findOne({ where: { email } });
    return userEntity ? userEntity.toDomain() : null;
  }

  async create(user: Omit<User, "id" | "createdAt" | "updatedAt">): Promise<User> {
    const userEntity = UserEntity.fromDomain(new User(0, user.email, user.name, user.password, user.role, null, new Date(), new Date()));
    const savedEntity = await this.repository.save(userEntity);
    return savedEntity.toDomain();
  }

  async update(id: number, userData: Partial<User>): Promise<User> {
    await this.repository.update(id, UserEntity.fromDomain({ ...new User(id, "", "", "", "", null, new Date(), new Date()), ...userData }));
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

  // async remove(id: number): Promise<void> {
  //   const result = await this.repository.delete(id);
  //   if (result.affected === 0) {
  //     throw new UserNotFoundError(`User with id ${id} not found`);
  //   }
  // }
}
