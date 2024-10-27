import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './BaseEntity';
import { Auth } from '../../domain/entities/Auth';
import { UserEntity } from './UserEntity';

@Entity('auth')
export class AuthEntity extends BaseEntity {
    @Column({
        unique: true,
        type: 'varchar'
    })
    email!: string;

    @Column({
        type: 'varchar'
    })
    name!: string;

    @Column({
        type: 'varchar'
    })
    password!: string;

    @Column({
        type: 'varchar',
        default: 'user'
    })
    role!: string;

    @OneToOne(
        () => UserEntity,
        {
            cascade: true,
            eager: true
        }
    )
    @JoinColumn()
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
            role: auth.role,
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
            this.role,
            this.createdAt,
            this.updatedAt,
            resolvedUser ? await resolvedUser.toDomain() : undefined
        );
    }
}