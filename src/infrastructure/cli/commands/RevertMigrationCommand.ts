import { AppDataSource } from "../../database/config/AppDataSource";

import { MigrationService } from "../../services/MigrationService";

export class RevertMigrationCommand {
    static async execute(): Promise<void> {
        const migrationService = new MigrationService(AppDataSource);
        try {
            await migrationService.revertLastMigration();
        } catch (error) {
            console.error("Failed to revert migration:", error);
        } finally {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            process.exit(0);
        }
    }
}