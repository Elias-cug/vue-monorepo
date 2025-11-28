import { defineStore } from 'pinia';
import { useAppStore } from '@base/store/app';
import { dynamicRegisterRouter } from '@base/router';
import type { AuthState, UserInfo, Menu } from '@base/types/auth';
import {
  formatMenus,
  formatFlatMenus,
  formatHomeMenu,
  genCachedRoutes,
} from '@base/helper/authHelper';
import { fetchUserInfo, fetchMenus } from '@base/api/auth';

export const useAuthStore = defineStore('auth', {
  state: () =>
    ({
      userInfo: null,
      menus: [],
      homeMenu: null,
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
     * 设置首页菜单
     * @param payload 菜单列表
     */
    setHomeMenu(payload: Menu | null) {
      this.homeMenu = payload;
    },
    /**
     * 扁平化菜单并存储
     * @param payload 菜单列表
     */
    setFlatMenus(payload: Menu[]) {
      this.flatMenus = payload;
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
    /**
     * 获取用户信息并存储
     * @param token 用户 token
     */
    async getUserInfo(token: string) {
      const userInfo = await fetchUserInfo(token);
      return userInfo;
    },
    /**
     * 获取菜单并存储
     * @param token 用户 token
     */
    async getMenus(token: string) {
      const menus = await fetchMenus(token);
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

      this.setUserInfo(userInfo.data);
      this.setMenus(formatMenus(menus.data));
      this.setFlatMenus(formatFlatMenus(menus.data));
      this.setHomeMenu(formatHomeMenu(this.flatMenus));
      this.setBtns(btns);
      this.setDics(dics);
      this.setParams(params);
      this.setLoaded(true);

      const appStore = useAppStore();
      appStore.setCachedRoutes(genCachedRoutes(this.flatMenus));
      dynamicRegisterRouter(this.flatMenus);
    },
  },
});
