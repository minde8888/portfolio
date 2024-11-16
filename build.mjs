import { build } from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import path from 'path';

const execAsync = promisify(exec);

// Recreate __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Clean the output directory
async function cleanDist() {
    const distDir = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distDir)) {
        fs.rmSync(distDir, { recursive: true, force: true });
        console.log('Cleaned output directory.');
    }
}

// Generate TypeScript declarations
async function generateTypeDeclarations() {
    try {
        await execAsync('tsc --emitDeclarationOnly --declaration --outDir dist/types');
        console.log('Type declarations generated successfully.');
    } catch (error) {
        console.error('Error generating type declarations:', error.message || error);
        process.exit(1);
    }
}

// Common build configuration
const getCommonConfig = (plugins) => ({
    bundle: true,
    minify: true,
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    metafile: true,
    treeShaking: true,
    external: [
        '@nestjs/*',
        'typeorm',
        'express',
        'bcrypt',
        'jsonwebtoken',
        'pg',
        'redis',
        'reflect-metadata',
        '@automapper/*',
        'tsyringe',
    ],
    define: {
        'process.env.NODE_ENV': '"production"',
    },
    plugins,
});

// Plugin for build analytics
const buildAnalyticsPlugin = {
    name: 'production-check',
    setup(build) {
        build.onEnd((result) => {
            if (result.errors.length) {
                console.error('Build failed:', result.errors);
            } else {
                console.log('Build completed successfully!');
                const outFiles = result.metafile?.outputs || {};
                Object.entries(outFiles).forEach(([file, meta]) => {
                    console.log(`${file}: ${(meta.bytes / 1024).toFixed(2)}kb`);
                });
            }
        });
    },
};

// Build function for specific format
async function createBuild(format, outfile) {
    try {
        await build({
            ...getCommonConfig([buildAnalyticsPlugin]),
            entryPoints: ['src/index.ts'],
            outfile,
            format,
        });
        console.log(`Build (${format}) completed: ${outfile}`);
    } catch (error) {
        console.error(`Error during ${format} build:`, error.message || error);
        process.exit(1);
    }
}

// Main build process
async function runBuild() {
    // Step 1: Clean the output directory
    await cleanDist();

    // Step 2: Generate TypeScript declarations
    await generateTypeDeclarations();

    // Step 3: Build for CommonJS and ESM in parallel
    await Promise.all([
        createBuild('cjs', 'dist/index.js'),
        createBuild('esm', 'dist/index.mjs'),
    ]);

    console.log('All builds completed successfully!');
}

// Global error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error.message || error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error.message || error);
    process.exit(1);
});

// Execute the build process
runBuild();
