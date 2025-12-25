export const menusMock = [
  {
    key: 'main',
    title: '首页',
    pinned: true,
    extraProps: {
      params1: '123',
    },
  },
  {
    key: 'theme-intro',
    title: '主题系统介绍',
  },
  {
    key: 'component-show',
    title: '组件展示',
    children: [
      {
        key: 'code-viewer',
        title: '代码查看器',
      },
      {
        key: 'container-card',
        title: '容器卡片',
      },
      {
        key: 'svg-icon-demo',
        title: 'SVG 图标',
      },
      {
        key: 'table-demo',
        title: '表格组件',
      },
      {
        key: 'operate-group-demo',
        title: '操作按钮组',
      },
      {
        key: 'button-demo',
        title: '按钮组件',
      },
    ],
    extraProps: {},
  },
];

export const userMock = {
  id: 1,
  username: 'admin',
  name: '管理员',
  role: 'super',
  phone: '13800138000',
  email: 'admin@example.com',
  avatar: 'https://via.placeholder.com/150',
};

export const appInfoMock = {
  appId: '1',
  name: 'VUE-MOBOREPO总览',
  version: '1.0.0',
  description: 'A Vue.js admin template',
};
