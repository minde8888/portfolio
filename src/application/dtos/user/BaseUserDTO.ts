import { AutoMap } from '@automapper/classes';

export class BaseUserDTO {
    @AutoMap()
    id: string;

    @AutoMap()
    email: string;

    @AutoMap()
    name: string;

    constructor(
        id: string,
        email: string,
        name: string
    ) {
        this.id = id;
        this.email = email;
        this.name = name;
    }
}