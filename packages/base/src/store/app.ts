import { defineStore } from 'pinia';
import type { TabItem, AppInfo, AppState } from '@base/types/app.ts';
import { tabs as defaultTabs } from '../mock/tabs';
import { restoreAppState } from '../composables/useAppPersist';

export const useAppStore = defineStore('app', {
  state: () => {
    // 从 localStorage 恢复状态
    const restored = restoreAppState();

    return {
      // 恢复 collapsed 状态，默认为 false
      collapsed: restored.collapsed ?? false,

      // 恢复 tabs，如果没有则使用默认值
      tabs: restored.tabs && restored.tabs.length > 0 ? restored.tabs : defaultTabs,

      // 恢复 activeTab
      activeTab: restored.activeTab || null,

      cachedRoutes: [],
      appInfo: { appId: 'app1', appName: '应用1', appIcon: '' },
    } as AppState;
  },
  getters: {},
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setAppInfo(_payload: AppInfo) {},

    // tabs 维护
    setTabs(payload: TabItem[]) {
      this.tabs = payload;
    },
    setActiveTab(payload: TabItem) {
      this.activeTab = payload;
    },
    addTab(payload: TabItem) {
      // 检查 tab 是否已存在
      // multiTab === true 时，用 key (fullPath) 判断
      // multiTab !== true 时，用 path 判断
      const existingTab = this.tabs.find(tab => {
        if (payload.multiTab === true) {
          return tab.key === payload.key;
        }
        return tab.path === payload.path;
      });

      if (existingTab) {
        // 已存在则更新 activeTab
        this.activeTab = existingTab;
        return;
      }
      // 不存在则添加新 tab
      this.tabs.push(payload);
      this.activeTab = payload;
    },
    updateTab(payload: TabItem) {
      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      const currentTab = this.tabs[index];
      if (!currentTab) return;

      // 更新 tab 信息
      const updatedTab = { ...currentTab, ...payload };
      this.tabs[index] = updatedTab;

      // 如果更新的是当前激活的 tab，同步更新 activeTab
      if (this.activeTab?.key === payload.key) {
        this.activeTab = updatedTab;
      }
    },
    updateTabTitle(payload: { key: string; title: string }) {
      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      const currentTab = this.tabs[index];
      if (!currentTab) return;

      // 只更新 title
      currentTab.title = payload.title;

      // 如果更新的是当前激活的 tab，同步更新 activeTab
      if (this.activeTab?.key === payload.key) {
        this.activeTab = { ...this.activeTab, title: payload.title };
      }
    },
    removeTab(payload: TabItem) {
      // 如果 tab 不可关闭，直接返回
      if (payload.closable === false) {
        return;
      }

      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      // 删除 tab
      this.tabs.splice(index, 1);

      // 如果删除的是当前激活的 tab，需要切换到其他 tab
      if (this.activeTab?.key === payload.key) {
        // 优先切换到右边的 tab，如果没有则切换到左边的
        const nextTab = this.tabs[index] || this.tabs[index - 1];
        if (nextTab) {
          this.activeTab = nextTab;
        } else {
          this.activeTab = null;
        }
      }
    },
    removeAllTabs() {
      // 只保留不可关闭的 tab
      this.tabs = this.tabs.filter(tab => tab.closable === false);

      // 如果当前激活的 tab 被删除了，切换到第一个 tab
      if (this.activeTab && this.activeTab.closable !== false) {
        this.activeTab = this.tabs[0] || null;
      }
    },
    removeOtherTabs(payload: TabItem) {
      // 保留当前 tab 和不可关闭的 tab
      this.tabs = this.tabs.filter(tab => tab.key === payload.key || tab.closable === false);

      // 设置当前 tab 为激活状态
      this.activeTab = payload;
    },

    // cachedRoutes 维护
    setCachedRoutes(payload: string[]) {
      this.cachedRoutes = payload;
    },
    addCachedRoute(payload: string) {
      if (this.cachedRoutes.includes(payload)) return;
      this.cachedRoutes.push(payload);
    },
    removeCachedRoute(payload: string) {
      this.cachedRoutes = this.cachedRoutes.filter(route => route !== payload);
    },
    clearCachedRoutes() {
      this.cachedRoutes = [];
    },
  },
});
