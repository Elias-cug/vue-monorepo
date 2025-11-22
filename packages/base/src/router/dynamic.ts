import type { Router } from 'vue-router';
import { routeMap } from './setupRoutes';

// 动态注册路由
export function dynamicRoutes(router: Router, menus: any[]) {
  console.log('--routeMap', routeMap);
  console.log('--menus', menus);
  menus.forEach(menu => {
    const route = {
      path: menu.path,
      name: menu.name,
      component: routeMap[menu.key].component,
      meta: menu.meta,
    };
    router.addRoute(route);
  });
}
