import fs from 'fs';
import path from 'path';
import { AppDataSource } from '../config/AppDataSource';

async function syncMigrations() {
    await AppDataSource.initialize();

    const rootDir = path.resolve(__dirname, '../../../..');
    const migrationsDir = path.join(rootDir, 'src/infrastructure/database/migrations');
    const files = fs.readdirSync(migrationsDir);

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();

    try {
        await queryRunner.startTransaction();

        // Clear existing migrations
        await queryRunner.query('DELETE FROM migrations');

        // Insert migrations based on files
        for (const file of files) {
            const [timestamp, name] = file.split('-');
            await queryRunner.query(
                'INSERT INTO migrations(timestamp, name) VALUES($1, $2)',
                [parseInt(timestamp), name.replace('.ts', '')]
            );
        }

        await queryRunner.commitTransaction();
        console.log('Migrations synced successfully');
    } catch (error) {
        await queryRunner.rollbackTransaction();
        console.error('Error syncing migrations:', error);
    } finally {
        await queryRunner.release();
        await AppDataSource.destroy();
    }
}

syncMigrations().catch(console.error);