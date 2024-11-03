import { AutoMap } from '@automapper/classes';

import { BaseEntity } from '../base/BaseEntity';

import { IDeletableEntity } from '../../../domain/interfaces/IDeletableEntity';

import { UserRole } from './UserRole';

export class User extends BaseEntity implements IDeletableEntity {
    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    role: UserRole;

    @AutoMap()
    refreshToken: string | null;

    @AutoMap()
    isDeleted: boolean;

    constructor(
        id: string,
        email: string,
        name: string,
        role: UserRole = UserRole.USER,
        refreshToken: string | null,
        createdAt: Date | null = null,
        updatedAt: Date | null = null,
        isDeleted: boolean
    ) {
        super(id, createdAt, updatedAt);
        this.email = email;
        this.name = name;
        this.role = role;
        this.refreshToken = refreshToken;
        this.isDeleted = isDeleted;
    }
}