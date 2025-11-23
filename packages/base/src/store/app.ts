import { defineStore } from 'pinia';
import type { TabItem, AppInfo, AppState } from '@base/types/app.ts';
import { tabs } from '../mock/tabs';

export const useAppStore = defineStore('app', {
  state: () =>
    ({
      collapsed: false,
      tabs: tabs,
      activeTab: null,
      cachedRoutes: [],
      appInfo: { appId: 'app1', appName: '应用1', appIcon: '' },
    }) as AppState,
  getters: {},
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setAppInfo(payload: AppInfo) {},

    // tabs 维护
    setTabs(payload: TabItem[]) {
      this.tabs = payload;
    },
    setActiveTab(payload: TabItem) {
      this.activeTab = payload;
    },
    addTab(payload: TabItem) {},
    updateTab(payload: TabItem) {},
    updateTabTitle(payload: { key: string; title: string }) {},
    removeTab(payload: TabItem) {},
    removeAllTabs() {},
    removeOtherTabs(payload: TabItem) {},

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
