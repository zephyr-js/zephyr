import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import validateProjectName from 'validate-npm-package-name';

export const isWriteable = async (directory: string): Promise<boolean> => {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK);
    return true;
  } catch (_) {
    return false;
  }
};

export const mkdir = async (
  root: string,
  options = { recursive: true },
): Promise<void> => {
  await fs.promises.mkdir(root, options);
};

export type PackageManager = 'npm' | 'yarn' | 'pnpm';

export const getPackageManager = (): PackageManager => {
  const userAgent = process.env.npm_config_user_agent;

  if (!userAgent) {
    return 'npm';
  }

  if (userAgent.startsWith('yarn')) {
    return 'yarn';
  } else if (userAgent.startsWith('pnpm')) {
    return 'pnpm';
  }

  return 'npm';
};

export function validatePackageName(name: string): {
  valid: boolean;
  problems: string[];
} {
  const validation = validateProjectName(name);
  if (validation.validForNewPackages) {
    return { valid: true, problems: [] };
  }

  return {
    valid: false,
    problems: [...(validation.errors || []), ...(validation.warnings || [])],
  };
}

export function isFolderEmpty(root: string, name: string): boolean {
  const validFiles = [
    '.DS_Store',
    '.git',
    '.gitattributes',
    '.gitignore',
    '.gitlab-ci.yml',
    '.hg',
    '.hgcheck',
    '.hgignore',
    '.idea',
    '.npmignore',
    '.travis.yml',
    'LICENSE',
    'Thumbs.db',
    'docs',
    'mkdocs.yml',
    'npm-debug.log',
    'yarn-debug.log',
    'yarn-error.log',
    'yarnrc.yml',
    '.yarn',
  ];

  const conflicts = fs
    .readdirSync(root)
    .filter((file) => !validFiles.includes(file))
    // Support IntelliJ IDEA-based editors
    .filter((file) => !/\.iml$/.test(file));

  if (conflicts.length > 0) {
    console.log(
      `The directory ${chalk.green(name)} contains files that could conflict:`,
    );
    console.log();
    for (const file of conflicts) {
      try {
        const stats = fs.lstatSync(path.join(root, file));
        if (stats.isDirectory()) {
          console.log(`  ${chalk.blue(file)}/`);
        } else {
          console.log(`  ${file}`);
        }
      } catch {
        console.log(`  ${file}`);
      }
    }
    console.log();
    console.log(
      'Either try using a new directory name, or remove the files listed above.',
    );
    console.log();
    return false;
  }

  return true;
}
