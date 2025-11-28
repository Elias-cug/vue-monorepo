/**
 * 菜单 Mock 数据
 * 用于侧边栏菜单展示
 */

import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { FishOutline as FishIcon, FlaskOutline as FlaskIcon } from '@vicons/ionicons5';

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const menusMock = [
  {
    key: 'main',
    title: '首页',
    icon: renderIcon(FishIcon),
    pinned: true,
    extraProps: {
      params1: '123',
    },
  },
  {
    key: 'test',
    title: '功能测试',
    icon: renderIcon(FlaskIcon),
    children: [
      {
        key: 'tabTest',
        label: 'Tab 测试',
      },
      {
        key: 'routerTest',
        label: 'RouterHelper 测试',
      },
      {
        key: 'cacheTest',
        label: '缓存测试 (keepAlive)',
      },
      {
        key: 'noCacheTest',
        label: '无缓存测试',
      },
      {
        key: 'detailTest',
        label: '详情测试 (multiTab)',
      },
      {
        key: 'fixedTest',
        label: '固定 Tab 测试',
      },
    ],
  },
];
