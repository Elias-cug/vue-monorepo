<!--
  详情页测试
  用于测试多实例 Tab (multiTab) 功能
-->
<template>
  <div class="detail-test">
    <n-card :title="`详情页 #${id}`" class="mb-4">
      <n-alert type="success" class="mb-4">
        <template #header>
          多实例 Tab 测试页面
        </template>
        每个不同的 ID 会打开独立的 Tab，而不是复用同一个 Tab
      </n-alert>

      <n-space vertical>
        <n-card title="当前详情信息" size="small">
          <n-descriptions :column="2" label-placement="left">
            <n-descriptions-item label="详情 ID">
              {{ id }}
            </n-descriptions-item>
            <n-descriptions-item label="完整路径">
              {{ route.fullPath }}
            </n-descriptions-item>
            <n-descriptions-item label="Tab Key">
              {{ activeTab?.key || '-' }}
            </n-descriptions-item>
            <n-descriptions-item label="Tab 标题">
              {{ activeTab?.title || '-' }}
            </n-descriptions-item>
          </n-descriptions>
        </n-card>

        <n-card title="页面状态" size="small">
          <n-space>
            <n-button type="primary" @click="count++">
              计数 +1 (当前: {{ count }})
            </n-button>
            <n-input v-model:value="inputValue" placeholder="输入内容测试" style="width: 200px" />
          </n-space>
        </n-card>

        <n-card title="操作" size="small">
          <n-space wrap>
            <n-button @click="goToOtherDetail(1)">
              跳转详情 #1
            </n-button>
            <n-button @click="goToOtherDetail(2)">
              跳转详情 #2
            </n-button>
            <n-button @click="goToOtherDetail(3)">
              跳转详情 #3
            </n-button>
            <n-button type="warning" @click="closeCurrentTab">
              关闭当前详情
            </n-button>
            <n-button type="info" @click="goBackToTabTest">
              返回 Tab 测试页
            </n-button>
          </n-space>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * 详情页测试组件
 * 配置 multiTab: true，支持同一路由打开多个 Tab
 */
import { ref, computed } from 'vue';
import { useRouterHelper, useAppStore } from '@lee/base';

defineOptions({
  name: 'DetailTest',
});

const { route, router, closeCurrentTab } = useRouterHelper();
const appStore = useAppStore();

const id = computed(() => route.params.id as string);
const activeTab = computed(() => appStore.activeTab);

const count = ref(0);
const inputValue = ref('');

/** 跳转到其他详情页 */
function goToOtherDetail(targetId: number) {
  router.push(`/app1/test/detail/${targetId}`);
}

/** 返回 Tab 测试页 */
function goBackToTabTest() {
  router.push('/app1/test/tab');
}
</script>

<style lang="scss" scoped>
.detail-test {
  @apply p-4;
}
</style>

