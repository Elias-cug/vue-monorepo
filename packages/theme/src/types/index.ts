/**
 * 主题类型定义
 */

// 基础颜色值
export type ColorValue = string;

// 尺寸值
export type SizeValue = string | number;

// 主题变量定义
export interface ThemeVariables {
  // 背景颜色
  '--bg': ColorValue;
  '--bg-soft': ColorValue;
  '--bg-muted': ColorValue;

  // 文本颜色
  '--text': ColorValue;
  '--text-soft': ColorValue;
  '--text-muted': ColorValue;

  // 功能色
  '--primary': ColorValue;
  '--primary-hover': ColorValue;
  '--primary-active': ColorValue;
  '--success': ColorValue;
  '--warning': ColorValue;
  '--error': ColorValue;
  '--info': ColorValue;

  // 边框
  '--border': ColorValue;
  '--border-soft': ColorValue;

  // 阴影
  '--shadow-sm': string;
  '--shadow-md': string;
  '--shadow-lg': string;

  // 圆角
  '--radius-sm': SizeValue;
  '--radius-md': SizeValue;
  '--radius-lg': SizeValue;
  '--radius-xl': SizeValue;

  // 间距
  '--spacing-xs': SizeValue;
  '--spacing-sm': SizeValue;
  '--spacing-md': SizeValue;
  '--spacing-lg': SizeValue;
  '--spacing-xl': SizeValue;

  // 字体
  '--font-family': string;
  '--font-size-xs': SizeValue;
  '--font-size-sm': SizeValue;
  '--font-size-base': SizeValue;
  '--font-size-lg': SizeValue;
  '--font-size-xl': SizeValue;

  // 动画
  '--transition-fast': string;
  '--transition-base': string;
  '--transition-slow': string;
}

// 主题定义
export interface ThemeDefinition {
  name: string;
  label: string;
  description?: string;
  isDark: boolean;
  vars: ThemeVariables;
}

// 主题模式
export type ThemeMode = 'light' | 'dark' | 'auto';

// 主题配置
export interface ThemeConfig {
  mode: ThemeMode;
  current: string;
  autoSwitchTime?: {
    light: string; // 如 '06:00'
    dark: string; // 如 '18:00'
  };
}

// 主题事件
export interface ThemeEvents {
  change: (theme: ThemeDefinition) => void;
  modeChange: (mode: ThemeMode) => void;
}
