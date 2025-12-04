import { light } from './light';
import { dark } from './dark';
import { blue } from './blue';
import { red } from './red';
import { green } from './green';
import type { ThemeDefinition as ThemeDef } from '../types';

export const themes = {
  light,
  dark,
  blue,
  red,
  green,
} as const;

export type ThemeName = keyof typeof themes;
export type { ThemeDef as ThemeDefinition };

// 导出所有主题
export { light, dark, blue, red, green };
