import { AppDataSource } from "../../database/config/AppDataSource";
import { CreateUserAndAuthTables1729327181519 } from "../../database/migrations/1729327181519-CreateUserAndAuthTables";

export class RunMigrationsForceCommand {
    static async execute(): Promise<void> {
        try {
            await AppDataSource.initialize();
            const queryRunner = AppDataSource.createQueryRunner();
            
            console.log('Forcing migration to run...');
            const migration = new CreateUserAndAuthTables1729327181519();
            await migration.up(queryRunner);
            
            console.log('Migration forced. Checking tables...');
            const tables = await queryRunner.getTables(['users', 'auth']);
            console.log('Tables after forced migration:', tables.map(t => t.name));
            
            await queryRunner.release();
        } catch (error) {
            console.error("Failed to force run migration:", error);
        } finally {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            process.exit(0);
        }
    }
}