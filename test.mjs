import { spawn } from 'node:child_process';
import { resolve } from 'node:path';
import { resolveProject } from './build/project.mjs';

const { name, appRoot } = resolveProject(process.argv[2]);
const port = Number(process.env.PLAYWRIGHT_PORT ?? 4177);
const baseURL = `http://127.0.0.1:${port}/`;
const testDir = resolve(appRoot, '__tests__');

const server = spawn(
  process.execPath,
  ['node_modules/vite/bin/vite.js', '--host', '127.0.0.1', '--port', String(port), '--strictPort', '--config', 'build/vite.config.mjs'],
  {
    cwd: process.cwd(),
    env: { ...process.env, APP_NAME: name },
    stdio: ['ignore', 'pipe', 'pipe'],
  },
);

let serverReady = false;
const ready = new Promise((resolveReady, rejectReady) => {
  const timer = setTimeout(() => rejectReady(new Error(`Vite dev server did not start at ${baseURL}`)), 15000);

  function checkReady(data) {
    const text = data.toString();
    process.stdout.write(text);
    if (!serverReady && text.includes('Local:')) {
      serverReady = true;
      clearTimeout(timer);
      resolveReady();
    }
  }

  server.stdout.on('data', checkReady);
  server.stderr.on('data', (data) => {
    const text = data.toString();
    process.stderr.write(text);
    if (text.includes('Error:')) {
      clearTimeout(timer);
      rejectReady(new Error(text));
    }
  });
  server.once('exit', (code) => {
    if (!serverReady) {
      clearTimeout(timer);
      rejectReady(new Error(`Vite dev server exited before tests started with code ${code}`));
    }
  });
});

function stopServer() {
  if (!server.killed) {
    server.kill('SIGTERM');
  }
}

try {
  await ready;

  const playwright = spawn('node_modules/.bin/playwright', ['test', testDir, '--workers=1'], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      PLAYWRIGHT_BASE_URL: baseURL,
      PLAYWRIGHT_HTML_OPEN: 'never',
    },
    stdio: 'inherit',
  });

  const code = await new Promise((resolveCode) => playwright.once('exit', resolveCode));
  stopServer();
  process.exit(code ?? 1);
} catch (error) {
  stopServer();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
