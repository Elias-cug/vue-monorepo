<template>
  <div class="dashboard">
    <!-- 欢迎卡片 -->
    <n-card class="welcome-card" size="large">
      <div class="welcome-content">
        <div class="welcome-text">
          <h1>欢迎回来，{{ userInfo?.name || '用户' }}！</h1>
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
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <!-- 应用信息 -->
        <n-grid-item>
          <n-card title="应用信息" hoverable class="store-info-card">
            <div class="card-content">
              <n-descriptions :column="1" label-placement="left">
                <n-descriptions-item label="应用 ID">
                  {{ appStore.appInfo?.id || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="应用名称">
                  {{ appStore.appInfo?.name || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="版本">
                  {{ appStore.appInfo?.version || '-' }}
                </n-descriptions-item>
              </n-descriptions>
            </div>
          </n-card>
        </n-grid-item>
        <!-- 用户信息 -->
        <n-grid-item>
          <n-card title="用户信息" hoverable class="store-info-card">
            <div class="card-content">
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
            </div>
          </n-card>
        </n-grid-item>

        <!-- 菜单信息 -->
        <n-grid-item>
          <n-card title="菜单信息" hoverable class="store-info-card">
            <div class="card-content">
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
            </div>
          </n-card>
        </n-grid-item>

        <!-- Tab 信息 -->
        <n-grid-item>
          <n-card title="Tab 信息" hoverable class="store-info-card">
            <div class="card-content">
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
            </div>
          </n-card>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore, useAuthStore } from '@lee/base/src/store';
import { SpeedometerOutline } from '@vicons/ionicons5';

defineOptions({
  name: 'Main',
});

const router = useRouter();

const appStore = useAppStore();
const authStore = useAuthStore();

const { userInfo } = storeToRefs(authStore);
const { tabs } = storeToRefs(appStore);

// 当前激活的 tab
const activeTab = computed(() => {
  const currentPath = router.currentRoute.value.fullPath;
  return tabs.value.find(tab => tab.key === currentPath);
});
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

    .store-info-card {
      height: 200px;
      display: flex;
      flex-direction: column;

      :deep(.n-card__content) {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
      }

      .card-content {
        flex: 1;
        overflow-y: auto;
        overflow-x: hidden;

        &::-webkit-scrollbar {
          width: 6px;
        }

        &::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;

          &:hover {
            background: #555;
          }
        }
      }
    }
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
