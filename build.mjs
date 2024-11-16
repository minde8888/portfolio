import { build } from 'esbuild';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

// Function to generate TypeScript declarations
async function generateTypeDeclarations() {
    try {
        await execAsync('tsc --emitDeclarationOnly --declaration');
        console.log('Type declarations generated successfully.');
    } catch (error) {
        console.error('Error generating type declarations:', error);
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
    // Svarbu: išlaikyti dekoratorių metaduomenis
    keepNames: true,
    loader: {
        '.ts': 'ts'
    },
    // Įjungti eksperimentinių dekoratorių palaikymą
    define: {
        'process.env.NODE_ENV': '"production"',
        'Reflect.metadata': 'Reflect.metadata',
    },
    banner: {
        js: `
            import { createRequire } from 'module';
            import path from 'path';
            import { fileURLToPath } from 'url';
            import { dirname } from 'path';
            
            const require = createRequire(import.meta.url);
            const __filename = fileURLToPath(import.meta.url);
            const __dirname = dirname(__filename);
            
            import "reflect-metadata";
        `,
    },
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

// Function to build with specific format
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
        console.error(`Error during ${format} build:`, error);
        process.exit(1);
    }
}

// Main build process
async function runBuild() {
    console.log('Starting build process...');
    
    // First ensure TypeScript compilation is clean
    try {
        await execAsync('tsc --noEmit');
        console.log('TypeScript compilation check passed.');
    } catch (error) {
        console.error('TypeScript compilation check failed:', error);
        process.exit(1);
    }
    
    await generateTypeDeclarations();
    
    // Build for CommonJS
    await createBuild('cjs', 'dist/index.js');
    
    // Build for ESM
    await createBuild('esm', 'dist/index.mjs');
    
    console.log('All builds completed successfully!');
}

// Global error handling
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

process.on('unhandledRejection', (error) => {
    console.error('Unhandled Rejection:', error);
    process.exit(1);
});

// Execute the build process
runBuild();