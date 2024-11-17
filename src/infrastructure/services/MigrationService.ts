import fs from 'fs';
import path from 'path';
import { DataSource } from "typeorm";
import { MigrationExecutor } from "typeorm/migration/MigrationExecutor";
import { DataSourceOptions } from '../../../out/DataSourceOptions';

export class MigrationService {
    private readonly dataSource: DataSource;

    private static readonly ENTITIES_PATH = path.join(__dirname, '../entities/*Entity.{ts,js}');
    private static readonly MIGRATIONS_PATH = path.join(__dirname, '../database/migrations/**/*.{ts,js}');
    private static readonly MIGRATIONS_DIR = path.join(__dirname, '..', 'database', 'migrations');

    constructor() {
        this.dataSource = new DataSource({
            ...DataSourceOptions,
            entities: [MigrationService.ENTITIES_PATH],
            migrations: [MigrationService.MIGRATIONS_PATH],
        });
    }

    private async initializeDataSource(): Promise<void> {
        if (!this.dataSource.isInitialized) {
            await this.dataSource.initialize();
        }
    }

    private logError(action: string, error: unknown): void {
        console.error(`Error during ${action}:`, error);
    }

    async runMigrations(): Promise<void> {
        try {
            await this.initializeDataSource();

            const migrationExecutor = new MigrationExecutor(this.dataSource);
            const pendingMigrations = await migrationExecutor.getPendingMigrations();

            if (pendingMigrations.length > 0) {
                console.log(`Running ${pendingMigrations.length} pending migrations...`);
                await migrationExecutor.executePendingMigrations();
                console.log('All pending migrations have been executed.');
            } else {
                console.log('No pending migrations.');
            }
        } catch (error) {
            this.logError('running migrations', error);
            throw error;
        }
    }

    async revertLastMigration(): Promise<void> {
        try {
            await this.initializeDataSource();

            const migrationExecutor = new MigrationExecutor(this.dataSource);
            const executedMigrations = await migrationExecutor.getExecutedMigrations();

            console.log('Executed migrations:', executedMigrations);

            const migrationFiles = fs.readdirSync(MigrationService.MIGRATIONS_DIR);
            console.log('Migration files found:', migrationFiles);

            if (executedMigrations.length > 0) {
                console.log('Reverting last migration...');
                await migrationExecutor.undoLastMigration();
                console.log('Last migration has been reverted.');
            } else {
                console.log('No migrations to revert.');
            }
        } catch (error) {
            this.logError('reverting migration', error);
            throw error;
        }
    }
}
