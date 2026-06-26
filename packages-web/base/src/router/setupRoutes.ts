import Login from '@base/views/BuiltIn/Login/index.vue';
import NotFound from '@base/views/BuiltIn/NotFound/index.vue';
import NoPermission from '@base/views/BuiltIn/NoPermission/index.vue';

export const routeMap: any = {
  login: {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  notFound: {
    path: '/404',
    name: '404',
    component: NotFound,
  },
  noPermission: {
    path: '/403',
    name: '403',
    component: NoPermission,
  },
};

// 将项目的路由信息和固定路由信息合并
export function setupRoutesBase(routes: any) {
  Object.assign(routeMap, routes);
}
