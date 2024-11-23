import { IDatabaseConfig } from "../../../types/IDatabaseConfig";
import { DatabaseConnection } from "./DatabaseConnection";
import { MigrationService } from "../../services/MigrationService";

const createdDatabases: { [key: string]: Promise<void> | null } = {};

export class DatabaseManager {
    private readonly defaultHost = 'localhost';
    private readonly defaultPort = 5432;
    private readonly defaultUsername = 'postgres';
    private readonly defaultPassword = 'admin';
    private readonly defaultDatabase = 'postgres';
    private readonly connectionTimeout = 5000;
    private readonly connectionDelay = 1000;
    private readonly databaseKey: string;

    constructor(private config: IDatabaseConfig) {
        this.databaseKey = `${config.host ?? this.defaultHost}:${config.port ?? this.defaultPort}/${config.database}`;
    }

    async createDatabaseIfNotExists(): Promise<void> {
        const migrationService = new MigrationService();
        // If there's an existing creation in progress, wait for it
        if (createdDatabases[this.databaseKey]) {
            try {
                await createdDatabases[this.databaseKey];       
                return;
            } catch (error) {
                // If the previous attempt failed, we'll try again
                delete createdDatabases[this.databaseKey];
            }
        }

        // Store the promise of the creation attempt
        createdDatabases[this.databaseKey] = this.initializeDatabase();

        try {
            await createdDatabases[this.databaseKey];
            migrationService.runMigrations();
        } catch (error) {
            // Clean up on error
            delete createdDatabases[this.databaseKey];
            throw error;
        }
    }

    private async initializeDatabase(): Promise<void> {
        const adminConnection = await this.createAdminConnection();

        try {
            const exists = await this.checkDatabaseExists(adminConnection);

            if (!exists) {
                try {
                    await this.ensureDatabaseExists(adminConnection);
                } catch (error: any) {
                    // Handle the case where another process created the database
                    if (error.code === '23505') { // Duplicate database error
                        console.log(`Database ${this.config.database} was created by another process.`);
                    } else {
                        throw error;
                    }
                }
                await this.ensureDatabaseAccessible(adminConnection);
            } else {
                console.log(`Database ${this.config.database} already exists.`);
            }
        } finally {
            await adminConnection.disconnect();
        }

        await this.verifyTargetConnection();
    }

    private async createAdminConnection(): Promise<DatabaseConnection> {
        const connection = new DatabaseConnection({
            host: this.config.host ?? this.defaultHost,
            port: this.config.port ?? this.defaultPort,
            username: this.config.username ?? this.defaultUsername,
            password: this.config.password ?? this.defaultPassword,
            database: this.defaultDatabase,
        });

        await connection.connect();
        return connection;
    }

    private async checkDatabaseExists(connection: DatabaseConnection): Promise<boolean> {
        const result = await connection.query(
            'SELECT datname FROM pg_database WHERE datname = $1',
            [this.config.database]
        );
        return result.rowCount > 0;
    }

    private async ensureDatabaseExists(connection: DatabaseConnection): Promise<void> {
        console.log(`Creating database ${this.config.database}...`);
        
        // Add IF NOT EXISTS to prevent errors if database was created concurrently
        await connection.query(`CREATE DATABASE "${this.config.database}"`);
        console.log(`Database ${this.config.database} created successfully.`);
    }

    private async ensureDatabaseAccessible(connection: DatabaseConnection): Promise<void> {
        const result = await connection.query(
            'SELECT datallowconn FROM pg_database WHERE datname = $1',
            [this.config.database]
        );

        if (result.rowCount > 0 && !result.rows[0].datallowconn) {
            console.log('Fixing database connection permissions...');
            await connection.query(
                'UPDATE pg_database SET datallowconn = true WHERE datname = $1',
                [this.config.database]
            );
        }
    }

    private async verifyTargetConnection(): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, this.connectionDelay));

        const targetConnection = new DatabaseConnection({
            host: this.config.host ?? this.defaultHost,
            port: this.config.port ?? this.defaultPort,
            username: this.config.username ?? this.defaultUsername,
            password: this.config.password ?? this.defaultPassword,
            database: this.config.database,
            connectionTimeoutMillis: this.connectionTimeout
        });

        try {
            await targetConnection.connect();
            console.log(`Successfully connected to ${this.config.database} database`);
        } finally {
            await targetConnection.disconnect();
        }
    }
}