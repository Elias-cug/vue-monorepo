/**
 * 路由辅助 composable
 * 提供常用的路由操作方法
 */

import { useRouter as useVueRouter, useRoute, type RouteLocationRaw } from 'vue-router';
import { useAppStore } from '../store/app';
import { ls } from '../storage';
import { TOKEN_KEY } from '../constants';
import { clearAppPersist } from './useAppPersist';

export function useRouterHelper() {
  const router = useVueRouter();
  const route = useRoute();
  const appStore = useAppStore();

  /**
   * 退出登录
   * 1. 清除 token
   * 2. 清除持久化状态（tabs、activeTab、collapsed）
   * 3. 清除缓存路由
   * 4. 跳转到登录页
   * @param redirect 是否保留当前路由作为重定向参数，默认 true
   */
  function logout(redirect = true) {
    // 清除 token
    ls.remove(TOKEN_KEY, true);

    // 清除持久化的 app 状态
    clearAppPersist();

    // 清除 store 中的状态
    appStore.setTabs([]);
    appStore.activeTab = null;
    appStore.clearCachedRoutes();

    // 跳转登录页
    router.push({
      path: '/login',
      query: redirect
        ? {
            redirect: route.fullPath,
          }
        : undefined,
    });
  }

  /**
   * 清除当前 tab 并跳转到指定路由
   * @param to 要跳转的路由（支持字符串路径、路由对象）
   * @param replace 是否使用 replace 模式，默认 false
   */
  function clearCurrentTabAndGo(to: RouteLocationRaw, replace = false) {
    // 获取当前激活的 tab
    const currentTab = appStore.activeTab;

    // 先跳转到目标路由
    const navigation = replace ? router.replace(to) : router.push(to);

    // 跳转成功后，删除当前 tab
    navigation.then(() => {
      if (currentTab) {
        appStore.removeTab(currentTab);
      }
    });
  }

  /**
   * 清除指定路由的 keepalive 缓存并跳转
   * @param to 要跳转的路由（支持字符串路径、路由对象）
   * @param componentName 要清除缓存的组件名称，默认使用路由的 name
   * @param replace 是否使用 replace 模式，默认 false
   */
  function clearCacheAndGo(to: RouteLocationRaw, componentName?: string, replace = false) {
    // 解析目标路由
    const targetRoute = router.resolve(to);

    // 如果没有指定组件名，从路由中获取
    if (!componentName) {
      componentName = targetRoute.name as string;
    }

    // 清除指定组件的缓存
    if (componentName) {
      appStore.removeCachedRoute(componentName);
    }

    // 跳转到目标路由
    const navigation = replace ? router.replace(to) : router.push(to);

    // 跳转完成后，重新添加到缓存列表（如果该路由配置了 keepAlive）
    navigation.then(() => {
      if (componentName && targetRoute.meta?.keepAlive) {
        appStore.addCachedRoute(componentName);
      }
    });
  }

  /**
   * 清除所有 keepalive 缓存并跳转
   * @param to 要跳转的路由（支持字符串路径、路由对象）
   * @param replace 是否使用 replace 模式，默认 false
   */
  function clearAllCacheAndGo(to: RouteLocationRaw, replace = false) {
    // 清除所有缓存
    appStore.clearCachedRoutes();

    // 解析目标路由
    const targetRoute = router.resolve(to);

    // 跳转到目标路由
    const navigation = replace ? router.replace(to) : router.push(to);

    // 跳转完成后，重新添加到缓存列表（如果该路由配置了 keepAlive）
    navigation.then(() => {
      const componentName = targetRoute.name as string;
      // 检查路由是否配置了 keepAlive
      if (componentName && targetRoute.meta?.keepAlive) {
        appStore.addCachedRoute(componentName);
      }
    });
  }

  /**
   * 刷新当前页面（通过清除缓存实现）
   */
  function refreshCurrentPage() {
    const currentRouteName = route.name as string;
    const currentPath = route.fullPath;
    const keepAlive = route.meta?.keepAlive;

    if (currentRouteName) {
      // 清除当前页面的缓存
      appStore.removeCachedRoute(currentRouteName);

      // 跳转到一个临时路由，再跳回来，触发页面重新加载
      const navigation = router.replace({ path: '/redirect' + currentPath });

      // 跳转完成后，如果原本是 keepAlive 的，重新添加到缓存
      if (keepAlive) {
        navigation.then(() => {
          appStore.addCachedRoute(currentRouteName);
        });
      }
    }
  }

  /**
   * 关闭当前 tab 并跳转到前一个或后一个 tab
   */
  function closeCurrentTab() {
    const currentTab = appStore.activeTab;
    if (currentTab) {
      appStore.removeTab(currentTab);
    }
  }

  /**
   * 关闭其他 tabs（保留当前）
   */
  function closeOtherTabs() {
    const currentTab = appStore.activeTab;
    if (currentTab) {
      appStore.removeOtherTabs(currentTab);
    }
  }

  /**
   * 关闭所有 tabs
   * @param to 关闭后跳转的路由（支持字符串路径、路由对象），默认不跳转
   */
  function closeAllTabs(to?: RouteLocationRaw) {
    appStore.removeAllTabs();
    if (to) {
      router.push(to);
    }
  }

  return {
    // 原始 router 和 route
    router,
    route,

    // 自定义方法
    logout,
    clearCurrentTabAndGo,
    clearCacheAndGo,
    clearAllCacheAndGo,
    refreshCurrentPage,
    closeCurrentTab,
    closeOtherTabs,
    closeAllTabs,
  };
}
