import fs from 'fs';
import path from 'path';

const rootDir = path.resolve(__dirname, '../../../..');
const migrationsDir = path.join(rootDir, 'src/infrastructure/database/migrations');

const files = fs.readdirSync(migrationsDir);
console.log('Migration files:');
files.forEach(file => {
    console.log(file);
});