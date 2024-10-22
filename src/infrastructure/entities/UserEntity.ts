import { Entity, Column, OneToOne } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { User } from '../../domain/entities/User';
import { AuthEntity } from './AuthEntity';

@Entity('users')
export class UserEntity extends BaseEntity {
    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column()
    role!: string;

    @Column('text', { nullable: true })
    refreshToken!: string | null;

    @OneToOne(() => AuthEntity, auth => auth.user)
    auth!: AuthEntity;

    toDomain(): User {
        return new User(
            this.id,
            this.email,
            this.name,
            this.role,
            this.refreshToken,
            this.createdAt,
            this.updatedAt
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