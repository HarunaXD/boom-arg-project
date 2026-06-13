import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

export function resolveProject(name) {
  if (!name) {
    throw new Error('请指定子项目目录名，例如：pnpm build demo1');
  }

  const appRoot = resolve(process.cwd(), 'apps', name);

  if (!existsSync(appRoot)) {
    throw new Error(`子项目不存在：apps/${name}`);
  }

  return { name, appRoot };
}
