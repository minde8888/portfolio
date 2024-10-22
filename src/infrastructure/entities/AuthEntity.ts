import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Auth } from '../../domain/entities/Auth';
import { UserEntity } from './UserEntity';

@Entity('auth')
export class AuthEntity extends BaseEntity {
    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column()
    role!: string;

    @Column('text', { nullable: true })
    refreshToken!: string | null;

    @OneToOne(() => UserEntity, {
        cascade: true,
        eager: true
    })
    @JoinColumn()
    user!: UserEntity;

    toDomain(): Auth {
        return new Auth(
            this.id,
            this.email,
            this.name,
            this.password,
            this.role,
            this.refreshToken,
            this.createdAt,
            this.updatedAt,
            this.user?.toDomain()
        );
    }

    static fromDomain(auth: Auth): AuthEntity {
        const entity = new AuthEntity();
        entity.id = auth.id;
        entity.email = auth.email;
        entity.name = auth.name;
        entity.password = auth.password;
        entity.role = auth.role;
        entity.refreshToken = auth.refreshToken;
        entity.createdAt = auth.createdAt;
        entity.updatedAt = auth.updatedAt;

        if (auth.user) {
            entity.user = UserEntity.fromDomain(auth.user);
        }

        return entity;
    }
}