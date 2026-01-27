/**
 * @description 提供可被动态注册的路由页面并与固定路由合并
 */

import type { Route } from '@lee/base/src/types/route';
import { setupRoutesBase } from '@lee/base/src/router/setupRoutes';

const appOnePrefix = '/le-admin';

const app1Map: Record<string, Route> = {
  profile: {
    path: `${appOnePrefix}/profile`,
    name: 'Profile',
    component: () => import('@/pages/Profile/index.vue'),
    meta: {
      layout: 'basic',
      title: '用户中心',
      keepAlive: true,
      icon: 'menu-profile',
    },
  },
  'user-management': {
    path: `${appOnePrefix}/user-management`,
    name: 'UserManagement',
    component: () => import('@/pages/UserManagement/index.vue'),
    meta: {
      layout: 'basic',
      title: '用户管理',
      keepAlive: true,
      icon: 'menu-user-management',
    },
  },
  'role-management': {
    path: `${appOnePrefix}/role-management`,
    name: 'RoleManagement',
    component: () => import('@/pages/RoleManagement/index.vue'),
    meta: {
      layout: 'basic',
      title: '角色管理',
      keepAlive: true,
      icon: 'menu-role-management',
    },
  },
  'menu-management': {
    path: `${appOnePrefix}/menu-management`,
    name: 'MenuManagement',
    component: () => import('@/pages/MenuManagement/index.vue'),
    meta: {
      layout: 'basic',
      title: '菜单管理',
      keepAlive: true,
      icon: 'menu-menu-management',
    },
  },
  'permission-management': {
    path: `${appOnePrefix}/permission-management`,
    name: 'PermissionManagement',
    component: () => import('@/pages/PermissionManagement/index.vue'),
    meta: {
      layout: 'basic',
      title: '权限管理',
      keepAlive: true,
      icon: 'menu-permission-management',
    },
  },
  'app-management': {
    path: `${appOnePrefix}/app-management`,
    name: 'AppManagement',
    component: () => import('@/pages/AppManagement/index.vue'),
    meta: {
      layout: 'basic',
      title: '应用管理',
      keepAlive: true,
      icon: 'menu-app-management',
    },
  },
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
