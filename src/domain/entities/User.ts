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

    constructor(
        id: string,
        email: string,
        name: string,
        role: string,
        refreshToken: string | null = null,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        super(id, createdAt, updatedAt);
        this.email = email;
        this.name = name;
        this.role = role;
        this.refreshToken = refreshToken;
    }
}