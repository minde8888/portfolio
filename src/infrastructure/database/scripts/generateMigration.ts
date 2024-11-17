import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';

import { DataSourceOptions } from '../../../../out/DataSourceOptions';

const rootDir = process.cwd();
const migrationName = process.argv[2];

if (!migrationName) {
  console.error('❌ Please provide a migration name.');
  process.exit(1);
}

// Define paths
const migrationsDir = path.join(rootDir, 'src', 'infrastructure', 'database', 'migrations');
const tempDataSourcePath = path.join(__dirname, 'tempDataSource.ts');

// Ensure migrations directory exists
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true });
}

// Create data source configuration
const dataSourceConfig = {
  ...DataSourceOptions,
  entities: [path.join(__dirname, '../../entities/*Entity.{ts,js}')],
  migrations: [path.join(__dirname, '../migrations/**/*.{ts,js}')]
};

// Write temporary data source file
function createTempDataSource() {
  const dataSourceContent = `
import { DataSource } from "typeorm";

const dataSource = new DataSource(${JSON.stringify(dataSourceConfig, null, 2)});

export default dataSource;
  `;
  fs.writeFileSync(tempDataSourcePath, dataSourceContent);
  console.log('✅ Created temporary DataSource configuration.');
}

// Generate migration
function generateMigration() {
  const timestamp = Date.now();
  const migrationPath = path.join(migrationsDir, `Migration${timestamp}-${migrationName}`);
  const command = `npx typeorm-ts-node-commonjs migration:generate "${migrationPath}" -d "${tempDataSourcePath}"`;

  console.log(`🚀 Executing command: ${command}`);

  execSync(command, {
    encoding: 'utf-8',
    stdio: 'inherit',
    cwd: rootDir,
  });

  fixMigrationClassName(timestamp);
}

// Fix class name in migration file
function fixMigrationClassName(timestamp: number) {
  const migrationFiles = fs.readdirSync(migrationsDir);
  const latestMigration = migrationFiles
    .filter((file) => file.endsWith('.ts'))
    .sort()
    .pop();

  if (!latestMigration) {
    console.error('❌ No migration file found after generation.');
    return;
  }

  const migrationFilePath = path.join(migrationsDir, latestMigration);
  let content = fs.readFileSync(migrationFilePath, 'utf8');

  content = content.replace(
    /export class \d+/,
    `export class Migration${timestamp}`
  );

  fs.writeFileSync(migrationFilePath, content);
  console.log('✅ Fixed class name in the migration file.');
}

// Clean up temporary file
function cleanup() {
  try {
    if (fs.existsSync(tempDataSourcePath)) {
      fs.unlinkSync(tempDataSourcePath);
      console.log('✅ Cleaned up temporary DataSource configuration.');
    }
  } catch (cleanupError) {
    console.error('❌ Error cleaning up temporary file:', cleanupError);
  }
}

// Main Execution
try {
  createTempDataSource();
  generateMigration();
} catch (error) {
  console.error('❌ Error generating migration:', error);
  if (error instanceof Error) {
    console.error('Error details:', error.message);
  }
  process.exit(1);
} finally {
  cleanup();
}
