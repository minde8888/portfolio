import { AutoMap } from '@automapper/classes';
import { BaseModel } from './BaseModel';

export class User extends BaseModel {
    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    role: string;

    @AutoMap()
    refreshToken: string | null;

    @AutoMap()
    isDeleted: boolean;

    constructor(
        id: string,
        email: string,
        name: string,
        role: string,
        refreshToken: string | null,
        createdAt:Date | null = null,
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