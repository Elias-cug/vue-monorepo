import { light } from './light';
import { dark } from './dark';
import { blue } from './blue';
import { blueDark } from './blue-dark';
import { red } from './red';
import { redDark } from './red-dark';
import { green } from './green';
import { greenDark } from './green-dark';
import type { ThemeDefinition as ThemeDef } from '../types';

export const colors = {
  blue: '#2563eb',
  blueDark: '#1e40af',
  red: '#ef4444',
  redDark: '#dc2626',
  green: '#22c55e',
  greenDark: '#16a34a',
};

export const themes = {
  light,
  dark,
  blue,
  blueDark,
  red,
  redDark,
  green,
  greenDark,
} as const;

export type ThemeName = keyof typeof themes;
export type { ThemeDef as ThemeDefinition };

// 导出所有主题
export { light, dark, blue, blueDark, red, redDark, green, greenDark };
