import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { useAppStore, useAuthStore } from '@base/store';
import { ls, ss } from '@base/storage';

const TOKEN_KEY = 'token';

const BLANK_PATH_LIST = ['/login', '/404', '/403'];

/**
 * 检查路由权限和存在性
 * @param to 目标路由
 * @param next 导航守卫的 next 函数
 * @param router 路由实例
 * @param targetRoute 可选的目标路由对象（用于替换当前路由）
 */
// TODO: 需要改一下
function handleRoute(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  router: Router,
  targetRoute?: RouteLocationNormalized
) {
  const authStore = useAuthStore();

  // 检查路由是否存在（通过路由名称或路径匹配）
  const routeExists = router.getRoutes().some(route => {
    // 如果是动态路由，需要匹配模式
    if (route.path.includes(':')) {
      const pattern = new RegExp('^' + route.path.replace(/:[^/]+/g, '[^/]+') + '$');
      return pattern.test(to.path);
    }
    return route.path === to.path || route.name === to.name;
  });

  // 如果路由不存在，跳转到 404
  if (!routeExists) {
    next({ path: '/404', replace: true });
    return;
  }

  // 检查是否有权限（菜单中是否包含该路径）
  const hasPermission = authStore.flatMenus.some(menu => {
    if (!menu.path) return false;
    // 如果是动态路由，需要匹配模式
    if (menu.path.includes(':')) {
      const pattern = new RegExp('^' + menu.path.replace(/:[^/]+/g, '[^/]+') + '$');
      return pattern.test(to.path);
    }
    return menu.path === to.path;
  });

  // 如果路由存在但没有权限，跳转到 403
  if (!hasPermission) {
    next({ path: '/403', replace: true });
    return;
  }

  // 有权限，继续导航
  // 如果提供了 targetRoute，使用它替换当前路由
  if (targetRoute) {
    next({ ...targetRoute, replace: true });
  } else {
    next();
  }
}

export function setGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const appStore = useAppStore();
    const authStore = useAuthStore();

    // 从路由 params 或 app store 中获取 appId
    const appId = (to.params.appid as string) || appStore.appInfo?.appId;

    // 设置 storage 的 appId
    if (appId) {
      ls.setAppId(appId);
      ss.setAppId(appId);
    }

    if (BLANK_PATH_LIST.includes(to.path)) {
      next();
      return;
    }

    const tokenFromQuery = (to.query.token as string) || undefined;
    const tokenFromStorage = ls.get<string>(TOKEN_KEY, { ignorePrefix: true });
    // 1. 携带了 token
    if (tokenFromQuery || tokenFromStorage) {
      const token = tokenFromQuery || tokenFromStorage!;
      // 存储 token 到 ls（忽略 appId 前缀，全局使用）
      ls.set(TOKEN_KEY, token, { ignorePrefix: true });

      if (tokenFromQuery) {
        // 从 URL query 中获取 token，需要重新获取用户信息
        try {
          // 使用携带的 token 获取用户信息存储到 auth Store
          await authStore.getAllAuthInfo(token);

          // 移除 URL 中的 token
          const newQuery = { ...to.query };
          delete newQuery.token;

          // 创建新的路由对象（移除 token）
          const targetRoute: RouteLocationNormalized = {
            ...to,
            query: newQuery,
          };

          // 检查权限后导航（使用 targetRoute 替换当前路由）
          handleRoute(to, next, router, targetRoute);
          return;
        } catch (error) {
          // 获取用户信息或菜单失败，清除 token 和加载状态，并跳转到登录页
          ls.remove(TOKEN_KEY, true);
          authStore.setLoaded(false);
          next({ path: '/login', replace: true });
          return;
        }
      } else if (tokenFromStorage) {
        // 从 storage 中获取 token
        if (authStore.isLoaded) {
          // 已经加载过，直接检查权限
          handleRoute(to, next, router);
          return;
        } else {
          // 未加载，需要获取用户信息
          try {
            await authStore.getAllAuthInfo(token);

            // TODO: 不知道为啥刷新后必须设置 targetRoute
            const targetRoute: RouteLocationNormalized = {
              ...to,
            };
            handleRoute(to, next, router, targetRoute);
            return;
          } catch (error) {
            // 获取用户信息或菜单失败，清除 token 和加载状态，并跳转到登录页
            ls.remove(TOKEN_KEY, true);
            authStore.setLoaded(false);
            next({ path: '/login', replace: true });
            return;
          }
        }
      }
    } else {
      authStore.setLoaded(false);
      next({ path: '/login', replace: true });
      return;
    }
  });

  router.afterEach(() => {});
}
