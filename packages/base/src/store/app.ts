import { defineStore } from 'pinia';
import type { TabItem, AppInfo, AppState } from '@base/types/app.ts';
import { tabs } from '../mock/tabs';

export const useAppStore = defineStore('app', {
  state: () =>
    ({
      collapsed: false,
      tabs: tabs,
      activeTab: null,
      appInfo: { appId: 'app1', appName: '应用1', appIcon: '' },
    }) as AppState,
  getters: {},
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setAppInfo(payload: AppInfo) {},
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
  },
});
