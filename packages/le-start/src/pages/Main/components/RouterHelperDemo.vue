<!--
  路由辅助功能演示组件
  展示 useRouterHelper 的各项能力
-->
<template>
  <div class="router-helper-demo">
    <!-- 功能分类展示 -->
    <n-grid :cols="2" :x-gap="16" :y-gap="16">
      <!-- Tab 管理 -->
      <n-grid-item>
        <n-card title="Tab 管理" size="small" class="demo-card">
          <n-space vertical>
            <n-button block @click="handleRefreshPage">
              <template #icon>
                <n-icon><RefreshOutline /></n-icon>
              </template>
              刷新当前页面
            </n-button>
            <n-button block @click="handleCloseCurrentTab">
              <template #icon>
                <n-icon><CloseOutline /></n-icon>
              </template>
              关闭当前 Tab
            </n-button>
            <n-button block @click="handleCloseOtherTabs">
              <template #icon>
                <n-icon><FileTrayFullOutline /></n-icon>
              </template>
              关闭其他 Tabs
            </n-button>
            <n-button block @click="handleCloseAllTabs">
              <template #icon>
                <n-icon><TrashOutline /></n-icon>
              </template>
              关闭所有 Tabs
            </n-button>
          </n-space>
        </n-card>
      </n-grid-item>

      <!-- 缓存管理 -->
      <n-grid-item>
        <n-card title="缓存管理" size="small" class="demo-card">
          <n-space vertical>
            <n-button block type="info" @click="handleClearCacheAndReload">
              <template #icon>
                <n-icon><CloudDownloadOutline /></n-icon>
              </template>
              清除缓存并重载
            </n-button>
            <n-button block type="info" @click="handleClearAllCacheAndHome">
              <template #icon>
                <n-icon><ServerOutline /></n-icon>
              </template>
              清除所有缓存并返回首页
            </n-button>
            <n-alert type="info" size="small" :bordered="false">
              当前缓存页面数：{{ cachedRoutesCount }}
            </n-alert>
          </n-space>
        </n-card>
      </n-grid-item>

      <!-- 页面跳转 -->
      <n-grid-item>
        <n-card title="页面跳转" size="small" class="demo-card">
          <n-space vertical>
            <n-button block type="success" @click="handleGoToDemo1">
              <template #icon>
                <n-icon><ArrowForwardOutline /></n-icon>
              </template>
              跳转到 Demo1 页面
            </n-button>
            <n-button block type="success" @click="handleGoToDemo2">
              <template #icon>
                <n-icon><ArrowForwardOutline /></n-icon>
              </template>
              跳转到 Demo2 页面
            </n-button>
            <n-button block type="success" @click="handleClearAndGoDemo1">
              <template #icon>
                <n-icon><SwapHorizontalOutline /></n-icon>
              </template>
              关闭当前并跳转 Demo1
            </n-button>
          </n-space>
        </n-card>
      </n-grid-item>

      <!-- 系统操作 -->
      <n-grid-item>
        <n-card title="系统操作" size="small" class="demo-card">
          <n-space vertical>
            <n-button block type="warning" @click="handleLogout(false)">
              <template #icon>
                <n-icon><LogOutOutline /></n-icon>
              </template>
              退出登录（不保留重定向）
            </n-button>
            <n-button block type="error" @click="handleLogout(true)">
              <template #icon>
                <n-icon><ExitOutline /></n-icon>
              </template>
              退出登录（保留重定向）
            </n-button>
            <n-alert type="warning" size="small" :bordered="false">退出会清除所有状态</n-alert>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>

    <!-- 功能说明 -->
    <n-card title="功能说明" size="small" class="info-card" style="margin-top: 16px">
      <n-collapse>
        <n-collapse-item title="Tab 管理" name="tabs">
          <n-ul>
            <n-li>
              <n-text strong>刷新当前页面：</n-text>
              通过清除 keepAlive 缓存实现页面重载
            </n-li>
            <n-li>
              <n-text strong>关闭当前 Tab：</n-text>
              关闭并自动跳转到相邻 Tab
            </n-li>
            <n-li>
              <n-text strong>关闭其他 Tabs：</n-text>
              保留当前和固定的 Tab
            </n-li>
            <n-li>
              <n-text strong>关闭所有 Tabs：</n-text>
              只保留固定的 Tab
            </n-li>
          </n-ul>
        </n-collapse-item>

        <n-collapse-item title="缓存管理" name="cache">
          <n-ul>
            <n-li>
              <n-text strong>clearCacheAndGo：</n-text>
              清除指定组件缓存后跳转，适合表单提交后刷新
            </n-li>
            <n-li>
              <n-text strong>clearAllCacheAndGo：</n-text>
              清除所有组件缓存后跳转，适合全局重置
            </n-li>
            <n-li>
              <n-text strong>keepAlive 机制：</n-text>
              跳转完成后会自动恢复需要缓存的页面
            </n-li>
          </n-ul>
        </n-collapse-item>

        <n-collapse-item title="页面跳转" name="navigation">
          <n-ul>
            <n-li>
              <n-text strong>router.push：</n-text>
              支持字符串路径、路径对象、命名路由
            </n-li>
            <n-li>
              <n-text strong>clearCurrentTabAndGo：</n-text>
              关闭当前 Tab 并跳转到新页面
            </n-li>
            <n-li>
              <n-text strong>参数传递：</n-text>
              支持 params、query、hash 等所有路由参数
            </n-li>
          </n-ul>
        </n-collapse-item>

        <n-collapse-item title="系统操作" name="system">
          <n-ul>
            <n-li>
              <n-text strong>logout：</n-text>
              清除 token、持久化状态、缓存路由，跳转登录页
            </n-li>
            <n-li>
              <n-text strong>redirect 参数：</n-text>
              控制是否保留当前路由作为重定向目标
            </n-li>
            <n-li>
              <n-text strong>状态清理：</n-text>
              包括 tabs、collapsed、cachedRoutes 等
            </n-li>
          </n-ul>
        </n-collapse-item>
      </n-collapse>
    </n-card>

    <!-- API 列表 -->
    <n-card title="API 列表" size="small" style="margin-top: 16px">
      <n-table :bordered="false" size="small" striped>
        <thead>
          <tr>
            <th style="width: 200px">方法名</th>
            <th style="width: 150px">参数</th>
            <th>说明</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><n-text code>logout</n-text></td>
            <td><n-text depth="3">redirect?: boolean</n-text></td>
            <td>退出登录，清除所有状态</td>
          </tr>
          <tr>
            <td><n-text code>refreshCurrentPage</n-text></td>
            <td><n-text depth="3">-</n-text></td>
            <td>刷新当前页面（清除缓存）</td>
          </tr>
          <tr>
            <td><n-text code>closeCurrentTab</n-text></td>
            <td><n-text depth="3">-</n-text></td>
            <td>关闭当前 Tab</td>
          </tr>
          <tr>
            <td><n-text code>closeOtherTabs</n-text></td>
            <td><n-text depth="3">-</n-text></td>
            <td>关闭其他 Tabs</td>
          </tr>
          <tr>
            <td><n-text code>closeAllTabs</n-text></td>
            <td><n-text depth="3">to?: RouteLocationRaw</n-text></td>
            <td>关闭所有 Tabs</td>
          </tr>
          <tr>
            <td><n-text code>clearCacheAndGo</n-text></td>
            <td><n-text depth="3">to, name?, replace?</n-text></td>
            <td>清除指定缓存并跳转</td>
          </tr>
          <tr>
            <td><n-text code>clearAllCacheAndGo</n-text></td>
            <td><n-text depth="3">to, replace?</n-text></td>
            <td>清除所有缓存并跳转</td>
          </tr>
          <tr>
            <td><n-text code>clearCurrentTabAndGo</n-text></td>
            <td><n-text depth="3">to, replace?</n-text></td>
            <td>清除当前 Tab 并跳转</td>
          </tr>
        </tbody>
      </n-table>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useDialog, useMessage } from 'naive-ui';
import { useRouterHelper } from '@lee/base/src/composables';
import { useAppStore } from '@lee/base/src/store';
import {
  RefreshOutline,
  CloseOutline,
  FileTrayFullOutline,
  TrashOutline,
  CloudDownloadOutline,
  ServerOutline,
  ArrowForwardOutline,
  SwapHorizontalOutline,
  LogOutOutline,
  ExitOutline,
} from '@vicons/ionicons5';

const dialog = useDialog();
const message = useMessage();
const appStore = useAppStore();

const {
  router,
  logout,
  refreshCurrentPage,
  closeCurrentTab,
  closeOtherTabs,
  closeAllTabs,
  clearCacheAndGo,
  clearAllCacheAndGo,
  clearCurrentTabAndGo,
} = useRouterHelper();

// 当前缓存的页面数
const cachedRoutesCount = computed(() => appStore.cachedRoutes.length);

// 刷新当前页面
function handleRefreshPage() {
  message.info('正在刷新当前页面...');
  refreshCurrentPage();
}

// 关闭当前 Tab
function handleCloseCurrentTab() {
  dialog.warning({
    title: '确认关闭',
    content: '确定要关闭当前页面吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeCurrentTab();
      message.success('已关闭当前页面');
    },
  });
}

// 关闭其他 Tabs
function handleCloseOtherTabs() {
  dialog.warning({
    title: '确认关闭',
    content: '确定要关闭其他页面吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeOtherTabs();
      message.success('已关闭其他页面');
    },
  });
}

// 关闭所有 Tabs
function handleCloseAllTabs() {
  dialog.warning({
    title: '确认关闭',
    content: '确定要关闭所有页面吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeAllTabs();
      message.success('已关闭所有页面');
    },
  });
}

// 清除缓存并重新加载当前页
function handleClearCacheAndReload() {
  message.info('正在清除缓存并重载...');
  clearCacheAndGo(router.currentRoute.value.fullPath);
}

// 清除所有缓存并返回首页
function handleClearAllCacheAndHome() {
  dialog.info({
    title: '提示',
    content: '这将清除所有页面缓存并返回首页',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      clearAllCacheAndGo('/main');
      message.success('已清除所有缓存');
    },
  });
}

// 跳转到 Demo1
function handleGoToDemo1() {
  router.push('/demo1');
}

// 跳转到 Demo2
function handleGoToDemo2() {
  router.push({
    path: '/demo2',
    query: { from: 'main', timestamp: Date.now() },
  });
}

// 关闭当前并跳转到 Demo1
function handleClearAndGoDemo1() {
  clearCurrentTabAndGo('/demo1');
  message.success('已跳转到 Demo1');
}

// 退出登录
function handleLogout(redirect: boolean) {
  dialog.error({
    title: '确认退出',
    content: redirect
      ? '确定要退出登录吗？将保留当前路由以便重新登录后返回。'
      : '确定要退出登录吗？退出后将直接跳转到登录页。',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      logout(redirect);
      message.warning('已退出登录');
    },
  });
}
</script>

<style lang="scss" scoped>
.router-helper-demo {
  .demo-card {
    height: 100%;

    :deep(.n-card__content) {
      height: calc(100% - 48px);
    }
  }

  .info-card {
    :deep(.n-collapse-item__header-main) {
      font-weight: 600;
    }
  }

  :deep(.n-button) {
    justify-content: flex-start;
  }
}

// 暗色模式
:global(.dark) {
  .router-helper-demo {
    .demo-card {
      :deep(.n-card__header) {
        background-color: rgba(255, 255, 255, 0.05);
      }
    }
  }
}
</style>
