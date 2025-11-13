import { defineStore } from 'pinia';
import { tabs } from '../mock/tabs';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 菜单是否折叠：true 折叠 false 展开
    collapsed: false,
    tabs: tabs,
    activeTab: tabs[0],
  }),
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setTabs(payload: any) {
      this.tabs = payload;
    },
    setActiveTab(payload: any) {
      this.activeTab = payload;
    },
  },
});
