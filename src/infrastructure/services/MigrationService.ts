import fs from 'fs';
import path from 'path';
import { DataSource } from "typeorm";
import { MigrationExecutor } from "typeorm/migration/MigrationExecutor";

export class MigrationService {
    constructor(private dataSource: DataSource) { }

    async runMigrations(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
            }

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
            console.error('Error running migrations:', error);
            throw error;
        }
    }

    async revertLastMigration(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                await this.dataSource.initialize();
            }
            
            const migrationExecutor = new MigrationExecutor(this.dataSource);
            const executedMigrations = await migrationExecutor.getExecutedMigrations();
            
            console.log('Executed migrations:', executedMigrations);

            const migrationsDir = path.join(__dirname, '..', 'database', 'migrations');
            console.log('Migrations directory:', migrationsDir);

            const migrationFiles = fs.readdirSync(migrationsDir);
            console.log('Migration files found:', migrationFiles);

            if (executedMigrations.length > 0) {
                console.log('Reverting last migration...');
                await migrationExecutor.undoLastMigration();
                console.log('Last migration has been reverted.');
            } else {
                console.log('No migrations to revert.');
            }
        } catch (error) {
            console.error('Error reverting migration:', error);
            throw error;
        }
    }
}