export interface IBaseRepository<D> {
    findOneByField<K extends keyof D>(
        field: K,
        value: D[K],
        errorMessage?: string
    ): Promise<D>;
    findOneByEmail<K extends keyof D>(
        field: K,
        value: D[K]
    ): void;
    getAll(): Promise<D[]>;
    create(entity: D): Promise<{ status: number; error?: string; data?: D }>;
    update(id: string, entity: Partial<D>): Promise<D>;
    remove(id: string): Promise<{ status: number; error?: string }>;
}