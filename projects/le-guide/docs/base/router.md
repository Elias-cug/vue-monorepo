# 路由系统

Vue Monorepo 提供了强大的路由管理系统，基于 Vue Router 扩展，支持动态路由、权限控制、路由守卫、路由 Hook 等高级功能。

## 核心特性

- 🔒 **权限路由** - 基于角色的动态路由生成
- 🎯 **路由守卫** - 完整的导航守卫体系
- 🪝 **路由 Hook** - 丰富的生命周期钩子
- 📊 **路由元信息** - 灵活的 meta 配置
- 🔄 **动态加载** - 按需加载路由组件
- 📝 **面包屑** - 自动生成导航路径
- 🏷️ **标签页** - 多标签页路由管理
- 💾 **持久化** - 路由状态持久化

## 基础配置

### 路由定义

```typescript
// router/routes.ts
import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/layout/index.vue';

// 静态路由（无需权限）
export const constantRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录',
      hidden: true, // 不在菜单显示
      noCache: true, // 不缓存
    },
  },
  {
    path: '/404',
    name: 'NotFound',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      title: '404',
      hidden: true,
    },
  },
  {
    path: '/',
    name: 'Root',
    redirect: '/dashboard',
  },
];

// 动态路由（需要权限）
export const asyncRoutes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/index',
    children: [
      {
        path: 'index',
        name: 'Dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        meta: {
          title: '仪表盘',
          icon: 'dashboard',
          affix: true, // 固定标签页
        },
      },
    ],
  },
  {
    path: '/user',
    component: Layout,
    redirect: '/user/list',
    meta: {
      title: '用户管理',
      icon: 'user',
      roles: ['admin'], // 权限角色
    },
    children: [
      {
        path: 'list',
        name: 'UserList',
        component: () => import('@/pages/user/list.vue'),
        meta: {
          title: '用户列表',
          roles: ['admin', 'editor'],
        },
      },
      {
        path: 'detail/:id',
        name: 'UserDetail',
        component: () => import('@/pages/user/detail.vue'),
        meta: {
          title: '用户详情',
          hidden: true, // 菜单中隐藏
          activeMenu: '/user/list', // 高亮的菜单项
        },
      },
    ],
  },
];
```

### 路由实例

```typescript
// router/index.ts
import { createRouter, createWebHashHistory } from 'vue-router';
import { constantRoutes } from './routes';

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRoutes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});

export default router;
```

## 动态路由

### 权限路由生成

```typescript
// router/permission.ts
import { asyncRoutes } from './routes';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';

// 检查权限
function hasPermission(roles: string[], route: RouteRecordRaw): boolean {
  if (route.meta && route.meta.roles) {
    return roles.some(role => route.meta!.roles!.includes(role));
  }
  return true; // 没有设置权限的路由默认可访问
}

// 递归过滤路由
export function filterAsyncRoutes(routes: RouteRecordRaw[], roles: string[]): RouteRecordRaw[] {
  const res: RouteRecordRaw[] = [];

  routes.forEach(route => {
    const tmp = { ...route };
    if (hasPermission(roles, tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children, roles);
      }
      res.push(tmp);
    }
  });

  return res;
}

// 生成动态路由
export async function generateRoutes() {
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  const { roles } = userStore.userInfo;

  // 根据角色过滤路由
  const accessedRoutes = filterAsyncRoutes(asyncRoutes, roles);

  // 保存到 store
  permissionStore.setRoutes(accessedRoutes);

  // 动态添加路由
  accessedRoutes.forEach(route => {
    router.addRoute(route);
  });

  // 添加 404 页面（必须最后添加）
  router.addRoute({
    path: '/:pathMatch(.*)*',
    redirect: '/404',
    meta: { hidden: true },
  });

  return accessedRoutes;
}
```

### 后端返回路由

```typescript
// 从后端获取路由配置
async function getServerRoutes() {
  const { data } = await api.get('/user/routes');
  return data;
}

// 动态组件映射
const modules = import.meta.glob('../pages/**/*.vue');

// 转换后端路由为前端路由
function transformServerRoute(serverRoute: any): RouteRecordRaw {
  const route: RouteRecordRaw = {
    path: serverRoute.path,
    name: serverRoute.name,
    meta: serverRoute.meta,
  };

  // 动态加载组件
  if (serverRoute.component) {
    if (serverRoute.component === 'Layout') {
      route.component = Layout;
    } else {
      const componentPath = `../pages/${serverRoute.component}.vue`;
      route.component = modules[componentPath];
    }
  }

  // 递归处理子路由
  if (serverRoute.children && serverRoute.children.length) {
    route.children = serverRoute.children.map(transformServerRoute);
  }

  return route;
}

// 使用后端路由
export async function setupServerRoutes() {
  const serverRoutes = await getServerRoutes();
  const routes = serverRoutes.map(transformServerRoute);

  routes.forEach(route => {
    router.addRoute(route);
  });
}
```

## 路由守卫

### 全局前置守卫

```typescript
// router/guards/permission.guard.ts
import router from '@/router';
import { useUserStore } from '@/stores/user';
import { usePermissionStore } from '@/stores/permission';
import NProgress from 'nprogress';

const whiteList = ['/login', '/404', '/403']; // 白名单

router.beforeEach(async (to, from, next) => {
  // 开始进度条
  NProgress.start();

  const userStore = useUserStore();
  const permissionStore = usePermissionStore();

  // 设置页面标题
  document.title = `${to.meta.title || '页面'} - Vue Monorepo`;

  // 判断是否登录
  if (userStore.token) {
    if (to.path === '/login') {
      // 已登录，跳转首页
      next({ path: '/' });
      NProgress.done();
    } else {
      // 判断是否已获取用户信息
      if (userStore.userInfo) {
        next();
      } else {
        try {
          // 获取用户信息
          await userStore.getUserInfo();

          // 生成动态路由
          const accessedRoutes = await generateRoutes();

          // 确保路由已添加
          next({ ...to, replace: true });
        } catch (error) {
          // 获取用户信息失败，清空 token 并跳转登录
          await userStore.logout();
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 未登录
    if (whiteList.includes(to.path)) {
      // 在白名单中，直接访问
      next();
    } else {
      // 不在白名单，跳转登录
      next(`/login?redirect=${to.path}`);
      NProgress.done();
    }
  }
});

// 全局后置守卫
router.afterEach(() => {
  // 结束进度条
  NProgress.done();
});
```

### 路由独享守卫

```typescript
{
  path: '/admin',
  component: () => import('@/pages/admin/index.vue'),
  beforeEnter: (to, from, next) => {
    const userStore = useUserStore();
    if (userStore.hasRole('admin')) {
      next();
    } else {
      next('/403');
    }
  },
}
```

### 组件内守卫

```vue
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router';

// 路由离开前
onBeforeRouteLeave((to, from, next) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('有未保存的更改，确定要离开吗？');
    if (answer) {
      next();
    } else {
      next(false);
    }
  } else {
    next();
  }
});

// 路由更新前（复用组件）
onBeforeRouteUpdate((to, from, next) => {
  // 处理参数变化
  loadData(to.params.id);
  next();
});
</script>
```

## 路由 Hook

### useRouteHook

```typescript
// hooks/useRouteHook.ts
import { useRoute, useRouter, RouteLocationNormalizedLoaded } from 'vue-router';
import { ref, watch, onBeforeMount, onMounted, onBeforeUnmount } from 'vue';

export function useRouteHook() {
  const route = useRoute();
  const router = useRouter();

  // 路由进入
  const onRouteEnter = (callback: (route: RouteLocationNormalizedLoaded) => void) => {
    onMounted(() => {
      callback(route);
    });
  };

  // 路由更新
  const onRouteUpdate = (
    callback: (to: RouteLocationNormalizedLoaded, from: RouteLocationNormalizedLoaded) => void
  ) => {
    watch(
      () => route,
      (to, from) => {
        callback(to, from);
      },
      { deep: true }
    );
  };

  // 路由离开
  const onRouteLeave = (callback: () => boolean | void) => {
    onBeforeUnmount(() => {
      callback();
    });
  };

  // 路由数据预加载
  const preloadRouteData = async (routeName: string) => {
    const route = router.resolve({ name: routeName });
    if (route.matched.length > 0) {
      const component = route.matched[0].components?.default;
      if (typeof component === 'function') {
        await component();
      }
    }
  };

  // 路由历史管理
  const routeHistory = ref<RouteLocationNormalizedLoaded[]>([]);
  const maxHistoryLength = 10;

  watch(
    () => route,
    newRoute => {
      routeHistory.value.push(newRoute);
      if (routeHistory.value.length > maxHistoryLength) {
        routeHistory.value.shift();
      }
    },
    { immediate: true, deep: true }
  );

  // 路由跳转增强
  const navigateTo = (options: any) => {
    // 添加过渡动画
    document.body.classList.add('route-transitioning');

    router.push(options).finally(() => {
      setTimeout(() => {
        document.body.classList.remove('route-transitioning');
      }, 300);
    });
  };

  return {
    route,
    router,
    onRouteEnter,
    onRouteUpdate,
    onRouteLeave,
    preloadRouteData,
    routeHistory,
    navigateTo,
  };
}
```

### useRouteCache

```typescript
// hooks/useRouteCache.ts
import { ref, computed } from 'vue';
import { useRoute } from 'vue-router';

export function useRouteCache() {
  const route = useRoute();
  const cachedViews = ref<Set<string>>(new Set());

  // 添加缓存
  const addCachedView = (name: string) => {
    if (route.meta?.noCache) return;
    cachedViews.value.add(name);
  };

  // 删除缓存
  const removeCachedView = (name: string) => {
    cachedViews.value.delete(name);
  };

  // 清空缓存
  const clearCachedViews = () => {
    cachedViews.value.clear();
  };

  // 判断是否缓存
  const isCached = computed(() => {
    return cachedViews.value.has(route.name as string);
  });

  // 缓存列表
  const cachedList = computed(() => {
    return Array.from(cachedViews.value);
  });

  return {
    cachedViews,
    addCachedView,
    removeCachedView,
    clearCachedViews,
    isCached,
    cachedList,
  };
}
```

### useRouteTabs

```typescript
// hooks/useRouteTabs.ts
interface RouteTab {
  name: string;
  path: string;
  title: string;
  icon?: string;
  affix?: boolean; // 是否固定
  query?: any;
  params?: any;
}

export function useRouteTabs() {
  const route = useRoute();
  const router = useRouter();

  const tabs = ref<RouteTab[]>([]);
  const activeTab = ref('');

  // 添加标签
  const addTab = (tab?: RouteTab) => {
    const newTab = tab || {
      name: route.name as string,
      path: route.path,
      title: route.meta.title as string,
      icon: route.meta.icon as string,
      affix: route.meta.affix as boolean,
      query: route.query,
      params: route.params,
    };

    const existIndex = tabs.value.findIndex(t => t.path === newTab.path);
    if (existIndex === -1) {
      tabs.value.push(newTab);
    }

    activeTab.value = newTab.path;
  };

  // 移除标签
  const removeTab = (path: string) => {
    const index = tabs.value.findIndex(t => t.path === path);
    if (index === -1) return;

    const tab = tabs.value[index];
    if (tab.affix) return; // 固定标签不能关闭

    tabs.value.splice(index, 1);

    // 如果关闭的是当前标签，跳转到最后一个
    if (activeTab.value === path && tabs.value.length) {
      const lastTab = tabs.value[tabs.value.length - 1];
      router.push(lastTab.path);
    }
  };

  // 关闭其他
  const closeOtherTabs = (path: string) => {
    tabs.value = tabs.value.filter(t => t.path === path || t.affix);
  };

  // 关闭所有
  const closeAllTabs = () => {
    tabs.value = tabs.value.filter(t => t.affix);
    if (tabs.value.length) {
      router.push(tabs.value[0].path);
    }
  };

  // 刷新标签页
  const refreshTab = (path?: string) => {
    const targetPath = path || route.path;
    router.replace({
      path: '/redirect' + targetPath,
    });
  };

  return {
    tabs,
    activeTab,
    addTab,
    removeTab,
    closeOtherTabs,
    closeAllTabs,
    refreshTab,
  };
}
```

## 路由元信息

### Meta 配置

```typescript
// types/router.d.ts
import 'vue-router';

declare module 'vue-router' {
  interface RouteMeta {
    // 页面标题
    title?: string;
    // 菜单图标
    icon?: string;
    // 是否在菜单中隐藏
    hidden?: boolean;
    // 是否总是显示根菜单
    alwaysShow?: boolean;
    // 权限角色
    roles?: string[];
    // 是否缓存页面
    noCache?: boolean;
    // 是否固定在标签栏
    affix?: boolean;
    // 面包屑中是否隐藏
    breadcrumb?: boolean;
    // 高亮的菜单
    activeMenu?: string;
    // 权限标识
    permission?: string;
    // 页面过渡动画
    transition?: string;
    // 是否全屏显示
    fullscreen?: boolean;
  }
}
```

### 使用 Meta

```typescript
{
  path: '/example',
  component: () => import('@/pages/example/index.vue'),
  meta: {
    title: '示例页面',
    icon: 'example',
    roles: ['admin', 'editor'],
    noCache: false,
    affix: true,
    transition: 'fade',
  },
}

// 组件中访问
const route = useRoute();
console.log(route.meta.title); // '示例页面'
```

## 面包屑导航

```vue
<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="(item, index) in breadcrumbs" :key="item.path">
      <router-link v-if="index < breadcrumbs.length - 1" :to="item.path">
        {{ item.title }}
      </router-link>
      <span v-else>{{ item.title }}</span>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const breadcrumbs = computed(() => {
  const matched = route.matched.filter(
    item => item.meta && item.meta.title && item.meta.breadcrumb !== false
  );

  const breadcrumbs = matched.map(item => ({
    path: item.path,
    title: item.meta.title,
  }));

  // 添加首页
  if (breadcrumbs[0]?.path !== '/dashboard') {
    breadcrumbs.unshift({
      path: '/dashboard',
      title: '首页',
    });
  }

  return breadcrumbs;
});
</script>
```

## 页面过渡

### 配置过渡动画

```vue
<!-- Layout.vue -->
<template>
  <router-view v-slot="{ Component, route }">
    <transition :name="route.meta.transition || 'fade'" mode="out-in">
      <keep-alive :include="cachedViews">
        <component :is="Component" :key="route.path" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<style>
/* 淡入淡出 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 滑动 */
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s;
}
.slide-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}
.slide-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

/* 缩放 */
.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s;
}
.scale-enter-from,
.scale-leave-to {
  transform: scale(0.9);
  opacity: 0;
}
</style>
```

## 路由懒加载

### Vite 动态导入

```typescript
// 基础懒加载
{
  path: '/about',
  component: () => import('@/pages/about/index.vue'),
}

// 带预加载提示
{
  path: '/heavy',
  component: () => import(
    /* webpackChunkName: "heavy-page" */
    /* webpackPrefetch: true */
    '@/pages/heavy/index.vue'
  ),
}

// 带加载状态的懒加载
import { defineAsyncComponent } from 'vue';
import Loading from '@/components/Loading.vue';
import Error from '@/components/Error.vue';

{
  path: '/async',
  component: defineAsyncComponent({
    loader: () => import('@/pages/async/index.vue'),
    loadingComponent: Loading,
    errorComponent: Error,
    delay: 200,
    timeout: 3000,
  }),
}
```

### 路由预加载

```typescript
// 鼠标悬停时预加载
const preloadRoute = (routeName: string) => {
  const route = router.resolve({ name: routeName });
  if (route.matched[0]?.components?.default) {
    const component = route.matched[0].components.default;
    if (typeof component === 'function') {
      component(); // 触发懒加载
    }
  }
};

// 使用 IntersectionObserver 预加载
const observeLinks = () => {
  const links = document.querySelectorAll('[data-preload]');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const routeName = entry.target.getAttribute('data-preload');
        if (routeName) {
          preloadRoute(routeName);
        }
      }
    });
  });

  links.forEach(link => observer.observe(link));
};
```

## 最佳实践

### 1. 路由命名规范

```typescript
// ✅ 使用 PascalCase 命名路由
{
  name: 'UserDetail',
  path: '/user/detail/:id',
}

// ✅ 路径使用 kebab-case
{
  path: '/user-management/role-list',
}
```

### 2. 合理使用路由守卫

```typescript
// ✅ 全局守卫处理通用逻辑
router.beforeEach((to, from, next) => {
  // 权限验证、进度条等
});

// ✅ 组件守卫处理特定逻辑
onBeforeRouteLeave((to, from, next) => {
  // 保存草稿、确认离开等
});
```

### 3. 优化路由性能

```typescript
// ✅ 使用路由懒加载
component: () => import('@/pages/user/index.vue')

// ✅ 合理使用 keep-alive
<keep-alive :include="cachedViews">
  <router-view />
</keep-alive>

// ✅ 避免深层嵌套
// 最多 2-3 层嵌套
```

## API 参考

- [Vue Router 官方文档](https://router.vuejs.org/)

## 相关资源

- [布局系统](/base/layout) - 路由与布局集成
- [状态管理](/base/state) - 路由状态管理
- [内置页面](/base/builtin-pages) - 系统页面
