/**
 * @description 提供可被动态注册的路由页面并与固定路由合并
 */

import type { Route } from '@lee/base/src/types/route';
import { setupRoutesBase } from '@lee/base/src/router/setupRoutes';
import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { FishOutline as FishIcon, CodeSlashOutline as CodeIcon } from '@vicons/ionicons5';

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
const appOnePrefix = '/vite-vue';

const app1Map: Record<string, Route> = {
  main: {
    path: `${appOnePrefix}/main`,
    name: 'Main',
    component: () => import('@/pages/Main/index.vue'),
    meta: {
      layout: 'basic',
      title: '首页',
      keepAlive: true,
      icon: renderIcon(FishIcon),
    },
  },
  'component-show': {
    path: `${appOnePrefix}/component-show`,
    name: 'ComponentShow',
    redirect: `${appOnePrefix}/code-viewer`,
    component: () => import('@/pages/ComponnetShow/CodeViewer/index.vue'),
    meta: {
      layout: 'basic',
      title: '组件展示',
      keepAlive: true,
      icon: renderIcon(CodeIcon),
    },
  },
  'code-viewer': {
    path: `${appOnePrefix}/code-viewer`,
    name: 'CodeViewer',
    component: () => import('@/pages/ComponnetShow/CodeViewer/index.vue'),
    meta: {
      layout: 'basic',
      title: '代码查看器',
      keepAlive: true,
    },
  },
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
