import { light } from './light';
import { dark } from './dark';
import { blue } from './blue';
import type { ThemeDefinition as ThemeDef } from '../types';

export const themes = {
  light,
  dark,
  blue,
} as const;

export type ThemeName = keyof typeof themes;
export type { ThemeDef as ThemeDefinition };

// 导出所有主题
export { light, dark, blue };
