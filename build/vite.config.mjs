import { resolve } from 'node:path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { repoRoot } from './project.mjs';

const appName = process.env.APP_NAME;

if (!appName) {
  throw new Error('缺少 APP_NAME，请通过根目录脚本启动，例如：pnpm build demo1');
}

const root = resolve(repoRoot, 'apps', appName);

export default defineConfig({
  root,
  base: './',
  plugins: [vue()],
  build: {
    outDir: resolve(root, 'dist'),
    emptyOutDir: true,
    assetsDir: '.',
    cssCodeSplit: false,
    rollupOptions: {
      input: resolve(root, 'index.html'),
      output: {
        entryFileNames: 'app.[hash].js',
        chunkFileNames: 'chunk.[hash].js',
        assetFileNames: 'asset.[hash][extname]',
      },
    },
  },
});
