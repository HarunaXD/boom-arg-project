import { resolveProject } from './project.mjs';
import { runVite } from './run-vite.mjs';

const { name } = resolveProject(process.argv[2]);

runVite(['preview', '--host', '0.0.0.0', '--config', 'build/vite.config.mjs'], name);
