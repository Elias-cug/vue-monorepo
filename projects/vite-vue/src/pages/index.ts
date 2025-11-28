/**
 * @description 提供可被动态注册的路由页面并与固定路由合并
 */

import { setupRoutesBase } from '@lee/base/src/router/setupRoutes';
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import {
  FishOutline as FishIcon,
  FlaskOutline as FlaskIcon,
  TabletPortraitOutline as TabIcon,
  GitNetworkOutline as RouterIcon,
  LayersOutline as CacheIcon,
  DocumentOutline as DetailIcon,
  LockClosedOutline as FixedIcon,
} from '@vicons/ionicons5';

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
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
      icon: renderIcon(FishIcon),
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
      icon: renderIcon(FishIcon),
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
      menuKey: 'menus',
      title: '菜单管理',
    },
  },
  rules: {
    path: `${appOnePrefix}/auth/rules`,
    name: 'Rules',
    component: () => import('@/pages/Auth/Rules/index.vue'),
    meta: {
      menuKey: 'rules',
      title: '角色管理',
    },
  },

  // ============ 功能测试模块 ============
  test: {
    path: `${appOnePrefix}/test`,
    name: 'Test',
    redirect: `${appOnePrefix}/test/tab`,
    component: () => import('@/pages/Test/index.vue'),
    meta: {
      menuKey: 'test',
      title: '功能测试',
      icon: renderIcon(FlaskIcon),
    },
  },
  tabTest: {
    path: `${appOnePrefix}/test/tab`,
    name: 'TabTest',
    component: () => import('@/pages/Test/TabTest/index.vue'),
    meta: {
      menuKey: 'tabTest',
      title: 'Tab 测试',
      keepAlive: true,
    },
  },
  routerTest: {
    path: `${appOnePrefix}/test/router`,
    name: 'RouterTest',
    component: () => import('@/pages/Test/RouterTest/index.vue'),
    meta: {
      menuKey: 'routerTest',
      title: 'RouterHelper 测试',
      keepAlive: true,
    },
  },
  cacheTest: {
    path: `${appOnePrefix}/test/cache`,
    name: 'CacheTest',
    component: () => import('@/pages/Test/CacheTest/index.vue'),
    meta: {
      menuKey: 'cacheTest',
      title: '缓存测试',
      keepAlive: true,
    },
  },
  noCacheTest: {
    path: `${appOnePrefix}/test/no-cache`,
    name: 'NoCacheTest',
    component: () => import('@/pages/Test/NoCacheTest/index.vue'),
    meta: {
      menuKey: 'noCacheTest',
      title: '无缓存测试',
      keepAlive: false,
    },
  },
  detailTest: {
    path: `${appOnePrefix}/test/detail/:id`,
    name: 'DetailTest',
    component: () => import('@/pages/Test/DetailTest/index.vue'),
    meta: {
      menuKey: 'detailTest',
      title: '详情测试',
      keepAlive: true,
      multiTab: true, // 多实例 Tab，同一路由不同参数可打开多个 Tab
    },
  },
  fixedTest: {
    path: `${appOnePrefix}/test/fixed`,
    name: 'FixedTest',
    component: () => import('@/pages/Test/FixedTest/index.vue'),
    meta: {
      menuKey: 'fixedTest',
      title: '固定 Tab 测试',
    },
  },
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
