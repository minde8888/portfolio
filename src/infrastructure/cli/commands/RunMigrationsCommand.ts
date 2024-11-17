import { MigrationService } from "../../services/MigrationService";


export class RunMigrationsCommand {
    static async execute(): Promise<void> {
        const migrationService = new MigrationService();
        try {
            await migrationService.runMigrations();
        } catch (error) {
            console.error("Failed to run migrations:", error);
        } finally {
            process.exit(0);
        }
    }
}