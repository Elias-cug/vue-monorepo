/**
 * Vue 主题组合式 API
 */
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { themeManager } from '../core/ThemeManager';
import type { ThemeDefinition, ThemeMode } from '../types';

export function useTheme() {
  const currentTheme = ref<ThemeDefinition>(themeManager.currentTheme);
  const themeMode = ref<ThemeMode>(themeManager.mode);

  // 监听主题变化
  let unsubscribeTheme: (() => void) | null = null;
  let unsubscribeMode: (() => void) | null = null;

  onMounted(() => {
    // 初始化当前主题
    currentTheme.value = themeManager.currentTheme;
    themeMode.value = themeManager.mode;

    // 监听主题变化
    unsubscribeTheme = themeManager.on('change', (theme: ThemeDefinition) => {
      currentTheme.value = theme;
    });

    // 监听模式变化
    unsubscribeMode = themeManager.on('modeChange', (mode: ThemeMode) => {
      themeMode.value = mode;
    });
  });

  onUnmounted(() => {
    unsubscribeTheme?.();
    unsubscribeMode?.();
  });

  // 计算属性
  const isDark = computed(() => currentTheme.value.isDark);
  const themeName = computed(() => currentTheme.value.name);
  const themeLabel = computed(() => currentTheme.value.label);
  const themeVars = computed(() => currentTheme.value.vars);

  // 获取所有主题
  const allThemes = computed(() => themeManager.allThemes);

  // 主题操作方法
  const setTheme = (name: string) => {
    themeManager.setTheme(name);
  };

  const setMode = (mode: ThemeMode) => {
    themeManager.setMode(mode);
  };

  const toggleTheme = () => {
    themeManager.toggle();
  };

  // 获取 CSS 变量值
  const getCssVar = (varName: string) => {
    return currentTheme.value.vars[varName as keyof typeof currentTheme.value.vars];
  };

  return {
    // 响应式数据
    currentTheme: computed(() => currentTheme.value),
    themeMode: computed(() => themeMode.value),
    isDark,
    themeName,
    themeLabel,
    themeVars,
    allThemes,

    // 方法
    setTheme,
    setMode,
    toggleTheme,
    getCssVar,

    // 直接暴露管理器实例
    themeManager,
  };
}
