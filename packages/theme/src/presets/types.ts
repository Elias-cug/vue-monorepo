/**
 * 颜色调色板类型定义
 */

export interface ColorPalette extends Array<string> {
  /** 主色值，通常是索引为5的颜色 */
  primary: string;
}

export type ColorName =
  | 'red'
  | 'volcano'
  | 'orange'
  | 'gold'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'cyan'
  | 'blue'
  | 'geekblue'
  | 'purple'
  | 'magenta'
  | 'grey';

export type PresetPrimaryColors = Record<ColorName, string>;
export type PresetPalettes = Record<ColorName, ColorPalette>;
