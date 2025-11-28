import { defineStore } from 'pinia';
import type { TabItem, AppInfo, AppState } from '@base/types/app.ts';
import { restoreAppState } from '../composables/useAppPersist';
import { getAppInfoFromConfig } from '@base/helper/authHelper';

export const useAppStore = defineStore('app', {
  state: (): AppState => ({
    // 初始状态使用默认值，等待 Layout 初始化后恢复
    collapsed: false,
    tabs: [],
    cachedRoutes: [],
    appInfo: null,
  }),
  getters: {},
  actions: {
    /**
     * 从 localStorage 恢复状态
     * 在 Layout 初始化时调用（此时 appId 已设置）
     */
    restoreState() {
      const restored = restoreAppState();

      // 恢复 collapsed 状态
      if (restored.collapsed !== undefined) {
        this.collapsed = restored.collapsed;
      }

      // 恢复 tabs
      if (restored.tabs && restored.tabs.length > 0) {
        this.tabs = restored.tabs;
      }
    },

    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setAppInfo(payload: AppInfo) {
      this.appInfo = payload;
    },
    getAppInfo() {
      const appInfo = getAppInfoFromConfig();
      this.setAppInfo(appInfo);
    },
    // tabs 维护
    setTabs(payload: TabItem[]) {
      this.tabs = payload;
    },
    addTab(payload: TabItem) {
      // 检查 tab 是否已存在
      // multiTab === true 时，用 key (fullPath) 判断
      // multiTab !== true 时，用 path 判断
      const existingTab = this.tabs.find(tab => {
        if (payload.meta?.multiTab === true) {
          return tab.key === payload.key;
        }
        return tab.path === payload.path;
      });

      if (existingTab) {
        // 已存在，无需添加
        return;
      }
      // 不存在则添加新 tab
      this.tabs.push(payload);
    },
    updateTab(payload: TabItem) {
      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      const currentTab = this.tabs[index];
      if (!currentTab) return;

      // 更新 tab 信息
      const updatedTab = { ...currentTab, ...payload };
      this.tabs[index] = updatedTab;
    },
    updateTabTitle(payload: { key: string; title: string }) {
      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      const currentTab = this.tabs[index];
      if (!currentTab) return;

      // 只更新 title
      currentTab.title = payload.title;
    },
    removeTab(payload: TabItem, currentRouteKey?: string) {
      // 如果 tab 已固定，直接返回
      if (payload.meta?.pinned === true) {
        return;
      }

      const index = this.tabs.findIndex(tab => tab.key === payload.key);
      if (index === -1) return;

      // 如果删除的是当前激活的 tab，需要先记录要跳转的 tab
      const isCurrentTab = currentRouteKey === payload.key;
      let nextTab: TabItem | null = null;

      if (isCurrentTab) {
        // 优先切换到右边的 tab，如果没有则切换到左边的
        nextTab = this.tabs[index + 1] || this.tabs[index - 1] || null;
      }

      // 删除 tab
      this.tabs.splice(index, 1);

      // 返回需要跳转的 tab
      return nextTab;
    },
    removeAllTabs() {
      // 只保留已固定的 tab
      this.tabs = this.tabs.filter(tab => tab.meta?.pinned === true);
    },
    removeOtherTabs(payload: TabItem) {
      // 保留当前 tab 和已固定的 tab
      this.tabs = this.tabs.filter(tab => tab.key === payload.key || tab.meta?.pinned === true);
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
