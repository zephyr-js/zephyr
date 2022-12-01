import { color, generateProjectName } from '@/lib/cli-kit';
import { forceUnicode } from '@/lib/cli-kit/utils';
import { execa, execaCommand } from 'execa';
import fs from 'fs';
import { downloadTemplate } from 'giget';
import { bold, dim, green, reset } from 'kleur/colors';
import ora from 'ora';
import path from 'path';
import prompts from 'prompts';
import detectPackageManager from 'which-pm-runs';
import yargs from 'yargs-parser';
import { loadWithRocketGradient, rocketAscii } from './gradient';
import { logger } from './logger';
import { info, nextSteps } from './messages';

// NOTE: In the v7.x version of npm, the default behavior of `npm init` was changed
// to no longer require `--` to pass args and instead pass `--` directly to us. This
// broke our arg parser, since `--` is a special kind of flag. Filtering for `--` here
// fixes the issue so that create-astro now works on all npm version.
const cleanArgv = process.argv.filter((arg) => arg !== '--');
const args = yargs(cleanArgv, { boolean: ['fancy'] });
prompts.override(args);

// Enable full unicode support if the `--fancy` flag is passed
if (args.fancy) {
  forceUnicode();
}

export function mkdirp(dir: string) {
  try {
    fs.mkdirSync(dir, { recursive: true });
  } catch (e: any) {
    if (e.code === 'EEXIST') return;
    throw e;
  }
}

// Some existing files and directories can be safely ignored when checking if a directory is a valid project directory.
// https://github.com/facebook/create-react-app/blob/d960b9e38c062584ff6cfb1a70e1512509a966e7/packages/create-react-app/createReactApp.js#L907-L934
const VALID_PROJECT_DIRECTORY_SAFE_LIST = [
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
  '.yarn',
  '.yarnrc.yml',
  'docs',
  'LICENSE',
  'mkdocs.yml',
  'Thumbs.db',
  /\.iml$/,
  /^npm-debug\.log/,
  /^yarn-debug\.log/,
  /^yarn-error\.log/,
];

function isValidProjectDirectory(dirPath: string) {
  if (!fs.existsSync(dirPath)) {
    return true;
  }

  const conflicts = fs.readdirSync(dirPath).filter((content) => {
    return !VALID_PROJECT_DIRECTORY_SAFE_LIST.some((safeContent) => {
      return typeof safeContent === 'string'
        ? content === safeContent
        : safeContent.test(content);
    });
  });

  return conflicts.length === 0;
}

const FILES_TO_REMOVE = [
  '.stackblitzrc',
  'sandbox.config.json',
  'CHANGELOG.md',
]; // some files are only needed for online editors when using astro.new. Remove for create-astro installs.

async function main() {
  const pkgManager = detectPackageManager()?.name || 'npm';

  logger.debug('Verbose logging turned on');

  let cwd = args['_'][2] as string;

  if (cwd && isValidProjectDirectory(cwd)) {
    const acknowledgeProjectDir = ora({
      color: 'green',
      text: `Using ${bold(cwd)} as project directory.`,
    });
    acknowledgeProjectDir.succeed();
  }

  if (!cwd || !isValidProjectDirectory(cwd)) {
    const notEmptyMsg = (dirPath: string) => `"${bold(dirPath)}" is not empty!`;

    if (!isValidProjectDirectory(cwd)) {
      const rejectProjectDir = ora({ color: 'red', text: notEmptyMsg(cwd) });
      rejectProjectDir.fail();
    }
    const dirResponse = await prompts(
      {
        type: 'text',
        name: 'directory',
        message: 'Where would you like to create your new project?',
        initial: generateProjectName(),
        validate(value) {
          if (!isValidProjectDirectory(value)) {
            return notEmptyMsg(value);
          }
          return true;
        },
      },
      {
        onCancel: () => ora().info(dim('Operation cancelled. See you later!')),
      },
    );
    cwd = dirResponse.directory;
  }

  if (!cwd) {
    ora().info(dim('No directory provided. See you later!'));
    process.exit(1);
  }

  // const options = await prompts(
  //   [
  //     {
  //       type: 'select',
  //       name: 'template',
  //       message: 'How would you like to setup your new project?',
  //       choices: TEMPLATES,
  //     },
  //   ],
  //   {
  //     onCancel: () => ora().info(dim('Operation cancelled. See you later!')),
  //   },
  // );

  // if (!options.template || options.template === true) {
  //   ora().info(dim('No template provided. See you later!'));
  //   process.exit(1);
  // }

  const templateSpinner = await loadWithRocketGradient(
    'Copying project files...',
  );

  const hash = args.commit ? `#${args.commit}` : '';

  // const isThirdParty = options.template.includes('/');
  // const templateTarget = isThirdParty
  //   ? options.template
  //   : `zephyr-js/zephyr/examples/${options.template}#latest`;

  // Copy
  if (!args.dryRun) {
    const templateTarget = 'zephyr-js/zephyr/examples/basic';

    try {
      await downloadTemplate(`${templateTarget}${hash}`, {
        force: true,
        provider: 'github',
        cwd,
        dir: '.',
      });
    } catch (err: any) {
      fs.rmdirSync(cwd);
      // if (err.message.includes('404')) {
      //   console.error(
      //     `Template ${color.underline(options.template)} does not exist!`,
      //   );
      // } else {
      //   console.error(err.message);
      // }
      console.error(err.message);
      process.exit(1);
    }

    // Post-process in parallel
    await Promise.all(
      FILES_TO_REMOVE.map(async (file) => {
        const fileLoc = path.resolve(path.join(cwd, file));
        if (fs.existsSync(fileLoc)) {
          return fs.promises.rm(fileLoc, {});
        }
      }),
    );
  }

  templateSpinner.text = green('Template copied!');
  templateSpinner.succeed();

  const installResponse = await prompts(
    {
      type: 'confirm',
      name: 'install',
      message: `Would you like to install ${pkgManager} dependencies? ${reset(
        dim('(recommended)'),
      )}`,
      initial: true,
    },
    {
      onCancel: () => {
        ora().info(
          dim(
            'Operation cancelled. Your project folder has already been created, however no dependencies have been installed',
          ),
        );
        process.exit(1);
      },
    },
  );

  if (args.dryRun) {
    ora().info(dim('--dry-run enabled, skipping.'));
  } else if (installResponse.install) {
    const installExec = execa(pkgManager, ['install'], { cwd });
    const installingPackagesMsg = `Installing packages${emojiWithFallback(
      ' 📦',
      '...',
    )}`;
    const installSpinner = await loadWithRocketGradient(installingPackagesMsg);
    await new Promise<void>((resolve, reject) => {
      installExec.stdout?.on('data', function (data) {
        installSpinner.text = `${rocketAscii} ${installingPackagesMsg}\n${bold(
          `[${pkgManager}]`,
        )} ${data}`;
      });
      installExec.on('error', (error) => reject(error));
      installExec.on('close', () => resolve());
    });
    installSpinner.text = green('Packages installed!');
    installSpinner.succeed();
  } else {
    await info('No problem!', 'Remember to install dependencies after setup.');
  }

  const gitResponse = await prompts(
    {
      type: 'confirm',
      name: 'git',
      message: `Would you like to initialize a new git repository? ${reset(
        dim('(optional)'),
      )}`,
      initial: true,
    },
    {
      onCancel: () => {
        ora().info(
          dim(
            'Operation cancelled. No worries, your project folder has already been created',
          ),
        );
        process.exit(1);
      },
    },
  );

  if (args.dryRun) {
    ora().info(dim('--dry-run enabled, skipping.'));
  } else if (gitResponse.git) {
    await execaCommand('git init', { cwd });
    ora().succeed('Git repository created!');
  } else {
    await info(
      'Sounds good!',
      `You can come back and run ${color.reset('git init')}${color.dim(
        ' later.',
      )}`,
    );
  }

  if (args.dryRun) {
    ora().info(dim('--dry-run enabled, skipping.'));
  }

  const projectDir = path.relative(process.cwd(), cwd);
  const devCmd = pkgManager === 'npm' ? 'npm run dev' : `${pkgManager} dev`;
  await nextSteps({ projectDir, devCmd });
}

function emojiWithFallback(char: string, fallback: string) {
  return process.platform !== 'win32' ? char : fallback;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
