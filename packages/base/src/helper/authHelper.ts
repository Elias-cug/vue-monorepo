import { routeMap } from '@base/router/setupRoutes';

export function formatUserInfo(userInfo: any) {
  return userInfo;
}

/**
 * 合并单个菜单节点的字段
 * 可以在这里统一维护字段合并逻辑
 */
export function mergeMenuNode(menuNode: any, routeInfo: any) {
  return {
    ...menuNode,
    ...routeInfo,
  };
}

/**
 * 判断菜单节点是否应该展示在 sidebar 中
 * 可以在这里统一维护显示逻辑
 */
export function shouldShowInSidebar(menu: any) {
  // 如果设置了 hidden 属性为 true，则不显示
  if (menu.hidden === true || menu.meta?.hidden === true) {
    return false;
  }

  // 可以添加更多判断逻辑，例如：
  // - 权限判断
  // - 路由类型判断
  // - 其他业务逻辑

  return true;
}

export function formatMenus(menus: any) {
  // 将 routeMap 的所有信息合并到 menus 中，返回新的树结构
  const dfs = (menus: any): any[] => {
    return menus
      .map((menu: any) => {
        const newMenu = mergeMenuNode(menu, routeMap[menu.key] || {});
        if (menu.children) {
          newMenu.children = dfs(menu.children);
        }
        return newMenu;
      })
      .filter((menu: any) => shouldShowInSidebar(menu));
  };
  return dfs(menus);
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

export function genMenuInfo(menuInfo: any, routeInfo: any) {
  return {
    ...menuInfo,
    ...routeInfo,
  };
}
