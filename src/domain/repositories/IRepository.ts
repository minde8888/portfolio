export interface IBaseRepository<T> {
    findByProperty(property: keyof T, value: any): Promise<T | null>;
    findById(id: string): Promise<T>;
    getAll(): Promise<T[]>;
    create(entity: T): Promise<{ status: number; error?: string }>;
    update(id: string, entity: Partial<T>): Promise<T>;
    remove(id: string): Promise<{ status: number; error?: string }>;
}