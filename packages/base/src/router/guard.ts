import type { Router } from 'vue-router';
import { useAppStore } from '@base/store';
import { ls, ss } from '@base/storage';

export function setGuard(router: Router) {
  router.beforeEach((to, _from, next) => {
    const appStore = useAppStore();

    // 从路由 params 或 app store 中获取 appId
    const appId = (to.params.appid as string) || appStore.appInfo?.appId;

    // 设置 storage 的 appId
    if (appId) {
      ls.setAppId(appId);
      ss.setAppId(appId);
    }

    next();
  });

  router.afterEach(() => {});
}
