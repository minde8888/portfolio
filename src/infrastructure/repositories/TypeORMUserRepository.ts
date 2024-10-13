import { Repository } from "typeorm";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { User } from "../../domain/entities/User";
import { UserEntity } from "../entities/UserEntity";

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
    return userEntities.map(entity => new User(entity.id, entity.email, entity.name));
  }
}
