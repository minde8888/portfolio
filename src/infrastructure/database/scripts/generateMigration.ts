import { execSync } from 'child_process';
import path from 'path';

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const rootDir = path.resolve(__dirname, '../../../..');
const configPath = path.join(rootDir, 'src/infrastructure/database/config/AppDataSource.ts');
const migrationsDir = path.join(rootDir, 'src/infrastructure/database/migrations');

const command = `typeorm-ts-node-commonjs migration:generate -d ${configPath} ${path.join(migrationsDir, migrationName)}`;

console.log(`Executing command: ${command}`);

try {
  const output = execSync(command, { encoding: 'utf-8' });
  console.log(`Migration generated successfully:\n${output}`);
} catch (error: any) {
  console.error(`Error: ${error.message}`);
  if (error.stdout) console.error(`Error details: ${error.stdout}`);
  if (error.stderr) console.error(`Error stderr: ${error.stderr}`);
}