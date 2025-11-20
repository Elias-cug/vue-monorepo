import { createRouter, createWebHistory } from 'vue-router';
import { setGuard } from './guard';
import { constantRoutes } from '../views';

const router = createRouter({
  history: createWebHistory(),
  routes: [...constantRoutes],
});

setGuard(router);

export default router;
