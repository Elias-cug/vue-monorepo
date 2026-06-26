<template>
  <LeContainer class="storage-demo" overflow="auto">
    <!-- 页面标题 -->
    <LeCard class="header-card" padding="32px">
      <div class="header-content">
        <h1>存储信息展示</h1>
        <p class="subtitle">
          查看应用中的各类存储信息，包括 AppInfo、用户信息、路由信息和 Tab 信息
        </p>
        <n-button type="primary" @click="refreshAll">
          <template #icon>
            <n-icon><RefreshOutline /></n-icon>
          </template>
          刷新全部
        </n-button>
      </div>
    </LeCard>

    <!-- 信息展示区域 -->
    <div class="info-grid">
      <!-- AppInfo 信息 -->
      <LeCard class="info-card" padding="0">
        <div class="card-title-bar" style="--title-color: #667eea">
          <n-icon :size="22"><AppsOutline /></n-icon>
          <span>AppInfo 应用信息</span>
        </div>
        <div class="card-body">
          <n-spin :show="loading.appInfo">
            <div class="info-content">
              <n-descriptions :column="1" label-placement="left" bordered>
                <n-descriptions-item label="应用 ID">
                  {{ appInfo?.id || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="应用名称">
                  {{ appInfo?.name || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="版本号">
                  {{ appInfo?.version || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="描述">
                  {{ appInfo?.description || '-' }}
                </n-descriptions-item>
              </n-descriptions>
              <n-collapse class="raw-data-collapse">
                <n-collapse-item title="原始数据 (JSON)" name="appInfo">
                  <n-code :code="formatJson(appInfo)" language="json" />
                </n-collapse-item>
              </n-collapse>
            </div>
          </n-spin>
        </div>
      </LeCard>

      <!-- 用户信息 -->
      <LeCard class="info-card" padding="0">
        <div class="card-title-bar" style="--title-color: #f093fb">
          <n-icon :size="22"><PersonOutline /></n-icon>
          <span>用户信息</span>
        </div>
        <div class="card-body">
          <n-spin :show="loading.userInfo">
            <div class="info-content">
              <n-descriptions :column="1" label-placement="left" bordered>
                <n-descriptions-item label="用户 ID">
                  {{ userInfo?.id || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="用户名">
                  {{ userInfo?.username || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="昵称">
                  {{ userInfo?.nickname || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="邮箱">
                  {{ userInfo?.email || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="手机号">
                  {{ userInfo?.phone || '-' }}
                </n-descriptions-item>
                <n-descriptions-item label="角色">
                  <n-tag
                    v-for="role in userInfo?.roles || []"
                    :key="role"
                    type="info"
                    size="small"
                    style="margin-right: 4px"
                  >
                    {{ role }}
                  </n-tag>
                  <span v-if="!userInfo?.roles?.length">-</span>
                </n-descriptions-item>
              </n-descriptions>
              <n-collapse class="raw-data-collapse">
                <n-collapse-item title="原始数据 (JSON)" name="userInfo">
                  <n-code :code="formatJson(userInfo)" language="json" />
                </n-collapse-item>
              </n-collapse>
            </div>
          </n-spin>
        </div>
      </LeCard>

      <!-- 注册路由信息 -->
      <LeCard class="info-card route-card" padding="0">
        <div class="card-title-bar" style="--title-color: #13c2c2">
          <n-icon :size="22"><GitNetworkOutline /></n-icon>
          <span>注册路由信息</span>
          <n-tag type="success" size="small" style="margin-left: auto">
            共 {{ routes.length }} 条
          </n-tag>
        </div>
        <div class="card-body">
          <n-spin :show="loading.routes">
            <div class="info-content">
              <n-data-table
                :columns="routeColumns"
                :data="routes"
                :max-height="400"
                :scroll-x="600"
                size="small"
                striped
              />
              <n-collapse class="raw-data-collapse">
                <n-collapse-item title="原始数据 (JSON)" name="routes">
                  <n-code :code="formatJson(routes)" language="json" />
                </n-collapse-item>
              </n-collapse>
            </div>
          </n-spin>
        </div>
      </LeCard>

      <!-- Tab 信息 -->
      <LeCard class="info-card tab-card" padding="0">
        <div class="card-title-bar" style="--title-color: #fa8c16">
          <n-icon :size="22"><TabletLandscapeOutline /></n-icon>
          <span>Tab 标签页信息</span>
          <n-tag type="warning" size="small" style="margin-left: auto">
            共 {{ tabs.length }} 个
          </n-tag>
        </div>
        <div class="card-body">
          <n-spin :show="loading.tabs">
            <div class="info-content">
              <n-data-table
                :columns="tabColumns"
                :data="tabs"
                :max-height="400"
                :scroll-x="500"
                size="small"
                striped
              />
              <n-collapse class="raw-data-collapse">
                <n-collapse-item title="原始数据 (JSON)" name="tabs">
                  <n-code :code="formatJson(tabs)" language="json" />
                </n-collapse-item>
              </n-collapse>
            </div>
          </n-spin>
        </div>
      </LeCard>
    </div>

    <!-- 缓存路由信息 -->
    <LeCard class="info-card cached-routes-card" padding="0">
      <div class="card-title-bar" style="--title-color: #52c41a">
        <n-icon :size="22"><LayersOutline /></n-icon>
        <span>缓存路由 (KeepAlive)</span>
        <n-tag type="success" size="small" style="margin-left: auto">
          共 {{ cachedRoutes.length }} 个
        </n-tag>
      </div>
      <div class="card-body">
        <div class="cached-routes-content">
          <n-space>
            <n-tag v-for="route in cachedRoutes" :key="route" type="primary" size="medium">
              {{ route }}
            </n-tag>
            <n-empty v-if="!cachedRoutes.length" description="暂无缓存路由" />
          </n-space>
        </div>
      </div>
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import { useRouter } from 'vue-router';
import { NTag } from 'naive-ui';
import { useAppStore, useAuthStore } from '@lee/base/src/store';
import {
  RefreshOutline,
  AppsOutline,
  PersonOutline,
  GitNetworkOutline,
  TabletLandscapeOutline,
  LayersOutline,
} from '@vicons/ionicons5';

defineOptions({
  name: 'StorageDemo',
});

const router = useRouter();
const appStore = useAppStore();
const authStore = useAuthStore();

// 加载状态
const loading = ref({
  appInfo: false,
  userInfo: false,
  routes: false,
  tabs: false,
});

// 数据
const appInfo = computed(() => appStore.appInfo);
const userInfo = computed(() => authStore.userInfo);
const tabs = computed(() => appStore.tabs);
const cachedRoutes = computed(() => appStore.cachedRoutes);

// 获取注册的路由信息
const routes = computed(() => {
  const allRoutes = router.getRoutes();
  // 过滤掉 parent 路由，只保留实际页面路由
  return allRoutes
    .filter(route => !route.name?.toString().endsWith('-parent'))
    .map(route => ({
      name: route.name,
      path: route.path,
      title: route.meta?.title || '-',
      keepAlive: route.meta?.keepAlive ? '是' : '否',
      layout: route.meta?.layout || 'basic',
    }));
});

// 路由表格列配置
const routeColumns = [
  {
    title: '路由名称',
    key: 'name',
    width: 180,
    ellipsis: { tooltip: true },
  },
  {
    title: '路径',
    key: 'path',
    width: 220,
    ellipsis: { tooltip: true },
  },
  {
    title: '标题',
    key: 'title',
    width: 120,
  },
  {
    title: '缓存',
    key: 'keepAlive',
    width: 80,
    render: (row: any) =>
      h(
        NTag,
        { type: row.keepAlive === '是' ? 'success' : 'default', size: 'small' },
        () => row.keepAlive
      ),
  },
  {
    title: '布局',
    key: 'layout',
    width: 100,
  },
];

// Tab 表格列配置
const tabColumns = [
  {
    title: '标题',
    key: 'title',
    width: 150,
    ellipsis: { tooltip: true },
  },
  {
    title: '路径',
    key: 'path',
    width: 200,
    ellipsis: { tooltip: true },
  },
  {
    title: 'Key',
    key: 'key',
    width: 200,
    ellipsis: { tooltip: true },
  },
  {
    title: '固定',
    key: 'pinned',
    width: 80,
    render: (row: any) =>
      h(NTag, { type: row.meta?.pinned ? 'warning' : 'default', size: 'small' }, () =>
        row.meta?.pinned ? '是' : '否'
      ),
  },
];

// 格式化 JSON
const formatJson = (data: any) => {
  try {
    return JSON.stringify(data, null, 2) || 'null';
  } catch {
    return 'null';
  }
};

// 刷新全部数据
const refreshAll = () => {
  loading.value = {
    appInfo: true,
    userInfo: true,
    routes: true,
    tabs: true,
  };

  setTimeout(() => {
    loading.value = {
      appInfo: false,
      userInfo: false,
      routes: false,
      tabs: false,
    };
  }, 500);
};

onMounted(() => {
  // 初始化时可以做一些操作
});
</script>

<style lang="scss" scoped>
.storage-demo {
  .header-card {
    margin-bottom: 24px;
    background: linear-gradient(135deg, var(--le-primary-1) 0%, var(--le-card) 50%);

    .header-content {
      text-align: center;

      h1 {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 12px 0;
        background: linear-gradient(135deg, var(--le-primary) 0%, var(--le-primary-7) 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }

      .subtitle {
        font-size: 16px;
        color: var(--le-text-2);
        margin: 0 0 20px 0;
      }
    }
  }

  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 24px;

    @media (max-width: 1200px) {
      grid-template-columns: 1fr;
    }
  }

  .info-card {
    overflow: hidden;

    .card-title-bar {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 16px 20px;
      background: linear-gradient(
        135deg,
        var(--title-color) 0%,
        color-mix(in srgb, var(--title-color) 70%, transparent) 100%
      );
      color: #fff;
      font-size: 16px;
      font-weight: 600;

      .n-icon {
        color: #fff;
      }

      .n-tag {
        background: rgba(255, 255, 255, 0.2);
        border: none;
        color: #fff;
      }
    }

    .card-body {
      padding: 20px;
    }

    .info-content {
      min-height: 200px;
    }

    .raw-data-collapse {
      margin-top: 16px;

      :deep(.n-code) {
        max-height: 300px;
        overflow: auto;
      }
    }
  }

  .route-card,
  .tab-card {
    .info-content {
      min-height: 300px;
    }
  }

  .cached-routes-card {
    .cached-routes-content {
      padding: 8px 0;
      min-height: 60px;
    }
  }
}
</style>
