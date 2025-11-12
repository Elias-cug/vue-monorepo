import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
  state: () => ({
    // 菜单是否折叠：true 折叠 false 展开
    collapsed: false,
  }),
  actions: {
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
  },
});
