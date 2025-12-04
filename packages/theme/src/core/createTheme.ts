/**
 * 主题创建工具
 */
import type { ThemeDefinition, ThemeVariables } from '../types';
import { tokens } from '../tokens';
import { palette } from '../palette';

// 默认主题变量
const defaultVars: ThemeVariables = {
  // 背景颜色
  '--bg': '#ffffff',
  '--bg-soft': '#f7f7f7',
  '--bg-muted': '#f0f0f0',

  // 文本颜色
  '--text': '#111827',
  '--text-soft': '#374151',
  '--text-muted': '#6b7280',

  // 功能色
  '--primary': palette.primary[400],
  '--primary-hover': palette.primary[500],
  '--primary-active': palette.primary[600],
  '--success': palette.success[400],
  '--warning': palette.warning[400],
  '--error': palette.error[400],
  '--info': palette.primary[300],

  // 边框
  '--border': '#e5e7eb',
  '--border-soft': '#f3f4f6',

  // 阴影
  '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',

  // 圆角
  '--radius-sm': tokens.borderRadiusSmall,
  '--radius-md': tokens.borderRadiusMedium,
  '--radius-lg': tokens.borderRadiusLarge,
  '--radius-xl': '16px',

  // 间距
  '--spacing-xs': '4px',
  '--spacing-sm': '8px',
  '--spacing-md': tokens.spacingBase,
  '--spacing-lg': '16px',
  '--spacing-xl': '24px',

  // 字体
  '--font-family': tokens.fontFamilyBase,
  '--font-size-xs': '12px',
  '--font-size-sm': '13px',
  '--font-size-base': tokens.fontSizeBase,
  '--font-size-lg': '16px',
  '--font-size-xl': '18px',

  // 动画
  '--transition-fast': 'all 0.15s ease',
  '--transition-base': 'all 0.3s ease',
  '--transition-slow': 'all 0.45s ease',
};

/**
 * 创建主题
 */
export function createTheme(
  name: string,
  label: string,
  isDark: boolean,
  customVars: Partial<ThemeVariables>,
  description?: string
): ThemeDefinition {
  return {
    name,
    label,
    description,
    isDark,
    vars: {
      ...defaultVars,
      ...customVars,
    },
  };
}

/**
 * 创建暗色主题变量
 */
export function createDarkVars(baseVars?: Partial<ThemeVariables>): Partial<ThemeVariables> {
  return {
    // 背景颜色
    '--bg': '#0f1724',
    '--bg-soft': '#111827',
    '--bg-muted': '#1f2937',

    // 文本颜色
    '--text': '#e6eef8',
    '--text-soft': '#d1d5db',
    '--text-muted': '#9ca3af',

    // 功能色
    '--primary': palette.primary[500],
    '--primary-hover': palette.primary[400],
    '--primary-active': palette.primary[300],
    '--success': palette.success[400],
    '--warning': palette.warning[400],
    '--error': palette.error[400],
    '--info': palette.primary[200],

    // 边框
    '--border': '#374151',
    '--border-soft': '#1f2937',

    // 阴影
    '--shadow-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    '--shadow-md': '0 4px 6px -1px rgba(0, 0, 0, 0.4), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
    '--shadow-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.5), 0 4px 6px -2px rgba(0, 0, 0, 0.3)',

    ...baseVars,
  };
}
