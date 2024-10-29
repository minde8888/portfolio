import { AutoMap } from '@automapper/classes';

export class UserDTO {
    @AutoMap()
    id: string;

    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    @AutoMap()
    role: string;

    @AutoMap()
    isDeleted: boolean;

    constructor(
        id: string,
        email: string,
        name: string,
        role: string,
        isDeleted: boolean
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
        this.isDeleted = isDeleted;
    }
}