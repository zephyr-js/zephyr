import fs from 'fs'
import validateProjectName from 'validate-npm-package-name'

export const isWriteable = async (directory: string): Promise<boolean> => {
  try {
    await fs.promises.access(directory, (fs.constants || fs).W_OK)
    return true
  } catch (err) {
    return false
  }
}

export const makeDir = async (
  root: string,
  options = { recursive: true }
): Promise<void> => {
  await fs.promises.mkdir(root, options)
}

export type PackageManager = 'npm' | 'yarn' | 'pnpm'

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
}

export function validatePackageName(name: string): {
  valid: boolean
  problems?: string[]
} {
  const nameValidation = validateProjectName(name)
  if (nameValidation.validForNewPackages) {
    return { valid: true }
  }

  return {
    valid: false,
    problems: [
      ...(nameValidation.errors || []),
      ...(nameValidation.warnings || []),
    ],
  }
}