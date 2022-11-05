import path from 'path';
import chalk from 'chalk';
import { isWriteable, makeDir, PackageManager } from '@/utils/common';
import { installTemplate } from './templates';
import { tryGitInit } from './utils/git';

interface CreateAppOptions {
  appPath: string;
  packageManager: PackageManager;
}

export const createApp = async ({ appPath, packageManager }: CreateAppOptions): Promise<void> => {
  const root = path.resolve(appPath);
  
  if (!(await isWriteable(root))) {
    console.error('The application path is not writable, please check folder permissions and try again.');
    console.error(
      'It is likely you do not have write permissions for this folder.'
    );
    process.exit(1);
  }

  const appName = path.basename(root);

  await makeDir(root);

  const originalDirectory = process.cwd();

  console.log(`Creating a new Zephyr.js app in ${chalk.green(root)}.`);
  console.log();

  process.chdir(root);

  const packageJsonPath = path.join(root, 'package.json');

  await installTemplate({
    appName,
    root,
    template: 'default',
    packageManager,
  });

  console.log();

  if (tryGitInit(root)) {
    console.log('Initialized a git repository.');
    console.log();
  }

  let cdpath: string;
  if (path.join(originalDirectory, appName) === appPath) {
    cdpath = appName;
  } else {
    cdpath = appPath;
  }

  console.log(`${chalk.green('Success!')} Created ${appName} at ${appPath}`);
};