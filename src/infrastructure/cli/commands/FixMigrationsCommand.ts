import { AppDataSource } from "../../database/config/createDataSource";

import fs from 'fs';

import path from 'path';

export class FixMigrationsCommand {
    static async execute(): Promise<void> {
        try {
            await AppDataSource.initialize();
            const queryRunner = AppDataSource.createQueryRunner();

            const migrationsDir = path.join(__dirname, '../../database/migrations');
            const migrationFiles = fs.readdirSync(migrationsDir)
                .filter(file => file.endsWith('.ts'))
                .map(file => {
                    const [timestamp, ...nameParts] = file.split('-');
                    return { 
                        timestamp: parseInt(timestamp), 
                        name: `${timestamp}-${nameParts.join('-').replace('.ts', '')}` 
                    };
                });

            console.log('Migration files found:', migrationFiles);

            const migrationsInDb = await queryRunner.query('SELECT * FROM migrations ORDER BY id DESC');
            console.log('Migrations in database:', migrationsInDb);

            // Remove all entries from DB
            await queryRunner.query('DELETE FROM migrations');

            // Add all migrations to DB with correct format
            for (const fileMigration of migrationFiles) {
                console.log(`Adding migration to DB: ${fileMigration.name}`);
                await queryRunner.query(
                    'INSERT INTO migrations(timestamp, name) VALUES($1, $2)',
                    [fileMigration.timestamp, fileMigration.name]
                );
            }

            console.log('Migrations have been synchronized.');

        } catch (error) {
            console.error('Error fixing migrations:', error);
        } finally {
            if (AppDataSource.isInitialized) {
                await AppDataSource.destroy();
            }
            process.exit(0);
        }
    }
}