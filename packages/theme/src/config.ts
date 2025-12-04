/**
 * 主题配置文件
 * 集中管理主题的展示配置
 */

import { themes } from './themes';
import { lightDisplayColor } from './themes/light';
import { darkDisplayColor } from './themes/dark';
import { blueDisplayColor } from './themes/blue';
import { redDisplayColor } from './themes/red';
import { greenDisplayColor } from './themes/green';

// 主题展示配置
export interface ThemeDisplayConfig {
  name: string;
  label: string;
  color: string;
  description?: string;
}

// 主题展示颜色映射
export const themeDisplayColors = {
  light: lightDisplayColor,
  dark: darkDisplayColor,
  blue: blueDisplayColor,
  red: redDisplayColor,
  green: greenDisplayColor,
} as const;

// 获取所有主题的展示配置
export function getThemeDisplayConfigs(): ThemeDisplayConfig[] {
  return Object.entries(themes).map(([key, theme]) => ({
    name: theme.name,
    label: theme.label,
    color: themeDisplayColors[key as keyof typeof themeDisplayColors],
    description: theme.description,
  }));
}

// 获取主题选项（用于选择器）
export function getThemeOptions() {
  return getThemeDisplayConfigs().map(({ name, label, color }) => ({
    name,
    label,
    color,
  }));
}
