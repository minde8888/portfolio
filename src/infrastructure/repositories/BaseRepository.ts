import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { HttpStatus } from '@nestjs/common';
import { NotFoundError } from '../../utils/Errors/Errors';
import { IBaseRepository } from '../../domain/repositories/IRepository';

export abstract class BaseRepository<T extends ObjectLiteral, D> implements IBaseRepository<D> {
    constructor(
        protected readonly repository: Repository<T>
    ) {}

    async findByProperty(property: keyof D, value: any): Promise<D | null> {
        try {
            const whereClause = { [property]: value } as FindOptionsWhere<T>;
            const entity = await this.repository.findOne({ where: whereClause });
            return entity ? this.toDomain(entity) : null;
        } catch (error) {
            throw error;
        }
    }

    async findById(id: string): Promise<D> {
        const entity = await this.repository.findOne({ where: { id } as unknown as FindOptionsWhere<T> });
        if (!entity) {
            throw new NotFoundError(`Entity with id ${id} not found`);
        }
        return this.toDomain(entity);
    }

    async getAll(): Promise<D[]> {
        const entities = await this.repository.find({ 
            where: { isDeleted: false } as unknown as FindOptionsWhere<T> 
        });
        return entities.map(entity => this.toDomain(entity));
    }

    async create(domain: D): Promise<{ status: number; error?: string }> {
        try {
            const entity = this.toEntity(domain);
            (entity as any).createdAt = new Date();
            await this.repository.save(entity);
            return { status: HttpStatus.CREATED };
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, partialDomain: Partial<D>): Promise<D> {
        const entity = await this.repository.findOne({ 
            where: { id } as unknown as FindOptionsWhere<T> 
        });
        
        if (!entity) {
            throw new NotFoundError(`Entity with id ${id} not found`);
        }

        try {
            const updatedEntity = {
                ...entity,
                ...this.toEntity(partialDomain as D),
                updatedAt: new Date()
            };
            await this.repository.save(updatedEntity);
            return this.toDomain(updatedEntity);
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<{ status: number; error?: string }> {
        const entity = await this.repository.findOne({ 
            where: { id } as unknown as FindOptionsWhere<T> 
        });

        if (!entity) {
            throw new NotFoundError(`Entity with id ${id} not found`);
        }

        try {
            (entity as any).isDeleted = true;
            await this.repository.save(entity);
            return { status: HttpStatus.OK };
        } catch (error) {
            throw error;
        }
    }

    protected abstract toDomain(entity: T): D;
    protected abstract toEntity(domain: D): T;
}