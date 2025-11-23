import { NIcon } from 'naive-ui';
import { h } from 'vue';
import { FishOutline as FishIcon } from '@vicons/ionicons5';

function renderIcon(icon: any) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

export const menusMock = [
  {
    key: 'main',
    title: '首页',
    icon: renderIcon(FishIcon),
  },
  {
    key: 'auth',
    title: '权限管理',
    icon: renderIcon(FishIcon),
    children: [
      // {
      //   key: 'rules',
      //   label: '角色管理',
      // },
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
];
