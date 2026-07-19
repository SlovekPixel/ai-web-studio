import { readFileSync } from 'node:fs';
import path from 'node:path';

import { defineConfig } from 'vite';
import { VitePluginNode } from 'vite-plugin-node';

import { loadConfiguration } from './src/core/configuration/infrastructure/load-configuration';

const backendRoot = process.cwd();
const rootDir = path.resolve(backendRoot, '../..');
const packageJson = JSON.parse(
  readFileSync(path.join(backendRoot, 'package.json'), 'utf-8'),
) as { version: string };
const configuration = loadConfiguration();

export default defineConfig(({ command }) => ({
  resolve: {
    alias: {
      '~': path.resolve(backendRoot, './src'),
      '@repo/types': path.resolve(rootDir, 'packages/types/src/index.ts'),
    },
  },
  define: {
    AI_WEB_STUDIO_VERSION: JSON.stringify(packageJson.version),
  },
  server: {
    host: configuration.HOSTNAME,
    port: configuration.BACKEND_PORT,
    strictPort: true,
  },
  plugins: [
    ...VitePluginNode({
      adapter: 'nest',
      appPath: './src/main.ts',
      exportName: 'viteNodeApp',
      tsCompiler: 'swc',
    }),
  ],
  build: {
    outDir: 'dist',
    ssr: true,
    rollupOptions: {
      input: './src/main.ts',
    },
  },
  optimizeDeps: {
    exclude: [
      '@nestjs/microservices',
      '@nestjs/websockets',
      'cache-manager',
      'class-transformer',
      'class-validator',
    ],
  },
  ssr:
    command === 'build'
      ? { noExternal: true }
      : {
          external: [
            '@repo/types',
            '@nestjs/axios',
            '@nestjs/common',
            '@nestjs/config',
            '@nestjs/core',
            '@nestjs/jwt',
            '@nestjs/platform-express',
            '@nestjs/swagger',
            '@nestjs/typeorm',
            'bcryptjs',
            'express',
            'nestjs-zod',
            'pg',
            'reflect-metadata',
            'rxjs',
            'typeorm',
            'winston',
            'zod',
          ],
        },
}));
