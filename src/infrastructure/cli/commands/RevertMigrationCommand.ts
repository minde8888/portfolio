import { MigrationService } from "../../services/MigrationService";

export class RevertMigrationCommand {
    static async execute(): Promise<void> {
        const migrationService = new MigrationService();
        try {
            await migrationService.revertLastMigration();
        } catch (error) {
            console.error("Failed to revert migration:", error);
        } finally {
            process.exit(0);
        }
    }
}