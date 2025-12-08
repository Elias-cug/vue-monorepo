/**
 * @description: theme package exports
 */

// 导出类型定义
export type {
  ThemeMode,
  ThemeName,
  ColorSystem,
  ThemeConfig,
  ThemePreset,
  CssVariables,
  ThemeManagerOptions,
  ThemeSwitchOptions,
  UseThemeReturn,
} from './types/theme';

export type { DesignTokens } from './tokens/design';

export type { ColorPalette, ColorName, PresetPrimaryColors, PresetPalettes } from './types/presets';

// 导出主题管理器
export { themeManager, ThemeManager } from './core/theme-manager';

// 导出 CSS 变量生成器
export {
  generateColorCssVars,
  generateTokenCssVars,
  generateCssVariables,
  applyCssVariables,
  getCssVariables,
  removeCssVariables,
} from './core/css-generator';

// 导出 Vue 组合式 API
export { useTheme } from './composables/useTheme';

// 导出 Naive UI 适配器
export { createNaiveLightTheme, createNaiveDarkTheme, createNaiveTheme } from './adapters/naive';

// 导出侧边栏菜单主题
export { createSidebarMenuTheme, createDefaultMenuTheme } from './adapters/sidebar-menu';

// 导出预设主题
export { themePresets } from './themes/presets';

// 导出设计 tokens
export { defaultDesignTokens } from './tokens/design';

// 导出预设颜色
export * from './presets';
