import { DataSource } from "typeorm";

export class MigrationService {
    constructor(private dataSource: DataSource) {}

    async runMigrations(): Promise<void> {
        try {
            const pendingMigrations = await this.dataSource.showMigrations();
            if (pendingMigrations) {
                console.log('Running pending migrations...');
                await this.dataSource.runMigrations();
                console.log('Migrations completed successfully');
            } else {
                console.log('No pending migrations');
            }
        } catch (error) {
            console.error('Error running migrations:', error);
            throw error;
        }
    }
}