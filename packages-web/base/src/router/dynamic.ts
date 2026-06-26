import type { Router, RouteRecordRaw } from 'vue-router';
import { routeMap } from './setupRoutes';
import BasicLayout from '@base/layout/BasicLayout/index.vue';
import HeaderLayout from '@base/layout/HeaderLayout/index.vue';
import BlankLayout from '@base/layout/BlankLayout/index.vue';

// layout 类型映射到组件
const layoutComponentMap: Record<string, any> = {
  basic: BasicLayout,
  header: HeaderLayout,
  blank: BlankLayout,
};

/**
 * 根据 layout 类型获取对应的 Layout 组件
 */
function getLayoutComponent(layout?: string) {
  return layoutComponentMap[layout || 'basic'] || BasicLayout;
}

/**
 * 创建带 layout 的父子路由结构
 * @param routeConfig 路由配置
 * @returns 父路由配置（包含子路由）
 */
function createLayoutRoute(routeConfig: {
  path: string;
  name: string;
  component: any;
  meta?: any;
  redirect?: string;
}): RouteRecordRaw {
  const layout = routeConfig.meta?.layout || 'basic';
  const layoutComponent = getLayoutComponent(layout);

  // 构建子路由（实际的页面路由）
  const childRoute: RouteRecordRaw = {
    path: routeConfig.path,
    name: routeConfig.name,
    component: routeConfig.component,
    meta: routeConfig.meta,
  };

  // 如果有 redirect，添加到子路由
  if (routeConfig.redirect) {
    childRoute.redirect = routeConfig.redirect;
  }

  // 构建父路由（包含 layout 的容器路由）
  const parentRoute: RouteRecordRaw = {
    path: `${routeConfig.path}-parent`,
    name: `${routeConfig.name}-parent`,
    component: layoutComponent,
    redirect: routeConfig.path,
    children: [childRoute],
  };

  return parentRoute;
}

/**
 * 注册单个路由到 router
 * @param router Vue Router 实例
 * @param routeConfig 路由配置
 */
function registerRoute(router: Router, routeConfig: any) {
  const parentRoute = createLayoutRoute(routeConfig);
  router.addRoute(parentRoute);
}

// 动态注册路由
export function dynamicRoutes(router: Router, menus: any[]) {
  // 注册菜单路由
  menus.forEach(menu => {
    if (routeMap[menu.key]) {
      const routeConfig = {
        path: menu.path,
        name: menu.name,
        component: routeMap[menu.key].component,
        meta: {
          ...routeMap[menu.key].meta,
          ...menu.meta,
        },
        redirect: routeMap[menu.key].redirect,
      };
      registerRoute(router, routeConfig);
    }
  });

  // 注册不需要权限的路由
  const fixedRoutes = Object.values(routeMap);
  fixedRoutes.forEach((route: any) => {
    if (!router.hasRoute(route.name) && route.meta?.auth === false) {
      registerRoute(router, route);
    }
  });
}
