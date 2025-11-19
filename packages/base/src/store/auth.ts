import { defineStore } from 'pinia';
import { menusMock } from '../mock/menus';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userInfo: {},
    menus: menusMock,
    btns: [],
    // 字典项
    dics: {},
    // 参数
    params: {},
  }),
  getters: {},
  actions: {
    setMenus(payload: any) {
      this.menus = payload;
    },
    async getMenus() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.menus);
        }, 500);
      });
    },
  },
});
