import { program } from 'commander';
import { execSync } from 'child_process';
import path from 'path';
import packageJson from '../package.json';

const pwd = () => {
  const main = require.main;
  if (!main) {
    throw new Error('`main` not found');
  }
  return path.dirname(main.filename);
};

program
  .name('dev')
  .version(packageJson.version)
  .description('Start Zephyr development server')
  .action(() => {
    const rootDir = path.join(pwd(), '..');
    execSync('nodemon', {
      cwd: rootDir,
    });
  });

program.parse();
