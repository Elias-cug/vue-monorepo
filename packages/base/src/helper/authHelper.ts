import { routeMap } from '@base/router/setupRoutes';

export function formatUserInfo(userInfo: any) {
  return userInfo;
}

/**
 * 合并单个菜单节点的字段
 * 可以在这里统一维护字段合并逻辑
 */
export function mergeMenuNode(menuInfo: any, routeInfo: any) {
  return {
    ...menuInfo,
    ...routeInfo,
    icon: routeInfo.meta.icon,
    meta: {
      ...routeInfo.meta,
      title: menuInfo.title || routeInfo.meta?.title,
      hidden: menuInfo.hidden ?? routeInfo.meta?.hidden,
      pinned: menuInfo.pinned ?? routeInfo.meta?.pinned,
      extraProps: menuInfo?.extraProps || {},
      menuKey: menuInfo.key || routeInfo.name,
    },
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
      flatMenus.push({ ...mergeMenuNode(menu, routeMap[menu.key]) });
      if (menu.children) {
        dfs(menu.children);
      }
    });
  };
  dfs(menus);
  return flatMenus;
}

export function formatHomeMenu(menus: any) {
  const homeMenu = menus.find((menu: any) => menu.meta?.pinned === true);
  if (homeMenu) return homeMenu;
  return menus[0];
}

export function formatTabItem(route: any) {
  return {
    key: route.fullPath,
    title: route.meta?.title,
    path: route.path,
    query: route.query,
    params: route.params,
    meta: route.meta,
  };
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

/**
 * 获取应用信息
 * @param appKey 可选的应用key，如果不传则根据hash路由自动获取
 * @returns 应用配置信息
 */
export function getAppInfoFromConfig(appKey?: string) {
  // 获取全局配置
  const appConfig = (window as any).APP_CONFIG?.appInfo || {};
  const appKeys = Object.keys(appConfig);

  // 没有配置，返回null
  if (appKeys.length === 0) {
    return null;
  }

  // 场景1: 如果配置中只有一个app，直接返回
  if (appKeys.length === 1) {
    return appConfig[appKeys[0]!];
  }

  // 场景2: 有多个app时
  let targetAppKey = appKey;

  // 如果没有传入appKey，则从hash路由中获取
  if (!targetAppKey) {
    // hash模式：从 #/appId/xxx 中提取 appId
    const hash = window.location.hash;
    // 移除开头的 # 和 /，然后获取第一层路径
    const hashPath = hash.replace(/^#\/?/, '');
    const firstSegment = hashPath.split('/')[0];
    targetAppKey = firstSegment;
  }

  // 尝试匹配配置中的app
  if (targetAppKey && appConfig[targetAppKey]) {
    return appConfig[targetAppKey];
  }

  // 匹配不到，返回配置中的第一项
  return appConfig[appKeys[0]!];
}
