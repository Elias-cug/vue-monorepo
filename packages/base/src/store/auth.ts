import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    menus: [
      {
        label: '且听风吟',
        key: 'hear-the-wind-sing',
      },
      {
        label: '1973年的弹珠玩具',
        key: 'pinball-1973',
        children: [
          {
            label: '鼠',
            key: 'rat',
          },
        ],
      },
    ],
  }),
  actions: {
    setMenus(payload: any) {
      this.menus = payload;
    },
  },
});
