import { createRouter, createWebHashHistory } from 'vue-router';
import { setGuard } from './guard';
import { constantRoutes } from './constant';
import { dynamicRoutes } from './dynamic';

const router = createRouter({
  history: createWebHashHistory(),
  routes: [...constantRoutes],
});

setGuard(router);

export function dynamicRegisterRouter(menus: any[]) {
  dynamicRoutes(router, menus);
}

export default router;
