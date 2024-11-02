import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { UserEntity } from './UserEntity';

import { Auth } from '../../domain/entities/auth/Auth';

@Entity('auth')
export class AuthEntity extends BaseEntity {
    @Column({ unique: true, type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'varchar' })
    password!: string;

    @OneToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true
        }
    )
    @JoinColumn({ name: 'user_id' })
    user?: Promise<UserEntity>;

    private constructor() {
        super();
    }

    static create(auth: Auth): AuthEntity {
        const entity = new AuthEntity();

        return Object.assign(entity, {
            id: auth.id,
            email: auth.email,
            name: auth.name,
            password: auth.password,
            createdAt: auth.createdAt,
            updatedAt: auth.updatedAt,
            user: auth.user ? Promise.resolve(UserEntity.fromDomain(auth.user)) : undefined
        });
    }

    static fromDomain(auth: Auth): AuthEntity {
        return AuthEntity.create(auth);
    }

    async toDomain(): Promise<Auth> {
        const resolvedUser = this.user ? await this.user : undefined;

        return new Auth(
            this.id,
            this.email,
            this.name,
            this.password,
            this.createdAt,
            this.updatedAt,
            resolvedUser ? resolvedUser.toDomain() : undefined
        );
    }
}