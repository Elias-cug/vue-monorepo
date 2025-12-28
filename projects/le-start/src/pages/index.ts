/**
 * @description 提供可被动态注册的路由页面并与固定路由合并
 */

import type { Route } from '@lee/base/src/types/route';
import { setupRoutesBase } from '@lee/base/src/router/setupRoutes';

const appOnePrefix = '/le-start';

const app1Map: Record<string, Route> = {
  main: {
    path: `${appOnePrefix}/main`,
    name: 'Main',
    component: () => import('@/pages/Main/index.vue'),
    meta: {
      layout: 'basic',
      title: '首页',
      keepAlive: true,
      icon: 'menu-home',
    },
  },
  'theme-intro': {
    path: `${appOnePrefix}/theme-intro`,
    name: 'ThemeIntro',
    component: () => import('@/pages/ThemeIntro/index.vue'),
    meta: {
      layout: 'basic',
      title: '主题系统介绍',
      icon: 'menu-theme',
      keepAlive: true,
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
      icon: 'menu-code',
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
  'container-card': {
    path: `${appOnePrefix}/container-card`,
    name: 'ContainerCard',
    component: () => import('@/pages/ComponnetShow/ContainerCard/index.vue'),
    meta: {
      layout: 'basic',
      title: '容器卡片',
      keepAlive: true,
    },
  },
  'table-demo': {
    path: `${appOnePrefix}/table-demo`,
    name: 'TableDemo',
    component: () => import('@/pages/ComponnetShow/TableDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '表格组件',
      keepAlive: true,
    },
  },
  'svg-icon-demo': {
    path: `${appOnePrefix}/svg-icon-demo`,
    name: 'SvgIconDemo',
    component: () => import('@/pages/SvgIconDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: 'SVG 图标',
      keepAlive: true,
    },
  },
  'operate-group-demo': {
    path: `${appOnePrefix}/operate-group-demo`,
    name: 'OperateGroupDemo',
    component: () => import('@/pages/ComponnetShow/OperateGroupDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '操作按钮组',
      keepAlive: true,
    },
  },
  'button-demo': {
    path: `${appOnePrefix}/button-demo`,
    name: 'ButtonDemo',
    component: () => import('@/pages/ComponnetShow/ButtonDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '按钮组件',
      keepAlive: true,
    },
  },
  'filter-demo': {
    path: `${appOnePrefix}/filter-demo`,
    name: 'FilterDemo',
    component: () => import('@/pages/ComponnetShow/FilterDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '过滤组件',
      keepAlive: true,
    },
  },
  'filter-table-demo': {
    path: `${appOnePrefix}/filter-table-demo`,
    name: 'FilterTableDemo',
    component: () => import('@/pages/ComponnetShow/FilterTableDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '过滤表格',
      keepAlive: true,
    },
  },
  'dialog-demo': {
    path: `${appOnePrefix}/dialog-demo`,
    name: 'DialogDemo',
    component: () => import('@/pages/ComponnetShow/DialogDemo/index.vue'),
    meta: {
      layout: 'basic',
      title: '弹窗组件',
      keepAlive: true,
    },
  },
};

const apps = { ...app1Map };

export function setupRoutes() {
  setupRoutesBase(apps);
}
