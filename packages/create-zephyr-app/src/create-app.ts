import path from 'path';
import chalk from 'chalk';
import fs from 'fs';
import {
  isFolderEmpty,
  isWriteable,
  mkdir,
  PackageManager,
} from '@/utils/common';
import { installTemplate } from './templates';
import { gitInit } from './utils/git';

interface CreateAppOptions {
  appPath: string;
  packageManager: PackageManager;
}

export const createApp = async ({
  appPath,
  packageManager,
}: CreateAppOptions): Promise<void> => {
  const root = path.resolve(appPath);

  if (!(await isWriteable(root))) {
    console.error(
      'The application path is not writable, please check folder permissions and try again.',
    );
    console.error(
      'It is likely you do not have write permissions for this folder.',
    );
    process.exit(1);
  }

  const appName = path.basename(root);

  await mkdir(root);
  if (!isFolderEmpty(root, appName)) {
    process.exit(1);
  }

  const useYarn = packageManager === 'yarn';

  const originalDirectory = process.cwd();

  console.log(`Creating a new Zephyr.js app in ${chalk.green(root)}.`);
  console.log();

  process.chdir(root);

  const packageJsonPath = path.join(root, 'package.json');

  const hasPackageJson = fs.existsSync(packageJsonPath);

  await installTemplate({
    appName,
    root,
    template: 'default',
    packageManager,
  });

  console.log();

  if (gitInit(root)) {
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

  if (hasPackageJson) {
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}dev`));
    console.log('    Starts the development server.');
    console.log();
    console.log(
      chalk.cyan(`  ${packageManager} ${useYarn ? '' : 'run '}build`),
    );
    console.log('    Builds the app for production.');
    console.log();
    console.log(chalk.cyan(`  ${packageManager} start`));
    console.log('    Runs the built app in production mode.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(chalk.cyan('  cd'), cdpath);
    console.log(
      `  ${chalk.cyan(`${packageManager} ${useYarn ? '' : 'run '}dev`)}`,
    );
    console.log();
  }
};
