/**
 * App 状态持久化 composable
 *
 * 功能：
 * 1. 持久化 tabs
 * 2. 持久化 collapsed（侧边栏折叠状态）
 * 3. 可扩展：未来可以轻松添加更多需要持久化的状态
 *
 * 使用场景：
 * - 在各个 Layout 组件中引入，确保刷新后状态保持
 *
 * 注意：activeTab 不再持久化，而是根据当前路由自动计算
 */

import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../store/app';
import { ls } from '../storage';

/**
 * 生成带 appId 的存储键
 */
const createStorageKey = (appId: string, keyName: string): string => {
  return `app-${appId}-${keyName}`;
};

/**
 * 获取存储键常量工厂函数
 */
const getStorageKeys = (appId: string) =>
  ({
    TABS: createStorageKey(appId, 'tabs'),
    COLLAPSED: createStorageKey(appId, 'collapsed'),
    // 未来可以轻松扩展：
    // THEME: createStorageKey(appId, 'theme'),
    // LAYOUT_MODE: createStorageKey(appId, 'layout-mode'),
  }) as const;

/**
 * 持久化配置选项
 */
interface PersistOptions {
  /** 是否持久化 tabs，默认 true */
  tabs?: boolean;
  /** 是否持久化 collapsed，默认 true */
  collapsed?: boolean;
  /** 防抖延迟（毫秒），默认不防抖 */
  debounce?: number;
}

/**
 * App 状态持久化
 * @param appId App ID，用于生成带前缀的存储键
 * @param options 持久化选项，可以选择性开启某些状态的持久化
 */
export function useAppPersist(appId: string, options: PersistOptions = {}) {
  const {
    tabs: persistTabs = true,
    collapsed: persistCollapsed = true,
    debounce: debounceTime = 0,
  } = options;

  const appStore = useAppStore();
  const { tabs, collapsed } = storeToRefs(appStore);
  const STORAGE_KEYS = getStorageKeys(appId);

  // 创建保存函数（可选防抖）
  const createSaver = (key: string, getValue: () => any) => {
    const save = () => ls.set(key, getValue());

    if (debounceTime > 0) {
      let timer: ReturnType<typeof setTimeout> | null = null;
      return () => {
        if (timer) clearTimeout(timer);
        timer = setTimeout(save, debounceTime);
      };
    }

    return save;
  };

  // 持久化 tabs
  if (persistTabs) {
    const saveTabs = createSaver(STORAGE_KEYS.TABS, () => tabs.value);
    watch(() => tabs.value, saveTabs, { deep: true });
  }

  // 持久化 collapsed
  if (persistCollapsed) {
    const saveCollapsed = createSaver(STORAGE_KEYS.COLLAPSED, () => collapsed.value);
    watch(() => collapsed.value, saveCollapsed);
  }
}

/**
 * 从 localStorage 恢复 app 状态
 * @param appId App ID，用于生成带前缀的存储键
 */
export function restoreAppState(appId: string) {
  const STORAGE_KEYS = getStorageKeys(appId);
  return {
    tabs: ls.get(STORAGE_KEYS.TABS),
    collapsed: ls.get(STORAGE_KEYS.COLLAPSED),
  };
}

/**
 * 清除持久化的 app 状态
 * @param appId App ID，用于生成带前缀的存储键
 */
export function clearAppPersist(appId: string) {
  const STORAGE_KEYS = getStorageKeys(appId);
  Object.values(STORAGE_KEYS).forEach(key => {
    ls.remove(key);
  });
}

// 导出工厂函数供其他地方使用
export { getStorageKeys };
