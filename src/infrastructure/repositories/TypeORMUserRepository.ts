import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserEntity } from "../entities/UserEntity";
import { UserNotFoundError, UserUpdateError } from "../../utils/errors";

export class TypeORMUserRepository implements IUserRepository {
  constructor(private readonly repository: Repository<UserEntity>) {}

  async findById(id: number): Promise<User | undefined> {
    const userEntity = await this.repository.findOne({ where: { id } });
    if (!userEntity) return undefined;
    return new User(userEntity.id, userEntity.email, userEntity.name);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    const userEntity = await this.repository.findOne({ where: { email } });
    if (!userEntity) return undefined;
    return new User(userEntity.id, userEntity.email, userEntity.name);
  }

  async save(user: User): Promise<User> {
    const userEntity = this.repository.create({
      email: user.email,
      name: user.name,
    });
    const savedEntity = await this.repository.save(userEntity);
    return new User(savedEntity.id, savedEntity.email, savedEntity.name);
  }

  async getAll(): Promise<User[]> {
    const userEntities = await this.repository.find();
    return userEntities.map(
      (entity) => new User(entity.id, entity.email, entity.name)
    );
  }

  async update(user: User): Promise<User> {
    const existingUserEntity = await this.repository.findOne({
      where: { id: user.id },
    });

    if (!existingUserEntity) throw new UserUpdateError();

    existingUserEntity.email = user.email;
    existingUserEntity.name = user.name;

    const updatedEntity = await this.repository.save(existingUserEntity);

    return new User(updatedEntity.id, updatedEntity.email, updatedEntity.name);
  }

  async remove(id: number): Promise<void> {
    const result = await this.repository.delete(id);
    if (result.affected === 0) {
      throw new UserNotFoundError(`User with id ${id} not found`);
    }
  }
}
