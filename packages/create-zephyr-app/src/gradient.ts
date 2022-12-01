import chalk from 'chalk';
import type { Ora } from 'ora';
import ora from 'ora';

const gradientColors = [
  '#8693AB',
  '#7D97B0',
  '#7799B3',
  '#6F9CB8',
  '#679FBC',
  '#5DA3C1',
  '#56A6C5',
  '#4EA8C8',
  '#48AACA',
  '#3EADCF',
];

export const rocketAscii = '■■▶';

// get a reference to scroll through while loading
// visual representation of what this generates:
// gradientColors: "..xxXX"
// referenceGradient: "..xxXXXXxx....xxXX"
const referenceGradient = [
  ...gradientColors,
  // draw the reverse of the gradient without
  // accidentally mutating the gradient (ugh, reverse())
  ...[...gradientColors].reverse(),
  ...gradientColors,
];

// async-friendly setTimeout
const sleep = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });

function getGradientAnimFrames() {
  const frames = [];
  for (let start = 0; start < gradientColors.length * 2; start++) {
    const end = start + gradientColors.length - 1;
    frames.push(
      referenceGradient
        .slice(start, end)
        .map((g) => chalk.bgHex(g)(' '))
        .join(''),
    );
  }
  return frames;
}

function getIntroAnimFrames() {
  const frames = [];
  for (let end = 1; end <= gradientColors.length; end++) {
    const leadingSpacesArr = Array.from(
      new Array(Math.abs(gradientColors.length - end - 1)),
      () => ' ',
    );
    const gradientArr = gradientColors
      .slice(0, end)
      .map((g) => chalk.bgHex(g)(' '));
    frames.push([...leadingSpacesArr, ...gradientArr].join(''));
  }
  return frames;
}

/**
 * Generate loading spinner with rocket flames!
 * @param text display text next to rocket
 * @returns Ora spinner for running .stop()
 */
export async function loadWithRocketGradient(text: string): Promise<Ora> {
  const frames = getIntroAnimFrames();
  const intro = ora({
    spinner: {
      interval: 30,
      frames,
    },
    text: `${rocketAscii} ${text}`,
  });
  intro.start();
  await sleep((frames.length - 1) * intro.interval);
  intro.stop();
  const spinner = ora({
    spinner: {
      interval: 80,
      frames: getGradientAnimFrames(),
    },
    text: `${rocketAscii} ${text}`,
  }).start();

  return spinner;
}
