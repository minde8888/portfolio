import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { Auth } from '../../domain/entities/auth/Auth';
import { AuthEntity } from '../entities/AuthEntity';
import { BaseRepository } from './BaseRepository';
import { UpdateError } from 'src/utils/Errors/Errors';

export class TypeORMAuthRepository extends BaseRepository<AuthEntity, Auth> implements IAuthRepository {
    constructor(repository: Repository<AuthEntity>) {
        super(repository);
    }

    async findByEmail(email: string): Promise<Auth | null> {
        return this.findByProperty('email', email);
    }

    async create(auth: Omit<Auth, 'id'>): Promise<{ status: number; error?: string; data?: Auth }> {
        const newAuth = new Auth(
            uuidv4(),
            auth.email,
            auth.name,
            auth.password
        );

        return super.create(newAuth);
    }


    protected async toDomain(entity: AuthEntity): Promise<Auth> {
        return entity.toDomain();
    }

    protected async toEntity(domain: Auth): Promise<AuthEntity> {
        return AuthEntity.fromDomain(domain);
    }
}
