import { AppDataSource } from "../../database/config/AppDataSource";

import { MigrationService } from "../../services/MigrationService";

export class RunMigrationsCommand {
    static async execute(): Promise<void> {
        const migrationService = new MigrationService(AppDataSource);
        try {
            await migrationService.runMigrations();
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