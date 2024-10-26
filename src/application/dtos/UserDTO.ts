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


    constructor(
        id: string,
        email: string,
        name: string,
        role: string,
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
        this.role = role;
    }
}