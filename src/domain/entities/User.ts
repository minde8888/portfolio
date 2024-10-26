import { AutoMap } from '@automapper/classes';

export class User {
    @AutoMap()
    id: string;

    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    role: string;

    @AutoMap()
    refreshToken: string | null;

    @AutoMap()
    createdAt: Date;

    @AutoMap()
    updatedAt: Date;

    constructor(
        id: string,
        email: string,
        name: string,
        role: string,
        refreshToken: string | null,
        createdAt: Date,
        updatedAt: Date
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.refreshToken = refreshToken;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}