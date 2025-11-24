/**
 * App 状态持久化 composable
 *
 * 功能：
 * 1. 持久化 tabs 和 activeTab
 * 2. 持久化 collapsed（侧边栏折叠状态）
 * 3. 可扩展：未来可以轻松添加更多需要持久化的状态
 *
 * 使用场景：
 * - 在各个 Layout 组件中引入，确保刷新后状态保持
 */

import { watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useAppStore } from '../store/app';
import { ls } from '../storage';

// 存储键常量
const STORAGE_KEYS = {
  TABS: 'app-tabs',
  ACTIVE_TAB: 'app-active-tab',
  COLLAPSED: 'app-collapsed',
  // 未来可以轻松扩展：
  // THEME: 'app-theme',
  // LAYOUT_MODE: 'app-layout-mode',
} as const;

/**
 * 持久化配置选项
 */
interface PersistOptions {
  /** 是否持久化 tabs，默认 true */
  tabs?: boolean;
  /** 是否持久化 activeTab，默认 true */
  activeTab?: boolean;
  /** 是否持久化 collapsed，默认 true */
  collapsed?: boolean;
  /** 防抖延迟（毫秒），默认不防抖 */
  debounce?: number;
}

/**
 * App 状态持久化
 * @param options 持久化选项，可以选择性开启某些状态的持久化
 */
export function useAppPersist(options: PersistOptions = {}) {
  const {
    tabs: persistTabs = true,
    activeTab: persistActiveTab = true,
    collapsed: persistCollapsed = true,
    debounce: debounceTime = 0,
  } = options;

  const appStore = useAppStore();
  const { tabs, activeTab, collapsed } = storeToRefs(appStore);

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

  // 持久化 activeTab
  if (persistActiveTab) {
    const saveActiveTab = createSaver(STORAGE_KEYS.ACTIVE_TAB, () => activeTab.value);
    watch(() => activeTab.value, saveActiveTab);
  }

  // 持久化 collapsed
  if (persistCollapsed) {
    const saveCollapsed = createSaver(STORAGE_KEYS.COLLAPSED, () => collapsed.value);
    watch(() => collapsed.value, saveCollapsed);
  }
}

/**
 * 从 localStorage 恢复 app 状态
 * 这个函数应该在 store 的 state 初始化时调用
 */
export function restoreAppState() {
  return {
    tabs: ls.get(STORAGE_KEYS.TABS),
    activeTab: ls.get(STORAGE_KEYS.ACTIVE_TAB),
    collapsed: ls.get(STORAGE_KEYS.COLLAPSED),
  };
}

/**
 * 清除持久化的 app 状态
 * 可用于用户退出登录时
 */
export function clearAppPersist() {
  Object.values(STORAGE_KEYS).forEach(key => {
    ls.remove(key);
  });
}

// 导出常量供其他地方使用
export { STORAGE_KEYS };

