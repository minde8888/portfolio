import { Entity, Column, OneToOne } from 'typeorm';

import { BaseEntity } from './BaseEntity';
import { AuthEntity } from './AuthEntity';

import { User } from '../../domain/entities/user/User';
import { UserRole } from '../../domain/entities/user/UserRole';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ unique: true, type: 'varchar' })
    email!: string;

    @Column({ type: 'varchar' })
    name!: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role!: UserRole;

    @Column({ type: 'text', nullable: true, default: null })
    refreshToken!: string | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted!: boolean;

    @OneToOne(() => AuthEntity, auth => auth.user)
    auth!: AuthEntity;

    static create(user: User): UserEntity {
        const entity = new UserEntity();

        return Object.assign(entity, {
           id : user.id,
           email : user.email,
           name : user.name,
           role : user.role,
           refreshToken : user.refreshToken,
           createdAt : user.createdAt,
           updatedAt : user.updatedAt
        });
    }

    static fromDomain(user: User): UserEntity {
        return UserEntity.create(user);
    }

    toDomain(): User {
        return new User(
            this.id,
            this.email,
            this.name,
            this.role,
            this.refreshToken,
            this.createdAt,
            this.updatedAt,
            this.isDeleted
        );
    }
} 