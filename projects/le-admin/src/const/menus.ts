export const menuList = [
  {
    key: 'profile',
    title: '个人中心',
    pinned: true,
  },
  {
    key: 'user-management',
    title: '用户管理',
    meta: {
      href: 'https://www.baidu.com',
    },
  },
  {
    key: 'role-management',
    title: '角色管理',
  },
];

export default { data: [...menuList] };
