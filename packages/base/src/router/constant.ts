import Login from '@base/views/BuiltIn/Login/index.vue';
import NotFound from '@base/views/BuiltIn/NotFound/index.vue';
import NoPermission from '@base/views/BuiltIn/NoPermission/index.vue';

export const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/404',
    name: '404',
    component: NotFound,
  },
  {
    path: '/403',
    name: '403',
    component: NoPermission,
  },
];
