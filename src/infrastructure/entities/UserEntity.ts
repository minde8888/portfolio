import 'reflect-metadata';
import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, CreateDateColumn } from 'typeorm';
import { User } from './../../domain/entities/User';

@Entity('users')
export class UserEntity {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    email!: string;

    @Column()
    name!: string;

    @Column()
    role!: string;

    @Column({ nullable: true })
    refreshToken!: string | null;

    toDomain(): User {
        return new User(
            this.id,
            this.email,
            this.name,
            this.role,
        );
    }

    static fromDomain(user: User): UserEntity {
        const entity = new UserEntity();
        entity.id = user.id;
        entity.email = user.email;
        entity.name = user.name;
        entity.role = user.role;

        return entity;
    }
}
