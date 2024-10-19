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

    @Column('text', { nullable: true })
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

        return entity;
    }
}