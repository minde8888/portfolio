import { AutoMap } from '@automapper/classes';
import { BaseModel } from './BaseModel';
import { User } from './User';

export class Auth extends BaseModel {
    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    password: string;

    @AutoMap()
    role: string;

    @AutoMap()
    refreshToken: string | null;

    @AutoMap(() => User)
    user?: User;

    constructor(
        id: string,
        email: string,
        name: string,
        password: string,
        role: string,
        refreshToken: string | null = null,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date(),
        user?: User
    ) {
        super(id, createdAt, updatedAt);
        this.email = email;
        this.name = name;
        this.password = password;
        this.role = role;
        this.refreshToken = refreshToken;
        this.user = user;
    }
}
