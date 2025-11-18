const app1 = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: () => import('@/pages/Dashboard/index.vue'),
  },
];

export const apps = [...app1];
