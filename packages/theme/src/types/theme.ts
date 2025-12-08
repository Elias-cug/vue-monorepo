/**
 * 主题系统类型定义
 */
import type { PresetPrimaryColors } from './presets';
import type { DesignTokens } from '../tokens/design';

/**
 * 主题模式
 */
export type ThemeMode = 'light' | 'dark';

/**
 * 主题名称
 */
export type ThemeName = keyof PresetPrimaryColors;

/**
 * 颜色系统
 */
export interface ColorSystem {
  // 主色
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primarySuppl: string;

  // 功能色
  info: string;
  infoHover: string;
  infoActive: string;
  infoSuppl: string;

  success: string;
  successHover: string;
  successActive: string;
  successSuppl: string;

  warning: string;
  warningHover: string;
  warningActive: string;
  warningSuppl: string;

  error: string;
  errorHover: string;
  errorActive: string;
  errorSuppl: string;

  // 中性色
  neutral: {
    base: string;
    invertBase: string;
    textBase: string;
    popover: string;
    card: string;
    modal: string;
    body: string;
  };

  // 文本色
  text: {
    base: string;
    primary: string;
    secondary: string;
    tertiary: string;
    disabled: string;
    inverse: string;
  };

  // 边框色
  border: {
    base: string;
    light: string;
    dark: string;
  };

  // 背景色
  bg: {
    base: string;
    container: string;
    elevated: string;
    section: string;
    hover: string;
    active: string;
    disabled: string;
  };

  // 其他
  divider: string;
  mask: string;
  code: string;

  // 透明度
  opacity: {
    disabled: number;
    hover: number;
    active: number;
  };
}

/**
 * 主题配置
 */
export interface ThemeConfig {
  name: ThemeName;
  mode: ThemeMode;
  colors: ColorSystem;
  tokens: DesignTokens;
}

/**
 * 主题预设
 */
export interface ThemePreset {
  name: ThemeName;
  label: string; // 主题的显示名称
  primaryColor: string; // 主题的主色值
  light: Partial<ColorSystem>;
  dark: Partial<ColorSystem>;
}

/**
 * CSS 变量映射
 */
export interface CssVariables {
  // 颜色变量
  colors: Record<string, string>;
  // 设计 token 变量
  tokens: Record<string, string | number>;
}

/**
 * 主题管理器配置
 */
export interface ThemeManagerOptions {
  defaultTheme?: ThemeName;
  defaultMode?: ThemeMode;
  prefix?: string; // CSS 变量前缀，默认 'le'
  storageKey?: string; // localStorage 存储键名
  rootElement?: HTMLElement; // 挂载元素，默认 document.documentElement
}

/**
 * 主题切换选项
 */
export interface ThemeSwitchOptions {
  theme?: ThemeName;
  mode?: ThemeMode;
  persist?: boolean; // 是否持久化到 localStorage, 默认 true
}

/**
 * useTheme hook 返回值
 */
export interface UseThemeReturn {
  // 当前状态（响应式）
  theme: import('vue').ComputedRef<ThemeName>;
  mode: import('vue').ComputedRef<ThemeMode>;
  config: import('vue').ComputedRef<ThemeConfig>;
  cssVars: import('vue').ComputedRef<CssVariables>;

  // 操作方法
  setTheme: (theme: ThemeName) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  initTheme: (options?: ThemeSwitchOptions) => void;

  // 工具方法
  getCssVar: (name: string) => string;
  getAllCssVars: () => Record<string, string>;
}
