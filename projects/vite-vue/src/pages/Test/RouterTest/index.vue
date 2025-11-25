<!--
  RouterHelper 测试页面
  测试所有路由辅助方法
-->
<template>
  <div class="router-test">
    <n-card title="RouterHelper 测试" class="mb-4">
      <n-alert type="info" class="mb-4">
        当前路由: {{ route.path }} | 缓存路由数: {{ cachedRoutes.length }}
      </n-alert>

      <n-space vertical>
        <!-- 登出测试 -->
        <n-card title="登出测试" size="small">
          <n-space>
            <n-button type="error" @click="handleLogout(true)">
              登出 (保留重定向)
            </n-button>
            <n-button type="warning" @click="handleLogout(false)">
              登出 (不保留重定向)
            </n-button>
          </n-space>
        </n-card>

        <!-- 跳转并清除 Tab -->
        <n-card title="清除当前 Tab 并跳转" size="small">
          <n-alert type="warning" class="mb-2">
            clearCurrentTabAndGo: 关闭当前 Tab 后跳转到目标页面
          </n-alert>
          <n-space>
            <n-button type="primary" @click="clearTabAndGoHome">
              关闭当前 Tab 并跳转首页
            </n-button>
            <n-button @click="clearTabAndGoCache">
              关闭当前 Tab 并跳转缓存测试页
            </n-button>
          </n-space>
        </n-card>

        <!-- 清除缓存并跳转 -->
        <n-card title="清除缓存并跳转" size="small">
          <n-alert type="warning" class="mb-2">
            clearCacheAndGo: 清除目标页面的 keepAlive 缓存后跳转
          </n-alert>
          <n-space>
            <n-button type="info" @click="clearCacheAndGoToCache">
              清除缓存并跳转到缓存测试页
            </n-button>
            <n-button @click="clearCacheAndGoToHome">
              清除首页缓存并跳转
            </n-button>
          </n-space>
        </n-card>

        <!-- 清除所有缓存并跳转 -->
        <n-card title="清除所有缓存并跳转" size="small">
          <n-alert type="warning" class="mb-2">
            clearAllCacheAndGo: 清除所有 keepAlive 缓存后跳转
          </n-alert>
          <n-space>
            <n-button type="error" @click="clearAllCacheAndGoHome">
              清除所有缓存并跳转首页
            </n-button>
          </n-space>
        </n-card>

        <!-- 刷新当前页面 -->
        <n-card title="刷新当前页面" size="small">
          <n-alert type="warning" class="mb-2">
            refreshCurrentPage: 通过清除缓存实现页面刷新
          </n-alert>
          <n-space>
            <n-button type="success" @click="handleRefresh">
              刷新当前页面
            </n-button>
          </n-space>
        </n-card>

        <!-- 带参数跳转测试 -->
        <n-card title="带参数跳转测试" size="small">
          <n-alert type="info" class="mb-2">
            测试 query、params 等各种参数跳转方式
          </n-alert>
          <n-space wrap>
            <n-button @click="goWithQuery">
              带 Query 参数跳转
            </n-button>
            <n-button @click="goWithParams">
              带 Params 参数跳转 (详情页)
            </n-button>
            <n-button @click="goWithNamedRoute">
              命名路由跳转
            </n-button>
          </n-space>
        </n-card>

        <!-- 当前缓存列表 -->
        <n-card title="当前缓存的路由组件" size="small">
          <n-tag v-for="name in cachedRoutes" :key="name" type="success" class="mr-2 mb-2">
            {{ name }}
          </n-tag>
          <n-empty v-if="cachedRoutes.length === 0" description="暂无缓存" />
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * RouterHelper 测试页面组件
 * 覆盖 useRouterHelper 的所有方法测试
 */
import { computed } from 'vue';
import { useAppStore, useRouterHelper } from '@lee/base';

defineOptions({
  name: 'RouterTest',
});

const appStore = useAppStore();
const {
  route,
  logout,
  clearCurrentTabAndGo,
  clearCacheAndGo,
  clearAllCacheAndGo,
  refreshCurrentPage,
} = useRouterHelper();

const cachedRoutes = computed(() => appStore.cachedRoutes);

/** 登出 */
function handleLogout(redirect: boolean) {
  logout(redirect);
}

/** 关闭当前 Tab 并跳转首页 */
function clearTabAndGoHome() {
  clearCurrentTabAndGo('/app1/main');
}

/** 关闭当前 Tab 并跳转缓存测试页 */
function clearTabAndGoCache() {
  clearCurrentTabAndGo('/app1/test/cache');
}

/** 清除缓存并跳转到缓存测试页 */
function clearCacheAndGoToCache() {
  clearCacheAndGo('/app1/test/cache', 'CacheTest');
}

/** 清除首页缓存并跳转 */
function clearCacheAndGoToHome() {
  clearCacheAndGo('/app1/main', 'Main');
}

/** 清除所有缓存并跳转首页 */
function clearAllCacheAndGoHome() {
  clearAllCacheAndGo('/app1/main');
}

/** 刷新当前页面 */
function handleRefresh() {
  refreshCurrentPage();
}

/** 带 query 参数跳转 */
function goWithQuery() {
  clearCacheAndGo({
    path: '/app1/test/cache',
    query: {
      page: 1,
      keyword: 'test',
      timestamp: Date.now(),
    },
  });
}

/** 带 params 参数跳转 */
function goWithParams() {
  clearCacheAndGo({
    name: 'DetailTest',
    params: { id: '999' },
  });
}

/** 命名路由跳转 */
function goWithNamedRoute() {
  clearCacheAndGo({
    name: 'CacheTest',
    query: { from: 'router-test' },
  });
}
</script>

<style lang="scss" scoped>
.router-test {
  @apply p-4;
}
</style>

