import { defineStore } from 'pinia';
import { menusMock } from '../mock/menus';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    menus: menusMock,
  }),
  actions: {
    setMenus(payload: any) {
      this.menus = payload;
    },
  },
});
