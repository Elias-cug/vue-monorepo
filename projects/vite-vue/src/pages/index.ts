/**
 * @description 提供可被动态注册的路由页面并与固定路由合并
 */

import { setupRoutesBase } from '@lee/base/src/router/setupRoutes';
const appOnePrefix = '/app1';

const app1Map = {
  main: {
    path: `${appOnePrefix}/main`,
    name: 'Main',
    component: () => import('@/pages/Main/index.vue'),
    meta: {
      layout: 'basic',
      menuKey: 'main',
      title: '首页',
      keepAlive: true,
    },
  },
  auth: {
    path: `${appOnePrefix}/auth`,
    name: 'Auth',
    redirect: `${appOnePrefix}/auth/users`,
    component: () => import('@/pages/Auth/index.vue'),
    meta: {
      menuKey: 'auth',
      title: '权限管理',
    },
  },
  users: {
    path: `${appOnePrefix}/auth/users`,
    name: 'Users',
    component: () => import('@/pages/Auth/Users/index.vue'),
    meta: {
      menuKey: 'users',
      title: '用户管理',
    },
  },
  menus: {
    path: `${appOnePrefix}/auth/menus`,
    name: 'Menus',
    component: () => import('@/pages/Auth/Menus/index.vue'),
    meta: {
      layout: 'header',
      menuKey: 'menus',
      title: '菜单管理',
    },
  },
  rules: {
    path: `${appOnePrefix}/auth/rules`,
    name: 'Rules',
    component: () => import('@/pages/Auth/Rules/index.vue'),
    meta: {
      layout: 'blank',
      menuKey: 'rules',
      title: '角色管理',
    },
  },
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
