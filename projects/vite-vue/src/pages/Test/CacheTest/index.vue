<!--
  KeepAlive 缓存测试页面
  测试页面缓存相关功能
-->
<template>
  <div class="cache-test">
    <n-card title="KeepAlive 缓存测试" class="mb-4">
      <n-alert :type="isKeptAlive ? 'success' : 'warning'" class="mb-4">
        <template #header>
          {{ isKeptAlive ? '✅ 本页面已配置 keepAlive' : '⚠️ 本页面未配置 keepAlive' }}
        </template>
        当前计数: {{ count }} | 输入内容: {{ inputValue || '(空)' }} | 页面创建次数: {{ createCount }}
      </n-alert>

      <n-space vertical>
        <!-- 状态测试区域 -->
        <n-card title="页面状态测试" size="small">
          <n-alert type="info" class="mb-2">
            如果页面被缓存，离开后再回来，下面的状态会保留
          </n-alert>
          <n-space vertical>
            <n-space>
              <n-button type="primary" @click="count++">
                计数 +1 (当前: {{ count }})
              </n-button>
              <n-button @click="count = 0">
                重置计数
              </n-button>
            </n-space>
            <n-input v-model:value="inputValue" placeholder="输入一些内容，测试缓存是否保留" />
          </n-space>
        </n-card>

        <!-- 缓存操作 -->
        <n-card title="缓存操作" size="small">
          <n-space>
            <n-button type="info" @click="goToRouterTest">
              跳转到 RouterHelper 测试页
            </n-button>
            <n-button type="warning" @click="clearMyCacheAndGo">
              清除本页缓存并跳转
            </n-button>
            <n-button type="error" @click="clearAllAndGo">
              清除所有缓存并跳转
            </n-button>
          </n-space>
        </n-card>

        <!-- 对比测试 -->
        <n-card title="缓存 vs 非缓存对比" size="small">
          <n-alert type="info" class="mb-2">
            跳转到其他页面再回来，观察状态是否保留
          </n-alert>
          <n-space>
            <n-button @click="goToNoCache">
              跳转到无缓存页面
            </n-button>
            <n-button type="success" @click="refreshCurrentPage">
              刷新当前页面 (清除缓存)
            </n-button>
          </n-space>
        </n-card>

        <!-- 当前路由信息 -->
        <n-card title="当前路由信息" size="small">
          <n-descriptions :column="1" label-placement="left">
            <n-descriptions-item label="路径">
              {{ route.path }}
            </n-descriptions-item>
            <n-descriptions-item label="完整路径">
              {{ route.fullPath }}
            </n-descriptions-item>
            <n-descriptions-item label="路由名称">
              {{ route.name }}
            </n-descriptions-item>
            <n-descriptions-item label="Query 参数">
              {{ JSON.stringify(route.query) }}
            </n-descriptions-item>
            <n-descriptions-item label="keepAlive">
              {{ route.meta?.keepAlive ? '是' : '否' }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * KeepAlive 缓存测试页面组件
 * 用于验证页面缓存功能是否正常工作
 */
import { ref, onMounted } from 'vue';
import { useRouterHelper } from '@lee/base';

defineOptions({
  name: 'CacheTest',
});

const {
  route,
  router,
  clearCacheAndGo,
  clearAllCacheAndGo,
  refreshCurrentPage,
} = useRouterHelper();

const count = ref(0);
const inputValue = ref('');
const createCount = ref(0);
const isKeptAlive = route.meta?.keepAlive === true;

onMounted(() => {
  createCount.value++;
  console.log('[CacheTest] onMounted - 页面创建次数:', createCount.value);
});

/** 跳转到 RouterHelper 测试页 */
function goToRouterTest() {
  router.push('/app1/test/router');
}

/** 清除本页缓存并跳转 */
function clearMyCacheAndGo() {
  clearCacheAndGo('/app1/test/router', 'CacheTest');
}

/** 清除所有缓存并跳转 */
function clearAllAndGo() {
  clearAllCacheAndGo('/app1/test/router');
}

/** 跳转到无缓存页面 */
function goToNoCache() {
  router.push('/app1/test/no-cache');
}
</script>

<style lang="scss" scoped>
.cache-test {
  @apply p-4;
}
</style>

