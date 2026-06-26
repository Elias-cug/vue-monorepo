/**
 * 主题 composable，提供响应式的主题管理功能
 */
import { computed, toRef } from 'vue';
import { themeManager } from '../core/theme-manager';
import type { UseThemeReturn, ThemeName, ThemeMode, ThemeSwitchOptions } from '../types/theme';

/**
 * 主题 Hook
 * 提供完整的主题管理 API
 */
export function useTheme(): UseThemeReturn {
  // 获取主题管理器实例
  const manager = themeManager;

  // 当前主题名称（响应式）
  const theme = computed<ThemeName>({
    get: () => manager.getTheme(),
    set: value => manager.setTheme(value),
  });

  // 当前模式（响应式）
  const mode = computed<ThemeMode>({
    get: () => manager.getMode(),
    set: value => manager.setMode(value),
  });

  // 主题配置（响应式）
  const config = toRef(manager, 'config');

  // CSS 变量配置（响应式）
  const cssVars = toRef(manager, 'cssVars');

  /**
   * 设置主题
   * @param themeName 主题名称
   */
  const setTheme = (themeName: ThemeName): void => {
    manager.setTheme(themeName);
  };

  /**
   * 设置模式
   * @param themeMode 主题模式
   */
  const setMode = (themeMode: ThemeMode): void => {
    manager.setMode(themeMode);
  };

  /**
   * 切换明暗模式
   */
  const toggleMode = (): void => {
    manager.toggleMode();
  };

  /**
   * 初始化主题
   * @param options 初始化选项
   */
  const initTheme = (options?: ThemeSwitchOptions): void => {
    manager.initTheme(options);
  };

  /**
   * 获取单个 CSS 变量值
   * @param name 变量名（可以不带前缀）
   */
  const getCssVar = (name: string): string => {
    return manager.getCssVar(name);
  };

  /**
   * 获取所有 CSS 变量
   */
  const getAllCssVars = (): Record<string, string> => {
    return manager.getAllCssVars();
  };

  return {
    // 状态（保持响应式）
    theme,
    mode,
    config,
    cssVars,

    // 方法
    setTheme,
    setMode,
    toggleMode,
    initTheme,
    getCssVar,
    getAllCssVars,
  };
}
