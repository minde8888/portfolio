import { Repository, FindOptionsWhere, ObjectLiteral } from 'typeorm';
import { HttpStatus } from '@nestjs/common';

import { EmailAlreadyExistsError, NotFoundError } from '../../utils/Errors/Errors';

import { IBaseRepository } from '../../domain/repositories/IRepository';

export abstract class BaseRepository<T extends ObjectLiteral, D> implements IBaseRepository<D> {
    constructor(
        protected readonly repository: Repository<T>
    ) { }

    async findOneByField<K extends keyof D>(
        field: K,
        value: D[K],
        errorMessage?: string
    ): Promise<D> {
        const entityField = this.mapDomainFieldToEntity(field);

        const entity = await this.repository.findOne({
            where: { [entityField]: value } as any
        });

        if (!entity) {
            throw new NotFoundError(
                errorMessage || `Entity with ${String(field)} ${value} not found`
            );
        }

        return this.toDomain(entity);
    }

    async findOneByEmail<K extends keyof D>(
        field: K,
        value: D[K]
    ): Promise<void> {
        const entityField = this.mapDomainFieldToEntity(field);

        const entity = await this.repository.findOne({
            where: { [entityField]: value } as any
        });
        console.log(entity);

        if (entity) {
            throw new EmailAlreadyExistsError();
        }
    }

    async getAll(): Promise<D[]> {
        const entities = await this.repository.find({
            where: { isDeleted: false } as unknown as FindOptionsWhere<T>
        });
        return Promise.all(entities.map(entity => this.toDomain(entity)));
    }

    async create(domain: D): Promise<{ status: number; error?: string; data?: D }> {
        try {
            const entity = await this.toEntity(domain);
            (entity as any).createdAt = new Date();

            const savedEntity = await this.repository.save(entity);
            const domainResult = await this.toDomain(savedEntity);

            return {
                status: HttpStatus.CREATED,
                data: domainResult
            };
        } catch (error) {
            throw error;
        }
    }

    async update(id: string, partialDomain: Partial<D>): Promise<D> {
        try {
            const existingEntity = await this.repository.findOne({
                where: { id } as unknown as FindOptionsWhere<T>
            });

            if (!existingEntity) {
                throw new NotFoundError(`Entity with id ${id} not found`);
            }

            const existingDomain = await this.toDomain(existingEntity);
            const updatedEntity = this.repository.merge(
                existingEntity,
                await this.toEntity({ ...existingDomain, ...partialDomain } as D)
            );

            (updatedEntity as any).updatedAt = new Date();

            const savedEntity = await this.repository.save(updatedEntity);
            return this.toDomain(savedEntity);
        } catch (error) {
            throw error;
        }
    }

    async remove(id: string): Promise<{ status: number; error?: string }> {
        const entity = await this.repository.findOne({
            where: { id } as unknown as FindOptionsWhere<T>
        });

        if (!entity || (entity as any).isDeleted) {
            throw new NotFoundError(`Entity not found or has been deleted`);
        }

        try {
            (entity as any).isDeleted = true;
            await this.repository.save(entity);
            return { status: HttpStatus.OK };
        } catch (error) {
            throw error;
        }
    }

    protected abstract toDomain(entity: T): Promise<D>;
    protected abstract toEntity(domain: D): Promise<T>;

    protected mapDomainFieldToEntity(field: keyof D): keyof T {
        return field as unknown as keyof T;
    }
}