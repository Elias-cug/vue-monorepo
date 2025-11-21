import { defineStore } from 'pinia';
import type { AuthState, UserInfo, Menu } from '@base/types/auth';
import { menusMock } from '../mock/menus';
import { fetchUserInfo, fetchMenus } from '../api/auth';

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      userInfo: null,
      menus: menusMock,
      flatMenus: [],
      btns: [],
      // 字典项
      dics: {},
      // 参数项
      params: {},

      isLoaded: false,
    }) as AuthState,
  getters: {},
  actions: {
    setUserInfo(payload: UserInfo) {
      this.userInfo = payload;
    },
    setMenus(payload: Menu[]) {
      this.menus = payload;
    },
    /**
     * 扁平化菜单并存储
     * @param payload 菜单列表
     */
    setFlatMenus(payload: Menu[]) {
      const flatMenus: Menu[] = [];
      const flatten = (menus: Menu[]) => {
        menus.forEach(menu => {
          if (menu.path) {
            flatMenus.push(menu);
          }
          if (menu.children && menu.children.length > 0) {
            flatten(menu.children);
          }
        });
      };
      flatten(payload);
      this.flatMenus = flatMenus;
    },
    setBtns(payload: any) {
      this.btns = payload;
    },
    setDics(payload: any) {
      this.dics = payload;
    },
    setParams(payload: any) {
      this.params = payload;
    },
    setLoaded(loaded: boolean) {
      this.isLoaded = loaded;
    },
    getAndSetMenus(_payload: any) {},
    /**
     * 获取用户信息并存储
     * @param token 用户 token
     */
    async getUserInfo(token: string) {
      const userInfo = await fetchUserInfo(token);
      this.setUserInfo(userInfo);
      return userInfo;
    },
    /**
     * 获取菜单并存储
     * @param token 用户 token
     */
    async getMenus(token: string) {
      const menus = await fetchMenus(token);
      this.setMenus(menus);
      return menus;
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
    async getAllAuthInfo(token: string) {
      // 使用 Promise.all 并发获取用户信息、菜单、按钮、字典、参数
      const [userInfo, menus, btns, dics, params] = await Promise.all([
        this.getUserInfo(token),
        this.getMenus(token),
        this.getBtns(),
        this.getDics(),
        this.getParams(),
      ]);

      this.setUserInfo(userInfo);
      this.setMenus(menus);
      this.setFlatMenus(menus);
      this.setBtns(btns);
      this.setDics(dics);
      this.setParams(params);
      this.setLoaded(true);
      return { userInfo, menus, btns, dics, params };
    },
  },
});
