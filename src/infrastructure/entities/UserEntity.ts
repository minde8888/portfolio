import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from '../../domain/entities/user/User';
import { AuthEntity } from './AuthEntity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ unique: true, type: 'varchar' })
    email: string;

    @Column({ type: 'varchar' })
    name: string;

    @Column({ type: 'varchar', default: 'user' })
    role: string;

    @Column({ type: 'text', nullable: true, default: null })
    refreshToken: string | null;

    @Column({ name: 'is_deleted', type: 'boolean', default: false })
    isDeleted: boolean;

    @OneToOne(() => AuthEntity, auth => auth.user)
    auth!: AuthEntity;

    constructor(email: string = '', name: string = '', role: string = 'user', refreshToken: string | null = null) {
        super();
        this.email = email;
        this.name = name;
        this.role = role;
        this.refreshToken = refreshToken;
        this.isDeleted = false;
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

    static fromDomain(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.id;
        entity.email = user.email;
        entity.name = user.name;
        entity.role = user.role;
        entity.refreshToken = user.refreshToken;
        entity.createdAt = user.createdAt;
        entity.updatedAt = user.updatedAt;
        return entity;
    }
} 