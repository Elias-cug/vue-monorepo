import type { NavigationGuardNext, RouteLocationNormalized, Router } from 'vue-router';
import { useAppStore, useAuthStore } from '@base/store';
import { routeMap } from '@base/router/setupRoutes';
import { ls } from '@base/storage';
import { formatTabItem } from '@base/helper/authHelper';
import { TOKEN_KEY } from '@base/constants';

const BLANK_PATH_LIST = ['/login', '/404', '/403'];

/**
 * 检查是否为首页访问
 */
function isHomePage(path: string): boolean {
  return path === '/' || path === '';
}

/**
 * 处理首页重定向
 * 如果访问的是首页，重定向到 homeMenu 或第一个菜单项
 * @returns true 表示已处理重定向，false 表示不需要重定向
 */
function handleHomeRedirect(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  authStore: ReturnType<typeof useAuthStore>
): boolean {
  if (!isHomePage(to.path)) {
    return false;
  }

  if (authStore.homeMenu) {
    next({ path: authStore.homeMenu.path, replace: true });
    return true;
  }

  if (authStore.flatMenus.length > 0 && authStore.flatMenus[0]?.path) {
    next({ path: authStore.flatMenus[0].path, replace: true });
    return true;
  }

  return false;
}

/**
 * 处理认证失败，清除 token 并跳转到登录页
 */
function handleAuthError(next: NavigationGuardNext, authStore: ReturnType<typeof useAuthStore>) {
  ls.remove(TOKEN_KEY, true);
  authStore.setLoaded(false);
  next({ path: '/login', replace: true });
}

/**
 * 路径匹配工具函数
 * 支持将类似 /user/:id 这样的动态路径转换为正则，与实际访问路径做匹配
 *
 * @param pattern 路由配置中的 path（可能包含动态参数）
 * @param actualPath 实际访问的路径（to.path）
 */
function pathMatch(pattern: string | undefined, actualPath: string): boolean {
  if (!pattern) return false;
  if (pattern.includes(':')) {
    const regexp = new RegExp('^' + pattern.replace(/:[^/]+/g, '[^/]+') + '$');
    return regexp.test(actualPath);
  }
  return pattern === actualPath;
}

/**
 * 检查路由是否存在以及当前用户是否有访问权限
 *
 * 规则：
 * 1. 在 setupRoutes 合并后的 routeMap 中找不到匹配路由，直接跳转 404
 * 2. 找得到匹配路由，但不在 authStore.flatMenus 中，且 matchedRoute.meta.auth 为 false/未设置，跳转 403
 * 3. 其他情况放行（可选使用 targetRoute 替换当前路由，常用于去掉 token 等场景）
 *
 * @param to 目标路由对象
 * @param next vue-router 的 next 函数
 * @param _router 路由实例（当前实现未使用，仅保留签名）
 * @param targetRoute 可选的替换路由对象（如移除 query 中的 token 后的新路由）
 */
function handleRoute(
  to: RouteLocationNormalized,
  next: NavigationGuardNext,
  _router: Router,
  targetRoute?: RouteLocationNormalized
) {
  const authStore = useAuthStore();

  const allRoutes = Object.values(routeMap) as any[];

  // 先在 setupRoutes 合并后的 routeMap 中查找匹配的路由定义
  const matchedRoute = allRoutes.find(route => pathMatch(route.path, to.path));

  // 1. setupRoutes routeMap 中没有的直接 404
  if (!matchedRoute) {
    next({ path: '/404', replace: true });
    return;
  }

  // 当前用户是否在菜单（flatMenus）中拥有该路由
  const hasPermission = authStore.flatMenus.some(menu => pathMatch(menu.path, to.path));

  // 2. setupRoutes routeMap 中有的，但是 authStore flatMenus 中没有
  //    且 meta.auth 为 false/未设置（默认为需要鉴权）时跳转 403
  if (!hasPermission && matchedRoute.meta?.auth !== false) {
    next({ path: '/403', replace: true });
    return;
  }

  // 其他情况放行
  if (targetRoute) {
    next({ ...targetRoute, replace: true });
  } else {
    next();
  }
}

export function setGuard(router: Router) {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore();
    const appStore = useAppStore();
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
          appStore.getAppInfo();
          await authStore.getAllAuthInfo(token);

          // 如果访问的是首页，重定向到 homeMenu
          if (handleHomeRedirect(to, next, authStore)) {
            return;
          }

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
          // 获取用户信息或菜单失败
          handleAuthError(next, authStore);
          return;
        }
      } else if (tokenFromStorage) {
        // 从 storage 中获取 token
        if (authStore.isLoaded) {
          // 如果访问的是首页，重定向到 homeMenu
          if (handleHomeRedirect(to, next, authStore)) {
            return;
          }

          // 已经加载过，直接检查权限
          handleRoute(to, next, router);
          return;
        } else {
          // 未加载，需要获取用户信息
          try {
            appStore.getAppInfo();
            await authStore.getAllAuthInfo(token);

            // 如果访问的是首页，重定向到 homeMenu
            if (handleHomeRedirect(to, next, authStore)) {
              return;
            }

            const targetRoute: RouteLocationNormalized = {
              ...to,
            };
            handleRoute(to, next, router, targetRoute);
            return;
          } catch (error) {
            // 获取用户信息或菜单失败
            handleAuthError(next, authStore);
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

  router.afterEach(to => {
    const appStore = useAppStore();

    // 不需要添加到 tabs 的路径
    if (BLANK_PATH_LIST.includes(to.path)) {
      return;
    }

    // 添加 tab
    console.log('---to', to);
    appStore.addTab(formatTabItem(to));
  });
}
