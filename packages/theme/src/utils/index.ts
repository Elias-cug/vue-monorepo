import { themes, type ThemeName } from '../themes';
import type { ThemeDefinition } from '../types';
import { themeManager } from '../core/ThemeManager';

/**
 * 获取主题定义
 * @deprecated 使用 themeManager.currentTheme 代替
 */
export function getTheme(name: ThemeName): ThemeDefinition {
  return themes[name];
}

/**
 * 应用主题
 * @deprecated 使用 themeManager.setTheme 代替
 */
export function applyThemeByName(name: ThemeName) {
  themeManager.setTheme(name);
}

/**
 * 切换主题（在亮暗主题间切换）
 */
export function toggleTheme() {
  themeManager.toggle();
}

/**
 * 获取当前主题
 */
export function getCurrentTheme(): ThemeDefinition {
  return themeManager.currentTheme;
}

/**
 * 获取所有可用主题
 */
export function getAllThemes(): ThemeDefinition[] {
  return themeManager.allThemes;
}

/**
 * 监听主题变化
 */
export function onThemeChange(callback: (theme: ThemeDefinition) => void) {
  return themeManager.on('change', callback);
}

/**
 * 获取实际的 CSS 变量名（带 --le 前缀）
 */
export function getCssVarName(varName: string): string {
  return varName.startsWith('--le-') ? varName : varName.replace('--', '--le-');
}

/**
 * 获取所有 CSS 变量名映射
 */
export function getCssVarMapping(): Record<string, string> {
  const theme = getCurrentTheme();
  const mapping: Record<string, string> = {};

  Object.keys(theme.vars).forEach(key => {
    mapping[key] = getCssVarName(key);
  });

  return mapping;
}

// 导出颜色工具
export * from './color';
