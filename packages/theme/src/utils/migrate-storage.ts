/**
 * 迁移旧的主题存储数据到新的存储键
 * 从 app-theme 和 app-mode 迁移到 vue-monorepo-theme-config
 */
export function migrateThemeStorage(): void {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }

  try {
    // 检查是否已有新的配置
    const newConfig = localStorage.getItem('vue-monorepo-theme-config');
    if (newConfig) {
      // 如果已有新配置，清理旧的键
      localStorage.removeItem('app-theme');
      localStorage.removeItem('app-mode');
      return;
    }

    // 读取旧的配置
    const oldTheme = localStorage.getItem('app-theme');
    const oldMode = localStorage.getItem('app-mode');

    if (oldTheme || oldMode) {
      // 构建新的配置对象
      const config = {
        theme: oldTheme || 'blue',
        mode: oldMode || 'light',
      };

      // 保存到新的键
      localStorage.setItem('vue-monorepo-theme-config', JSON.stringify(config));

      // 清理旧的键
      localStorage.removeItem('app-theme');
      localStorage.removeItem('app-mode');

      console.log('[Theme] 已迁移旧的主题配置到新的存储键');
    }
  } catch (error) {
    console.error('[Theme] 迁移主题存储失败:', error);
  }
}
