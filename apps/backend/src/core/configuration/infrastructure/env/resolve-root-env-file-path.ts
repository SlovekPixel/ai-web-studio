import { existsSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

function findMonorepoRoot(startDir: string): string {
  let currentDir = startDir;

  while (currentDir !== dirname(currentDir)) {
    if (existsSync(resolve(currentDir, 'pnpm-workspace.yaml'))) {
      return currentDir;
    }

    currentDir = dirname(currentDir);
  }

  throw new Error('Monorepo root not found. Expected pnpm-workspace.yaml in parent directories.');
}

export function resolveRootEnvFilePath(): string {
  const monorepoRoot = findMonorepoRoot(process.cwd());
  const envFilePath = resolve(monorepoRoot, '.env');

  if (!existsSync(envFilePath)) {
    throw new Error(`Shared .env file not found at ${envFilePath}`);
  }

  return envFilePath;
}
