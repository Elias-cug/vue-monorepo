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
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
