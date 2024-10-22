import { AutoMap } from '@automapper/classes';

export abstract class BaseModel {
    @AutoMap()
    id!: string;

    @AutoMap()
    createdAt: Date;

    @AutoMap()
    updatedAt: Date;

    constructor(
        id: string,
        createdAt: Date = new Date(),
        updatedAt: Date = new Date()
    ) {
        this.id = id;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}