/**
 * 主题管理器
 * 负责主题的切换、持久化、CSS 变量管理等
 */
import { ref, computed } from 'vue';
import type {
  ThemeConfig,
  ThemeName,
  ThemeMode,
  ThemeManagerOptions,
  ThemeSwitchOptions,
  ColorSystem,
  CssVariables,
} from '../types/theme';
import { themePresets } from '../themes/presets';
import { defaultDesignTokens } from '../tokens/design';
import {
  generateCssVariables,
  applyCssVariables,
  removeCssVariables,
  getCssVariables,
} from './css-generator';

/**
 * 默认配置
 */
const DEFAULT_OPTIONS: ThemeManagerOptions = {
  defaultTheme: 'blue',
  defaultMode: 'light',
  prefix: 'le',
  storageKey: 'app-theme-config',
  rootElement: undefined, // 使用时再获取 document.documentElement
};

/**
 * 主题管理器类
 */
export class ThemeManager {
  private static instance: ThemeManager;

  // 响应式状态
  private theme = ref<ThemeName>('blue');
  private mode = ref<ThemeMode>('light');
  private options: ThemeManagerOptions;

  // 计算属性
  public readonly config = computed<ThemeConfig>(() => {
    const preset = themePresets[this.theme.value];
    if (!preset) {
      throw new Error(`Theme preset '${this.theme.value}' not found`);
    }

    const colorSystem = this.mode.value === 'dark' ? preset.dark : preset.light;

    return {
      name: this.theme.value,
      mode: this.mode.value,
      colors: this.mergeColorSystem(colorSystem),
      tokens: defaultDesignTokens,
    };
  });

  public readonly cssVars = computed<CssVariables>(() => {
    return generateCssVariables(
      this.config.value.colors,
      this.config.value.tokens,
      this.options.prefix
    );
  });

  private constructor(options?: Partial<ThemeManagerOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };

    // 初始化主题
    this.loadFromStorage();
  }

  /**
   * 获取单例实例
   */
  public static getInstance(options?: Partial<ThemeManagerOptions>): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager(options);
    }
    return ThemeManager.instance;
  }

  /**
   * 合并颜色系统（补全缺失的颜色）
   */
  private mergeColorSystem(partial: Partial<ColorSystem>): ColorSystem {
    // 默认颜色系统
    const defaultColors: ColorSystem = {
      primary: '#1677ff',
      primaryHover: '#4096ff',
      primaryActive: '#0958d9',
      primarySuppl: '#69b1ff',

      info: '#1677ff',
      infoHover: '#4096ff',
      infoActive: '#0958d9',
      infoSuppl: '#69b1ff',

      success: '#52c41a',
      successHover: '#73d13d',
      successActive: '#389e0d',
      successSuppl: '#95de64',

      warning: '#faad14',
      warningHover: '#ffc53d',
      warningActive: '#d48806',
      warningSuppl: '#ffd666',

      error: '#f5222d',
      errorHover: '#ff4d4f',
      errorActive: '#cf1322',
      errorSuppl: '#ff7875',

      neutral: {
        base: '#ffffff',
        invertBase: '#000000',
        textBase: '#000000e0',
        popover: '#ffffff',
        card: '#ffffff',
        modal: '#ffffff',
        body: '#f5f5f5',
      },

      text: {
        base: '#000000e0',
        primary: '#000000e0',
        secondary: '#00000073',
        tertiary: '#00000045',
        disabled: '#00000040',
        inverse: '#ffffffd1',
      },

      border: {
        base: '#e8e8e8',
        light: '#f0f0f0',
        dark: '#d8d8d8',
      },

      bg: {
        base: '#ffffff',
        container: '#f5f5f5',
        elevated: '#ffffff',
        section: '#fafafa',
        hover: 'rgba(0, 0, 0, 0.04)',
        active: 'rgba(0, 0, 0, 0.08)',
        disabled: 'rgba(0, 0, 0, 0.02)',
      },

      divider: '#e8e8e8',
      mask: 'rgba(0, 0, 0, 0.45)',
      code: '#f5f5f5',

      opacity: {
        disabled: 0.5,
        hover: 0.08,
        active: 0.12,
      },
    };

    // 深度合并
    return {
      ...defaultColors,
      ...partial,
      neutral: {
        ...defaultColors.neutral,
        ...(partial.neutral || {}),
      },
      text: {
        ...defaultColors.text,
        ...(partial.text || {}),
      },
      border: {
        ...defaultColors.border,
        ...(partial.border || {}),
      },
      bg: {
        ...defaultColors.bg,
        ...(partial.bg || {}),
      },
      opacity: {
        ...defaultColors.opacity,
        ...(partial.opacity || {}),
      },
    };
  }

  /**
   * 设置主题
   */
  public setTheme(theme: ThemeName): void {
    if (!themePresets[theme]) {
      console.error(`Theme '${theme}' not found`);
      return;
    }

    this.theme.value = theme;
    this.applyTheme();
    this.saveToStorage();
  }

  /**
   * 设置模式
   */
  public setMode(mode: ThemeMode): void {
    this.mode.value = mode;
    this.applyTheme();
    this.saveToStorage();
  }

  /**
   * 切换模式
   */
  public toggleMode(): void {
    this.setMode(this.mode.value === 'light' ? 'dark' : 'light');
  }

  /**
   * 初始化主题
   */
  public initTheme(options?: ThemeSwitchOptions): void {
    if (options?.theme) {
      this.theme.value = options.theme;
    }

    if (options?.mode) {
      this.mode.value = options.mode;
    }

    this.applyTheme();

    if (options?.persist !== false) {
      this.saveToStorage();
    }
  }

  /**
   * 获取 CSS 变量
   */
  public getCssVar(name: string): string {
    const element = this.options.rootElement || document.documentElement;
    const fullName = name.startsWith('--') ? name : `--${this.options.prefix}-${name}`;
    return getComputedStyle(element).getPropertyValue(fullName).trim();
  }

  /**
   * 获取所有 CSS 变量
   */
  public getAllCssVars(): Record<string, string> {
    const element = this.options.rootElement || document.documentElement;
    return getCssVariables(element, this.options.prefix);
  }

  /**
   * 应用主题到 DOM
   */
  private applyTheme(): void {
    const element = this.options.rootElement || document.documentElement;

    // 移除旧的 CSS 变量
    removeCssVariables(element, this.options.prefix);

    // 应用新的 CSS 变量
    applyCssVariables(this.cssVars.value, element);

    // 设置 data-theme 属性
    element.setAttribute('data-theme', this.theme.value);
    element.setAttribute('data-theme-mode', this.mode.value);
  }

  /**
   * 从 localStorage 加载主题配置
   */
  private loadFromStorage(): void {
    if (typeof window === 'undefined' || !this.options.storageKey) {
      return;
    }

    try {
      const stored = localStorage.getItem(this.options.storageKey);
      if (stored) {
        const config = JSON.parse(stored);
        if (config.theme && themePresets[config.theme]) {
          this.theme.value = config.theme;
        }
        if (config.mode === 'light' || config.mode === 'dark') {
          this.mode.value = config.mode;
        }
      }
    } catch (error) {
      console.error('Failed to load theme from storage:', error);
    }
  }

  /**
   * 保存主题配置到 localStorage
   */
  private saveToStorage(): void {
    if (typeof window === 'undefined' || !this.options.storageKey) {
      return;
    }

    try {
      const config = {
        theme: this.theme.value,
        mode: this.mode.value,
      };
      localStorage.setItem(this.options.storageKey, JSON.stringify(config));
    } catch (error) {
      console.error('Failed to save theme to storage:', error);
    }
  }

  /**
   * 获取当前主题名
   */
  public getTheme(): ThemeName {
    return this.theme.value;
  }

  /**
   * 获取当前模式
   */
  public getMode(): ThemeMode {
    return this.mode.value;
  }

  /**
   * 获取主题配置
   */
  public getConfig(): ThemeConfig {
    return this.config.value;
  }

  /**
   * 获取 CSS 变量配置
   */
  public getCssVariables(): CssVariables {
    return this.cssVars.value;
  }
}

/**
 * 默认主题管理器实例
 */
export const themeManager = ThemeManager.getInstance();
