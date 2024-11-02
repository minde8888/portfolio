import { AutoMap } from '@automapper/classes';
import { BaseUserDTO } from './BaseUserDTO';

export class UserDTO extends BaseUserDTO {

    @AutoMap()
    isDeleted: boolean;

    constructor(
        id: string,
        email: string,
        name: string,
        isDeleted: boolean
    ) {
        super(id, email, name);
        this.isDeleted = isDeleted;
    }
}