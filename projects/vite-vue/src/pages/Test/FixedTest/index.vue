<!--
  固定 Tab 测试页面
  用于测试 pinned: true 功能
-->
<template>
  <div class="fixed-test">
    <n-card title="固定 Tab 测试" class="mb-4">
      <n-alert type="warning" class="mb-4">
        <template #header>🔒 这是一个不可关闭的固定 Tab</template>
        本页面配置了 pinned: true，无法通过点击关闭按钮关闭
      </n-alert>

      <n-space vertical>
        <n-card title="测试说明" size="small">
          <ul>
            <li>• 尝试点击此 Tab 的关闭按钮，应该无法关闭</li>
            <li>• "关闭其他 Tabs" 不会关闭此 Tab</li>
            <li>• "关闭所有 Tabs" 也不会关闭此 Tab</li>
            <li>• 只有通过路由跳转离开（不保留 Tab）才能"关闭"</li>
          </ul>
        </n-card>

        <n-card title="操作" size="small">
          <n-space>
            <n-button type="primary" @click="goToTabTest">返回 Tab 测试页</n-button>
            <n-button type="warning" @click="closeOtherTabs">关闭其他 Tabs</n-button>
            <n-button type="error" @click="closeAllTabs">关闭所有 Tabs (我应该保留)</n-button>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 固定 Tab 测试页面组件
 * 配置 pinned: true，Tab 不可关闭
 */
import { useRouterHelper } from '@lee/base';

defineOptions({
  name: 'FixedTest',
});

const { router, closeOtherTabs, closeAllTabs } = useRouterHelper();

/** 返回 Tab 测试页 */
function goToTabTest() {
  router.push('/app1/test/tab');
}
</script>

<style lang="scss" scoped>
.fixed-test {
  @apply p-4;
}
</style>
