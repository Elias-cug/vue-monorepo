/**
 * 主题管理器
 */
import { reactive, ref, watch } from 'vue';
import type { ThemeDefinition, ThemeMode, ThemeConfig } from '../types';
import { themes } from '../themes';

const STORAGE_KEY = 'le-theme-config';

export class ThemeManager {
  private static instance: ThemeManager;

  private config = reactive<ThemeConfig>({
    mode: 'auto',
    current: 'light',
    autoSwitchTime: {
      light: '06:00',
      dark: '18:00',
    },
  });

  private _currentTheme = ref<ThemeDefinition>(themes.light);
  private listeners = new Map<string, Set<Function>>();
  private mediaQuery: MediaQueryList | null = null;

  private constructor() {
    this.loadConfig();
    this.initMediaQuery();
    this.applyTheme();

    // 监听配置变化
    watch(
      () => this.config,
      () => {
        this.saveConfig();
        this.applyTheme();
      },
      { deep: true }
    );
  }

  static getInstance(): ThemeManager {
    if (!ThemeManager.instance) {
      ThemeManager.instance = new ThemeManager();
    }
    return ThemeManager.instance;
  }

  // 获取当前主题
  get currentTheme() {
    return this._currentTheme.value;
  }

  // 获取所有主题
  get allThemes() {
    return Object.values(themes);
  }

  // 获取主题模式
  get mode() {
    return this.config.mode;
  }

  // 设置主题
  setTheme(themeName: string) {
    const theme = themes[themeName as keyof typeof themes];
    if (!theme) {
      console.error(`Theme '${themeName}' not found`);
      return;
    }

    this.config.current = themeName;
    this._currentTheme.value = theme;
    this.applyTheme();
    this.emit('change', theme);
  }

  // 设置主题模式
  setMode(mode: ThemeMode) {
    this.config.mode = mode;
    this.emit('modeChange', mode);
    this.applyTheme();
  }

  // 切换主题（在亮暗主题间切换）
  toggle() {
    const isDark = this._currentTheme.value.isDark;
    const nextTheme = isDark ? 'light' : 'dark';
    this.setTheme(nextTheme);
  }

  // 应用主题
  private applyTheme() {
    const theme = this.getEffectiveTheme();
    this._currentTheme.value = theme;

    // 应用 CSS 变量（自动添加 --le 前缀）
    const root = document.documentElement;
    Object.entries(theme.vars).forEach(([key, value]) => {
      // 如果变量名没有 --le 前缀，自动添加
      const varName = key.startsWith('--le-') ? key : key.replace('--', '--le-');
      root.style.setProperty(varName, value as string);
    });

    // 设置 HTML 属性
    root.setAttribute('data-theme', theme.name);
    root.classList.toggle('dark', theme.isDark);
  }

  // 获取有效主题（根据模式）
  private getEffectiveTheme(): ThemeDefinition {
    if (this.config.mode === 'auto') {
      const isDark = this.shouldUseDarkTheme();
      return isDark ? themes.dark : themes.light;
    }

    return themes[this.config.current as keyof typeof themes] || themes.light;
  }

  // 判断是否应该使用暗色主题
  private shouldUseDarkTheme(): boolean {
    // 优先使用系统偏好
    if (this.mediaQuery?.matches !== undefined) {
      return this.mediaQuery.matches;
    }

    // 使用时间判断
    if (this.config.autoSwitchTime) {
      const now = new Date();
      const currentTime = now.getHours() * 60 + now.getMinutes();

      const lightParts = this.config.autoSwitchTime.light.split(':');
      const darkParts = this.config.autoSwitchTime.dark.split(':');

      if (lightParts.length !== 2 || darkParts.length !== 2) {
        return false;
      }

      const lightHour = Number(lightParts[0]);
      const lightMin = Number(lightParts[1]);
      const darkHour = Number(darkParts[0]);
      const darkMin = Number(darkParts[1]);

      const lightTime = lightHour * 60 + lightMin;
      const darkTime = darkHour * 60 + darkMin;

      return currentTime < lightTime || currentTime >= darkTime;
    }

    return false;
  }

  // 初始化媒体查询
  private initMediaQuery() {
    if (typeof window === 'undefined') return;

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    // 监听系统主题变化
    this.mediaQuery.addEventListener('change', () => {
      if (this.config.mode === 'auto') {
        this.applyTheme();
      }
    });
  }

  // 加载配置
  private loadConfig() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const config = JSON.parse(stored);
        Object.assign(this.config, config);
      } catch (e) {
        console.error('Failed to load theme config:', e);
      }
    }
  }

  // 保存配置
  private saveConfig() {
    if (typeof window === 'undefined') return;

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch (e) {
      console.error('Failed to save theme config:', e);
    }
  }

  // 事件监听
  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    // 返回取消监听函数
    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  // 触发事件
  private emit(event: string, ...args: any[]) {
    this.listeners.get(event)?.forEach(callback => {
      callback(...args);
    });
  }

  // Vue 插件安装方法
  install(app: any) {
    app.config.globalProperties.$theme = this;
    app.provide('theme', this);
  }
}

// 导出单例实例
export const themeManager = ThemeManager.getInstance();
