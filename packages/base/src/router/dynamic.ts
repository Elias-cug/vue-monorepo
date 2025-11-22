import type { Router } from 'vue-router';
import { routeMap } from './setupRoutes';

// 动态注册路由
export function dynamicRoutes(router: Router, menus: any[]) {
  menus.forEach(menu => {
    if (routeMap[menu.key]) {
      const route = {
        path: menu.path,
        name: menu.name,
        component: routeMap[menu.key].component,
        meta: menu.meta,
      };
      router.addRoute(route);
    }
  });

  // 注册不需要权限的路由
  const fixedRoutes = Object.values(routeMap);
  fixedRoutes.forEach((route: any) => {
    if (!router.hasRoute(route.name) && route.meta.auth === false) {
      router.addRoute(route);
    }
  });
}
