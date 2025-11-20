import { defineStore } from 'pinia';
import type { AuthState } from '@base/types/auth';
import { menusMock } from '../mock/menus';

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      userInfo: null,
      menus: menusMock,
      btns: [],
      // 字典项
      dics: {},
      // 参数项
      params: {},

      isLoaded: false,
    }) as AuthState,
  getters: {},
  actions: {
    setMenus(payload: any) {
      this.menus = payload;
    },
    getAndSetMenus(payload: any) {},
    async getUserInfo() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.userInfo);
        }, 500);
      });
    },
    async getMenus() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.menus);
        }, 500);
      });
    },
    async getBtns() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.btns);
        }, 500);
      });
    },
    async getDics() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.dics);
        }, 500);
      });
    },
    async getParams() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(this.params);
        }, 500);
      });
    },
  },
});
