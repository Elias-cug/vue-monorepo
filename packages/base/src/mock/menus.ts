import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { FishOutline as FishIcon } from '@vicons/ionicons5';

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const menusMock = [
  {
    title: '首页',
    key: 'main',
    icon: renderIcon(FishIcon),
  },
  {
    title: '组件',
    key: 'component',
    icon: renderIcon(FishIcon),
    children: [
      {
        label: '列表',
        key: 'table',
      },
    ],
  },
];
