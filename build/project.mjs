import { existsSync } from 'node:fs';
import { dirname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');

export function resolveProject(name) {
  const projectName = name ?? resolveProjectNameFromCwd();

  if (!projectName) {
    throw new Error('请指定子项目目录名，例如：pnpm build demo1；或在 apps/<子项目> 目录内直接运行 pnpm build');
  }

  const appRoot = resolve(repoRoot, 'apps', projectName);

  if (!existsSync(appRoot)) {
    throw new Error(`子项目不存在：apps/${projectName}`);
  }

  return { name: projectName, appRoot, repoRoot };
}

function resolveProjectNameFromCwd() {
  const relativePath = relative(resolve(repoRoot, 'apps'), process.cwd());

  if (!relativePath || relativePath.startsWith('..') || relativePath.split(sep).includes('..')) {
    return undefined;
  }

  return relativePath.split(sep)[0];
}
