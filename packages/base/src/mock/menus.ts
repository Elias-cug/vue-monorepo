/**
 * 菜单 Mock 数据
 * 用于侧边栏菜单展示
 */

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

export const menusMock = [
  {
    key: 'main',
    title: '首页',
    icon: renderIcon(FishIcon),
    meta: {
      pinned: true,
    },
  },
  {
    key: 'auth',
    title: '权限管理',
    icon: renderIcon(FishIcon),
    children: [
      {
        key: 'rules',
        label: '角色管理',
      },
      {
        key: 'menus',
        label: '菜单管理',
      },
      {
        key: 'users',
        label: '用户管理',
      },
    ],
  },
  {
    key: 'test',
    title: '功能测试',
    icon: renderIcon(FlaskIcon),
    children: [
      {
        key: 'tabTest',
        label: 'Tab 测试',
        icon: renderIcon(TabIcon),
      },
      {
        key: 'routerTest',
        label: 'RouterHelper 测试',
        icon: renderIcon(RouterIcon),
      },
      {
        key: 'cacheTest',
        label: '缓存测试 (keepAlive)',
        icon: renderIcon(CacheIcon),
      },
      {
        key: 'noCacheTest',
        label: '无缓存测试',
        icon: renderIcon(CacheIcon),
      },
      {
        key: 'detailTest',
        label: '详情测试 (multiTab)',
        icon: renderIcon(DetailIcon),
      },
      {
        key: 'fixedTest',
        label: '固定 Tab 测试',
        icon: renderIcon(FixedIcon),
      },
    ],
  },
];
