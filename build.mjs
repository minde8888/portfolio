import { build } from 'esbuild'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function runBuild() {
   // Generuojame tipus
   await execAsync('tsc --emitDeclarationOnly --declaration')

   // Bendros konfigūracijos
   const commonConfig = {
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
           'tsyringe'
       ],
       define: {
           'process.env.NODE_ENV': '"production"'
       },
       plugins: [
           {
               name: 'production-check',
               setup(build) {
                   build.onEnd(result => {
                       if (result.errors.length) {
                           console.error('Build failed:', result.errors)
                       } else {
                           console.log('Build completed successfully!')
                           // Build dydžio analizė
                           const outFiles = result.metafile?.outputs || {}
                           Object.entries(outFiles).forEach(([file, meta]) => {
                               console.log(`${file}: ${(meta.bytes / 1024).toFixed(2)}kb`)
                           })
                       }
                   })
               }
           }
       ]
   }

   // CommonJS build
   await build({
       ...commonConfig,
       entryPoints: ['src/index.ts'],
       outfile: 'dist/index.js',
       format: 'cjs'
   })

   // ESM build
   await build({
       ...commonConfig,
       entryPoints: ['src/index.ts'],
       outfile: 'dist/index.mjs',
       format: 'esm'
   })

   console.log('All builds completed successfully!')
}

// Error handling
process.on('uncaughtException', (error) => {
   console.error('Uncaught Exception:', error)
   process.exit(1)
})

process.on('unhandledRejection', (error) => {
   console.error('Unhandled Rejection:', error)
   process.exit(1)
})

// Run build
runBuild().catch((err) => {
   console.error('Build failed:', err)
   process.exit(1)
})