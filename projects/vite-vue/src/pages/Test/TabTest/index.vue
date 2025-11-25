<!--
  Tab 操作测试页面
  测试所有 Tab 相关功能：添加、关闭、更新标题等
-->
<template>
  <div class="tab-test">
    <n-card title="Tab 操作测试" class="mb-4">
      <n-alert type="info" class="mb-4">
        当前 Tabs 数量: {{ tabs.length }} | 激活 Tab: {{ activeTab?.title || '无' }}
      </n-alert>

      <n-space vertical>
        <!-- Tab 基本操作 -->
        <n-card title="基本操作" size="small">
          <n-space>
            <n-button type="primary" @click="closeCurrentTab">
              关闭当前 Tab
            </n-button>
            <n-button type="warning" @click="closeOtherTabs">
              关闭其他 Tabs
            </n-button>
            <n-button type="error" @click="closeAllTabs">
              关闭所有 Tabs
            </n-button>
          </n-space>
        </n-card>

        <!-- Tab 标题更新 -->
        <n-card title="更新 Tab 标题" size="small">
          <n-space>
            <n-input v-model:value="newTitle" placeholder="输入新标题" style="width: 200px" />
            <n-button type="info" @click="updateCurrentTabTitle">
              更新当前 Tab 标题
            </n-button>
          </n-space>
        </n-card>

        <!-- 多实例 Tab 测试 -->
        <n-card title="多实例 Tab (multiTab) 测试" size="small">
          <n-alert type="warning" class="mb-2">
            multiTab 为 true 时，同一页面不同参数会打开多个 Tab
          </n-alert>
          <n-space>
            <n-button @click="openMultiTabDetail(1)">
              打开详情 #1
            </n-button>
            <n-button @click="openMultiTabDetail(2)">
              打开详情 #2
            </n-button>
            <n-button @click="openMultiTabDetail(3)">
              打开详情 #3
            </n-button>
          </n-space>
        </n-card>

        <!-- 不可关闭 Tab 测试 -->
        <n-card title="固定 Tab (closable: false) 测试" size="small">
          <n-alert type="warning" class="mb-2">
            closable 为 false 时，Tab 不能被关闭
          </n-alert>
          <n-space>
            <n-button type="primary" @click="openFixedTab">
              打开固定 Tab 页面
            </n-button>
          </n-space>
        </n-card>

        <!-- 当前 Tab 列表 -->
        <n-card title="当前 Tab 列表" size="small">
          <n-table :bordered="false" :single-line="false">
            <thead>
              <tr>
                <th>Key</th>
                <th>标题</th>
                <th>路径</th>
                <th>可关闭</th>
                <th>多实例</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="tab in tabs" :key="tab.key" :class="{ 'active-row': tab.key === activeTab?.key }">
                <td>{{ tab.key }}</td>
                <td>{{ tab.title }}</td>
                <td>{{ tab.path }}</td>
                <td>{{ tab.closable === false ? '否' : '是' }}</td>
                <td>{{ tab.multiTab ? '是' : '否' }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-card>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
/**
 * Tab 操作测试页面组件
 * 覆盖所有 Tab 相关的测试场景
 */
import { ref, computed } from 'vue';
import { useAppStore, useRouterHelper } from '@lee/base';

defineOptions({
  name: 'TabTest',
});

const appStore = useAppStore();
const { closeCurrentTab, closeOtherTabs, closeAllTabs, router } = useRouterHelper();

const newTitle = ref('');

const tabs = computed(() => appStore.tabs);
const activeTab = computed(() => appStore.activeTab);

/** 更新当前 Tab 标题 */
function updateCurrentTabTitle() {
  if (!activeTab.value || !newTitle.value) return;
  appStore.updateTabTitle({
    key: activeTab.value.key,
    title: newTitle.value,
  });
  newTitle.value = '';
}

/** 打开多实例详情页 */
function openMultiTabDetail(id: number) {
  router.push(`/app1/test/detail/${id}`);
}

/** 打开固定 Tab 页面 */
function openFixedTab() {
  router.push('/app1/test/fixed');
}
</script>

<style lang="scss" scoped>
.tab-test {
  @apply p-4;

  .active-row {
    @apply bg-blue-50;
  }
}
</style>

