<!--
  测试模块首页
  提供测试功能入口导航
-->
<template>
  <div class="test-home">
    <n-card title="功能测试中心" class="mb-4">
      <n-alert type="info" class="mb-4">
        本模块用于测试 Menu、Tab、RouterHelper 相关功能
      </n-alert>

      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <n-gi>
          <n-card title="Tab 操作测试" hoverable>
            <p class="mb-4">测试 Tab 的增删改查操作</p>
            <n-button type="primary" @click="goTo('/app1/test/tab')">
              进入测试
            </n-button>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="RouterHelper 测试" hoverable>
            <p class="mb-4">测试路由辅助方法</p>
            <n-button type="primary" @click="goTo('/app1/test/router')">
              进入测试
            </n-button>
          </n-card>
        </n-gi>

        <n-gi>
          <n-card title="KeepAlive 缓存测试" hoverable>
            <p class="mb-4">测试页面缓存功能</p>
            <n-button type="primary" @click="goTo('/app1/test/cache')">
              进入测试
            </n-button>
          </n-card>
        </n-gi>
      </n-grid>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 测试模块首页组件
 * 提供各测试功能的快速入口
 */
import { useRouter } from 'vue-router';

defineOptions({
  name: 'Test',
});

const router = useRouter();

function goTo(path: string) {
  router.push(path);
}
</script>

<style lang="scss" scoped>
.test-home {
  @apply p-4;
}
</style>

