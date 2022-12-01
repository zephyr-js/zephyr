import color from 'chalk';

export const label = (
  text: string,
  c = color.bgHex('#883AE2'),
  t = color.whiteBright,
) => c(` ${t(text)} `);
