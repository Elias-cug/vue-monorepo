<!--
  无缓存测试页面
  用于对比 keepAlive 效果
-->
<template>
  <div class="no-cache-test">
    <n-card title="无缓存测试页面" class="mb-4">
      <n-alert type="error" class="mb-4">
        <template #header>
          ❌ 本页面未配置 keepAlive
        </template>
        每次进入都会重新创建组件，状态不会保留
      </n-alert>

      <n-space vertical>
        <n-card title="页面状态测试" size="small">
          <n-alert type="info" class="mb-2">
            离开后再回来，下面的状态会丢失（与 CacheTest 页面对比）
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
          <n-statistic label="页面创建次数" :value="createCount" class="mt-4" />
        </n-card>

        <n-card title="对比操作" size="small">
          <n-space>
            <n-button type="success" @click="goToCacheTest">
              跳转到有缓存页面 (CacheTest)
            </n-button>
            <n-button @click="goToRouterTest">
              跳转到 RouterHelper 测试页
            </n-button>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 无缓存测试页面组件
 * 未配置 keepAlive，每次进入都会重新创建
 */
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({
  name: 'NoCacheTest',
});

const router = useRouter();

const count = ref(0);
const inputValue = ref('');
const createCount = ref(0);

onMounted(() => {
  createCount.value++;
  console.log('[NoCacheTest] onMounted - 页面创建次数:', createCount.value);
});

/** 跳转到有缓存页面 */
function goToCacheTest() {
  router.push('/app1/test/cache');
}

/** 跳转到 RouterHelper 测试页 */
function goToRouterTest() {
  router.push('/app1/test/router');
}
</script>

<style lang="scss" scoped>
.no-cache-test {
  @apply p-4;
}
</style>

