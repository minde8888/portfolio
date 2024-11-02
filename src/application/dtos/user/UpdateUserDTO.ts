import { AutoMap } from '@automapper/classes';
import { BaseUserDTO } from './BaseUserDTO';

export class UpdateUserDTO extends BaseUserDTO {

    @AutoMap()
    password: string | undefined;

    constructor(
        id: string,
        email: string,
        name: string,
        password: string
    ) {
        super(id, email, name);
        this.password = password;
    }
}