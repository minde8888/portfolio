import { AutoMap } from '@automapper/classes';

export abstract class BaseEntity {
    @AutoMap()
    id: string;

    @AutoMap()
    createdAt: Date | null;

    @AutoMap()
    updatedAt: Date | null;

    constructor(
        id: string,
        createdAt: Date | null = null,
        updatedAt: Date | null = null
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

}