import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatus } from '@nestjs/common';

import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { Auth } from '../../domain/entities/Auth';

import { AuthEntity } from '../entities/AuthEntity';

import { UpdateError } from '../../utils/Errors/Errors';

export class TypeORMAuthRepository implements IAuthRepository {
    constructor(private repository: Repository<AuthEntity>) { }

    async findByEmail(email: string): Promise<Auth | null> {
        const user = await this.repository.findOne({ where: { email } });
        return user ? user.toDomain() : null;
    }

    async create(auth: Omit<Auth, 'id'>): Promise<{ status: number; error?: string; auth: Auth }> {
        try {
            const entity = AuthEntity.fromDomain(
                new Auth(uuidv4(), auth.email, auth.name, auth.password, auth.role)
            );
            const savedEntity = await this.repository.save(entity);
            
            return {
                status: HttpStatus.CREATED,
                auth: await savedEntity.toDomain()
            };
        } catch (error) {
            console.error('Error creating auth:', error);
            throw error;
        }
    }

    async update(id: string, authData: Partial<Auth>): Promise<Auth> {
        const entityData = this.convertToEntityPartial(authData);
        entityData.updatedAt = new Date();

        await this.repository.update(id, entityData);
        const updatedAuth = await this.repository.findOne({ where: { id } });

        if (!updatedAuth) {
            throw new UpdateError('User not found after update');
        }

        return updatedAuth.toDomain();
    }

    private convertToEntityPartial(authData: Partial<Auth>): Partial<AuthEntity> {
        const entityData: Partial<AuthEntity> = {};

        if (authData.email) entityData.email = authData.email;
        if (authData.name) entityData.name = authData.name;
        if (authData.password) entityData.password = authData.password;
        if (authData.role) entityData.role = authData.role;

        return entityData;
    }
}