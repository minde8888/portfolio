import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { Auth } from '../../domain/entities/Auth';

@Entity('auth')
export class AuthEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column()
    password!: string;

    @Column()
    role!: string;

    @Column({ nullable: true })
    refreshToken!: string | null;

    @CreateDateColumn()
    createdAt!: Date;

    @UpdateDateColumn()
    updatedAt!: Date;

    toDomain(): Auth {
        return new Auth(
            this.id,
            this.email,
            this.name,
            this.password,
            this.role,
            this.refreshToken,
            this.createdAt,
            this.updatedAt
        );
    }

    static fromDomain(user: Auth): AuthEntity {
        const entity = new AuthEntity();
        entity.id = user.id;
        entity.email = user.email;
        entity.name = user.name;
        entity.password = user.password;
        entity.role = user.role;
        entity.refreshToken = user.refreshToken;
        entity.createdAt = user.createdAt ?? new Date();
        entity.updatedAt = user.updatedAt ?? new Date();

        return entity;
    }
}
