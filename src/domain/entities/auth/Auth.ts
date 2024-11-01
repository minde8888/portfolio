import { AutoMap } from '@automapper/classes';
import { BaseEntity } from '../base/BaseEntity';
import { User } from '../user/User';

export class Auth extends BaseEntity {
    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    password: string;

    @AutoMap(() => User)
    user?: User;

    constructor(
        id: string,
        email: string,
        name: string,
        password: string,
        createdAt:Date | null = null,
        updatedAt: Date | null = null,
        user?: User
    ) {
        super(id, createdAt, updatedAt);
        this.email = email;
        this.name = name;
        this.password = password;
        this.user = user;
    }
}
