import { Repository } from 'typeorm';
import { IAuthRepository } from '../../domain/repositories/IAuthRepository';
import { Auth } from '../../domain/entities/Auth';
import { HttpStatus } from '@nestjs/common';
import { AuthEntity } from '../entities/AuthEntity';
import {v4 as uuidv4} from 'uuid';
import { User } from 'src/domain/entities/User';

export class TypeORMAuthRepository implements IAuthRepository {
    constructor(private repository: Repository<AuthEntity>) { }

    async findByEmail(email: string): Promise<Auth | null> {
        const user = await this.repository.findOne({ where: { email } });
        return user ? user.toDomain() : null;
    }



    async create(auth: Omit<Auth, 'id'>): Promise<{ status: number; user: Auth; error?: string }> {
        try {
            const entity = AuthEntity.fromDomain(new Auth(uuidv4(), auth.email, auth.name, auth.password, auth.role));
            const user = await this.repository.save(entity);
            return { status: HttpStatus.CREATED, user };
        } catch (error) {
            console.error('Error creating user:', error);
            throw error;
        }
    }

    async update(id: string, auth: Partial<Auth>): Promise<Auth> {
        await this.repository.update(id, auth);
        const updatedUser = await this.repository.findOne({ where: { id } });
        if (!updatedUser) {
            throw new Error('User not found after update');
        }
        return updatedUser.toDomain();
    }
}