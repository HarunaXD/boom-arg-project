import { spawn } from 'node:child_process';
import { repoRoot } from './project.mjs';

export function runVite(args, appName) {
  const child = spawn('pnpm', ['exec', 'vite', ...args], {
    cwd: repoRoot,
    env: {
      ...process.env,
      APP_NAME: appName,
    },
    stdio: 'inherit',
  });

  child.on('exit', (code) => {
    process.exit(code ?? 1);
  });
}
