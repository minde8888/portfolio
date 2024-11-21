import { MigrationExecutor } from "typeorm";

import { AppDataSource } from "../../database/config/createDataSource";

export class RunMigrationsForceCommand {
    static async execute(): Promise<void> {
        try {
            await AppDataSource.initialize();
            const queryRunner = AppDataSource.createQueryRunner();

            console.log('Initializing migration executor...');
            const migrationExecutor = new MigrationExecutor(AppDataSource, queryRunner);

            console.log('Checking for pending migrations...');
            const pendingMigrations = await migrationExecutor.getPendingMigrations();

            if (pendingMigrations.length > 0) {
                console.log(`Found ${pendingMigrations.length} pending migration(s). Running...`);
                await migrationExecutor.executePendingMigrations();
                console.log('All pending migrations have been executed.');
            } else {
                console.log('No pending migrations found.');
            }

            console.log('Checking tables...');
            const tables = await queryRunner.getTables();
            console.log('Current tables:', tables.map(t => t.name));

            await queryRunner.release();
        } catch (error) {
            console.error("Failed to run migrations:", error);
        } finally {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            process.exit(0);
        }
    }
}