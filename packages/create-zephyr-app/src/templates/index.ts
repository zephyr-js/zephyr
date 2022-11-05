import fs from 'fs';
import path from 'path';
import os from 'os';
import cpy from 'cpy';
import { install } from '@/utils/install';
import { PackageManager } from '@/utils/common';

interface InstallTemplateOptions {
  appName: string;
  root: string;
  template: string;
  packageManager: PackageManager;
}

export const installTemplate = async ({
  appName,
  root,
  template,
  packageManager,
}: InstallTemplateOptions) => {
  const packageJson = {
    name: appName,
    version: '0.1.0',
    private: true,
    scripts: {
      dev: 'zephyr dev',
      build: 'zephyr build',
      start: 'zephyr start',
      lint: 'zephyr lint',
    },
  };
  /**
   * Write it to disk.
   */
  fs.writeFileSync(
    path.join(root, 'package.json'),
    JSON.stringify(packageJson, null, 2) + os.EOL,
  );

  /**
   * Default dependencies.
   */
  // const dependencies = ['@zephyr-js/core'];
  const dependencies: string[] = [];
  const devDependencies = [
    'typescript',
    '@types/node',
    'eslint',
    'prettier',
    'eslint-config-prettier',
    'eslint-import-resolver-typescript',
    'eslint-plugin-import',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
  ];
  /**
   * Install package.json dependencies if they exist.
   */
  if (dependencies.length) {
    console.log();
    console.log('Installing dependencies:');
    for (const dependency of dependencies) {
      console.log(`- ${dependency}`);
    }
    console.log();

    await install(root, dependencies, { packageManager });
  }
  if (devDependencies.length) {
    console.log();
    console.log('Installing dev dependencies:');
    for (const devDependency of devDependencies) {
      console.log(`- ${devDependency}`);
    }
    console.log();

    await install(root, devDependencies, {
      packageManager,
      dev: true,
    });
  }
  /**
   * Copy the template files to the target directory.
   */
  console.log('\nInitializing project with template:', template, '\n');

  const templatePath = path.join(__dirname, 'templates', template);

  await cpy('**', root, {
    parents: true,
    cwd: templatePath,
    rename: (name) => {
      switch (name) {
      case 'gitignore':
      case 'eslintrc.yml':
      case 'prettierrc.yml': {
        return '.'.concat(name);
      }
      // README.md is ignored by webpack-asset-relocator-loader used by ncc:
      // https://github.com/vercel/webpack-asset-relocator-loader/blob/e9308683d47ff507253e37c9bcbb99474603192b/src/asset-relocator.js#L227
      case 'README-template.md': {
        return 'README.md';
      }
      default: {
        return name;
      }
      }
    },
  });
};
