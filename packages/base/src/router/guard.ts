import type { Router } from 'vue-router';
import { useAuthStore } from '@base/store';

export function setGuard(router: Router) {
  router.beforeEach((to, from, next) => {
    const authStore = useAuthStore();
    console.log(authStore);
  });

  router.afterEach((to, from) => {});
}
