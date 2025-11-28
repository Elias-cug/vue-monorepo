<template>
  <div class="dashboard">
    <!-- 欢迎卡片 -->
    <n-card class="welcome-card" size="large">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>欢迎回来，{{ userInfo?.username || '用户' }}！</h1>
          <p>这是你的工作台，可以查看系统信息和快速访问功能</p>
        </div>
        <n-icon size="100" color="#1890ff">
          <SpeedometerOutline />
        </n-icon>
      </div>
    </n-card>

    <!-- Store 信息展示 -->
    <div class="info-section">
      <h2 class="section-title">Store 信息</h2>
      <n-grid :cols="3" :x-gap="16" :y-gap="16">
        <!-- 用户信息 -->
        <n-grid-item>
          <n-card title="用户信息" hoverable>
            <n-descriptions :column="1" label-placement="left">
              <n-descriptions-item label="用户名">
                {{ userInfo?.name || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="邮箱">
                {{ userInfo?.email || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="登录状态">
                <n-tag :type="authStore.isLoaded ? 'success' : 'error'">
                  {{ authStore.isLoaded ? '已登录' : '未登录' }}
                </n-tag>
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>

        <!-- 菜单信息 -->
        <n-grid-item>
          <n-card title="菜单信息" hoverable>
            <n-descriptions :column="1" label-placement="left">
              <n-descriptions-item label="菜单总数">
                {{ authStore.flatMenus.length }}
              </n-descriptions-item>
              <n-descriptions-item label="首页菜单">
                {{ authStore.homeMenu?.title || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="根菜单">
                {{ authStore.menus.length }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>

        <!-- Tab 信息 -->
        <n-grid-item>
          <n-card title="Tab 信息" hoverable>
            <n-descriptions :column="1" label-placement="left">
              <n-descriptions-item label="打开的 Tab">
                {{ appStore.tabs.length }}
              </n-descriptions-item>
              <n-descriptions-item label="当前 Tab">
                {{ activeTab?.title || '-' }}
              </n-descriptions-item>
              <n-descriptions-item label="缓存页面">
                {{ appStore.cachedRoutes.length }}
              </n-descriptions-item>
            </n-descriptions>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 系统能力展示 -->
    <div class="capabilities-section">
      <h2 class="section-title">系统能力</h2>
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <!-- 路由管理 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/router')">
            <div class="capability-icon">
              <n-icon size="48" color="#1890ff">
                <NavigateOutline />
              </n-icon>
            </div>
            <h3>路由管理</h3>
            <p>动态路由、权限控制、路由守卫</p>
          </n-card>
        </n-grid-item>

        <!-- Tab 管理 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/tab')">
            <div class="capability-icon">
              <n-icon size="48" color="#52c41a">
                <GridOutline />
              </n-icon>
            </div>
            <h3>Tab 管理</h3>
            <p>多标签页、固定标签、标签缓存</p>
          </n-card>
        </n-grid-item>

        <!-- 缓存管理 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/cache')">
            <div class="capability-icon">
              <n-icon size="48" color="#fa8c16">
                <LayersOutline />
              </n-icon>
            </div>
            <h3>缓存管理</h3>
            <p>KeepAlive 缓存、动态刷新</p>
          </n-card>
        </n-grid-item>

        <!-- 权限管理 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/auth')">
            <div class="capability-icon">
              <n-icon size="48" color="#eb2f96">
                <LockClosedOutline />
              </n-icon>
            </div>
            <h3>权限管理</h3>
            <p>用户、菜单、角色管理</p>
          </n-card>
        </n-grid-item>

        <!-- 详情路由 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/detail/123')">
            <div class="capability-icon">
              <n-icon size="48" color="#722ed1">
                <DocumentTextOutline />
              </n-icon>
            </div>
            <h3>动态路由</h3>
            <p>参数路由、多实例 Tab</p>
          </n-card>
        </n-grid-item>

        <!-- 固定 Tab -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/fixed')">
            <div class="capability-icon">
              <n-icon size="48" color="#13c2c2">
                <PinOutline />
              </n-icon>
            </div>
            <h3>固定 Tab</h3>
            <p>固定标签页、不可关闭</p>
          </n-card>
        </n-grid-item>

        <!-- 无缓存测试 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable @click="goToPage('/app1/test/no-cache')">
            <div class="capability-icon">
              <n-icon size="48" color="#fa541c">
                <RefreshOutline />
              </n-icon>
            </div>
            <h3>无缓存页面</h3>
            <p>每次进入都重新加载</p>
          </n-card>
        </n-grid-item>

        <!-- Store 管理 -->
        <n-grid-item>
          <n-card class="capability-card" hoverable>
            <div class="capability-icon">
              <n-icon size="48" color="#faad14">
                <ServerOutline />
              </n-icon>
            </div>
            <h3>Store 管理</h3>
            <p>Pinia 状态管理、持久化</p>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>

    <!-- 快速操作 -->
    <div class="actions-section">
      <h2 class="section-title">快速操作</h2>
      <n-space size="large">
        <n-button type="primary" size="large" @click="handleRefresh">
          <template #icon>
            <n-icon><RefreshOutline /></n-icon>
          </template>
          刷新页面
        </n-button>
        <n-button type="info" size="large" @click="handleCloseOtherTabs">
          <template #icon>
            <n-icon><CloseCircleOutline /></n-icon>
          </template>
          关闭其他 Tab
        </n-button>
        <n-button type="warning" size="large" @click="handleClearCache">
          <template #icon>
            <n-icon><TrashOutline /></n-icon>
          </template>
          清除所有缓存
        </n-button>
      </n-space>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore, useAuthStore } from '@lee/base/src/store';
import { useRouterHelper } from '@lee/base/src/composables';
import {
  SpeedometerOutline,
  NavigateOutline,
  GridOutline,
  LayersOutline,
  LockClosedOutline,
  DocumentTextOutline,
  PinOutline,
  RefreshOutline,
  ServerOutline,
  CloseCircleOutline,
  TrashOutline,
} from '@vicons/ionicons5';
import { useMessage } from 'naive-ui';

defineOptions({
  name: 'Main',
});

const router = useRouter();
const message = useMessage();
const { refreshCurrentPage, closeOtherTabs, clearAllCacheAndGo } = useRouterHelper();

const appStore = useAppStore();
const authStore = useAuthStore();

const { userInfo } = storeToRefs(authStore);
const { tabs } = storeToRefs(appStore);

// 当前激活的 tab
const activeTab = computed(() => {
  const currentPath = router.currentRoute.value.fullPath;
  return tabs.value.find(tab => tab.key === currentPath);
});

// 跳转到指定页面
const goToPage = (path: string) => {
  router.push(path);
};

// 刷新页面
const handleRefresh = () => {
  refreshCurrentPage();
  message.success('页面刷新成功');
};

// 关闭其他 Tab
const handleCloseOtherTabs = () => {
  closeOtherTabs();
  message.success('已关闭其他 Tab');
};

// 清除所有缓存
const handleClearCache = () => {
  clearAllCacheAndGo(router.currentRoute.value.fullPath);
  message.success('已清除所有缓存');
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 24px;

  .welcome-card {
    margin-bottom: 24px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);

    :deep(.n-card__content) {
      padding: 32px;
    }

    .welcome-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: white;

      .welcome-text {
        h1 {
          font-size: 32px;
          font-weight: 600;
          margin: 0 0 12px 0;
        }

        p {
          font-size: 16px;
          opacity: 0.9;
          margin: 0;
        }
      }
    }
  }

  .section-title {
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 16px 0;
    color: #333;
  }

  .info-section {
    margin-bottom: 32px;
  }

  .capabilities-section {
    margin-bottom: 32px;

    .capability-card {
      text-align: center;
      cursor: pointer;
      transition: all 0.3s;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }

      .capability-icon {
        margin-bottom: 16px;
      }

      h3 {
        font-size: 16px;
        font-weight: 600;
        margin: 0 0 8px 0;
        color: #333;
      }

      p {
        font-size: 14px;
        color: #666;
        margin: 0;
      }
    }
  }

  .actions-section {
    padding: 24px;
    background: #f5f7fa;
    border-radius: 8px;
  }
}

// 暗色模式
:global(.dark) {
  .dashboard {
    .section-title {
      color: #fff;
    }

    .capability-card {
      h3 {
        color: #fff;
      }

      p {
        color: #ccc;
      }
    }

    .actions-section {
      background: #1a1a1a;
    }
  }
}
</style>
