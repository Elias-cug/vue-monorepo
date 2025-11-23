import { routeMap } from '@base/router/setupRoutes';

export function formatUserInfo(userInfo: any) {
  return userInfo;
}

export function formatMenus(menus: any) {
  // 将 routeMap 的所有信息合并到 menus 中，menus 是树状结构
  const dfs = (menus: any) => {
    menus.forEach((menu: any) => {
      Object.assign(menu, routeMap[menu.key]);
      if (menu.children) {
        dfs(menu.children);
      }
    });
  };
  dfs(menus);
  return menus;
}

export function formatFlatMenus(menus: any) {
  const flatMenus: any[] = [];
  const dfs = (menus: any) => {
    menus.forEach((menu: any) => {
      flatMenus.push({ ...routeMap[menu.key], ...menu });
      if (menu.children) {
        dfs(menu.children);
      }
    });
  };
  dfs(menus);
  return flatMenus;
}

export function formatBtns(btns: any) {
  return btns;
}

export function formatDic(dics: any) {
  return dics;
}

export function formatParam(params: any) {
  return params;
}

export function genCachedRoutes(menus: any[]) {
  return menus.filter((menu: any) => menu.meta?.keepAlive === true).map((menu: any) => menu.name);
}
