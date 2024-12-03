import { execSync } from 'child_process';
import path from 'path';

const migrationName = process.argv[2];
if (!migrationName) {
  console.error('Please provide a migration name');
  process.exit(1);
}

const rootDir = process.cwd();
const configPath = path.join(rootDir, 'src', 'infrastructure', 'database', 'config', 'index.ts');
const migrationsDir = path.join(rootDir, 'src', 'infrastructure', 'database', 'migrations');

// Wrap paths in quotes to handle spaces
const command = `typeorm-ts-node-commonjs migration:generate ` +
  `-d "${configPath}" ` +
  `"${path.join(migrationsDir, migrationName)}"`;

try {
  const output = execSync(command, { 
    encoding: 'utf-8',
    stdio: ['pipe', 'pipe', 'pipe'] // Handle stdin, stdout, and stderr
  });
  console.log(`Migration generated successfully:\n${output}`);
} catch (error: any) {
  console.error(`Error: ${error.message}`);
  if (error.stdout) console.error(`Error stdout: ${error.stdout}`);
  if (error.stderr) console.error(`Error stderr: ${error.stderr}`);
  process.exit(1);
}