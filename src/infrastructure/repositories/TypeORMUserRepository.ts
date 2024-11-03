import { Repository } from "typeorm";

import { User } from "../../domain/entities/user/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";

import { UserEntity } from "../entities/UserEntity";

import { BaseRepository } from "./BaseRepository";

import { EmailAlreadyExistsError } from "../../utils/Errors/Errors";

export class TypeORMUserRepository extends BaseRepository<UserEntity, User> implements IUserRepository {
    constructor(repository: Repository<UserEntity>) {
        super(repository);
    }

    async findByEmail(email: string): Promise<User | null> {
        return await this.findByProperty('email', email);
    }

    async findById(id: string): Promise<User | null> {
        return await this.findByProperty('id', id);
    }

    async create(user: User): Promise<{ status: number; error?: string }> {
        const existingUser = await this.findByEmail(user.email);
        if (existingUser) {
            throw new EmailAlreadyExistsError();
        }
        return await super.create(user);
    }
    

    protected async  toDomain(entity: UserEntity): Promise<User> {
        return entity.toDomain();
    }

    protected async  toEntity(domain: User): Promise<UserEntity> {
        return UserEntity.fromDomain(domain);
    }
}