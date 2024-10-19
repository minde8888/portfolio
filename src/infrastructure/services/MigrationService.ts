import { DataSource, Table, MigrationInterface } from "typeorm";
import path from 'path';
import fs from 'fs';

export class MigrationService {
    constructor(private dataSource: DataSource) {}

    async runMigrations(): Promise<void> {
        try {
            if (!this.dataSource.isInitialized) {
                console.log('Initializing data source...');
                await this.dataSource.initialize();
            }

            const queryRunner = this.dataSource.createQueryRunner();

            await this.ensureMigrationsTable(queryRunner);
            await this.runPendingMigrations(queryRunner);

            await queryRunner.release();

            console.log('All migrations completed successfully.');
        } catch (error) {
            console.error('Error running migrations:', error);
            throw error;
        } finally {
            if (this.dataSource.isInitialized) {
                await this.dataSource.destroy();
            }
        }
    }

    private async ensureMigrationsTable(queryRunner: any): Promise<void> {
        const migrationsTableExists = await queryRunner.hasTable('migrations');
        if (!migrationsTableExists) {
            console.log('Migrations table does not exist. Creating...');
            await queryRunner.createTable(
                new Table({
                    name: 'migrations',
                    columns: [
                        {
                            name: 'id',
                            type: 'int',
                            isPrimary: true,
                            isGenerated: true,
                            generationStrategy: 'increment',
                        },
                        {
                            name: 'timestamp',
                            type: 'bigint',
                            isNullable: false,
                        },
                        {
                            name: 'name',
                            type: 'varchar',
                            isNullable: false,
                        },
                    ],
                })
            );
        }
    }

    private async runPendingMigrations(queryRunner: any): Promise<void> {
        const migrationsDir = path.join(__dirname, '../database/migrations');
        const migrationFiles = fs.readdirSync(migrationsDir)
            .filter(file => file.endsWith('.ts') && !file.endsWith('.d.ts'))
            .sort();

        for (const migrationFile of migrationFiles) {
            const migrationName = path.parse(migrationFile).name;
            const [timestamp] = migrationName.split('-');

            const migrationExists = await this.checkMigrationExists(migrationName);

            if (!migrationExists) {
                console.log(`Running migration: ${migrationName}`);
                const migration = await this.importMigration(path.join(migrationsDir, migrationFile));
                await migration.up(queryRunner);

                await this.recordMigration(parseInt(timestamp), migrationName);

                console.log(`Migration ${migrationName} completed.`);
            } else {
                console.log(`Migration ${migrationName} already run.`);
            }
        }
    }

    private async checkMigrationExists(name: string): Promise<boolean> {
        const result = await this.dataSource.manager
            .createQueryBuilder()
            .select()
            .from('migrations', 'm')
            .where('m.name = :name', { name })
            .getRawOne();
        return !!result;
    }

    private async importMigration(filePath: string): Promise<MigrationInterface> {
        const migration = await import(filePath);
        const MigrationClass = Object.values(migration)[0] as new () => MigrationInterface;
        return new MigrationClass();
    }

    private async recordMigration(timestamp: number, name: string): Promise<void> {
        await this.dataSource.manager
            .createQueryBuilder()
            .insert()
            .into('migrations')
            .values({ timestamp, name })
            .execute();
    }
}