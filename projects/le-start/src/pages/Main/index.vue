<template>
  <LeContainer class="dashboard">
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
    <LeCard title="Store 信息" class="info-section" collapsible>
      <n-grid :cols="4" :x-gap="16" :y-gap="16">
        <!-- 应用信息 -->
        <n-grid-item>
          <LeCard title="应用信息" class="store-info-card app-info">
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
          </LeCard>
        </n-grid-item>
        <!-- 用户信息 -->
        <n-grid-item>
          <LeCard title="用户信息" class="store-info-card user-info">
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
          </LeCard>
        </n-grid-item>

        <!-- 菜单信息 -->
        <n-grid-item>
          <LeCard title="菜单信息" class="store-info-card menu-info">
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
          </LeCard>
        </n-grid-item>

        <!-- Tab 信息 -->
        <n-grid-item>
          <LeCard title="Tab 信息" class="store-info-card tab-info">
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
          </LeCard>
        </n-grid-item>
      </n-grid>
    </LeCard>

    <!-- 类型信息展示 -->
    <LeCard title="类型定义信息" class="type-info-section" collapsible>
      <n-tabs type="line" animated>
        <n-tab-pane name="appInfo" tab="AppInfo">
          <TypeDisplay :type-info="appInfoType" />
        </n-tab-pane>
        <n-tab-pane name="userInfo" tab="UserInfo">
          <TypeDisplay :type-info="userInfoType" />
        </n-tab-pane>
        <n-tab-pane name="route" tab="Route">
          <TypeDisplay :type-info="routeType" />
        </n-tab-pane>
        <n-tab-pane name="menu" tab="Menu">
          <TypeDisplay :type-info="menuType" />
        </n-tab-pane>
        <n-tab-pane name="tab" tab="TabItem">
          <TypeDisplay :type-info="tabType" />
        </n-tab-pane>
      </n-tabs>
    </LeCard>

    <!-- useRouterHelper 能力展示 -->
    <LeCard title="useRouterHelper 路由辅助功能" class="router-helper-section" collapsible>
      <RouterHelperDemo />
    </LeCard>
  </LeContainer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAppStore, useAuthStore } from '@lee/base/src/store';
import { SpeedometerOutline } from '@vicons/ionicons5';
import TypeDisplay from './components/TypeDisplay.vue';
import RouterHelperDemo from './components/RouterHelperDemo.vue';

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

// AppInfo 类型定义
const appInfoType = {
  name: 'AppInfo',
  fields: [
    { name: 'id', type: 'string', required: true, description: '应用 ID' },
    { name: 'name', type: 'string', required: true, description: '应用名称' },
    { name: 'icon', type: 'string', required: true, description: '应用图标' },
    { name: 'version', type: 'string', required: false, description: '应用版本' },
    { name: 'description', type: 'string', required: false, description: '应用描述' },
    { name: 'theme', type: 'string', required: false, description: '应用主题' },
  ],
};

// UserInfo 类型定义
const userInfoType = {
  name: 'UserInfo',
  fields: [
    { name: 'id', type: 'string | number', required: false, description: '用户 ID' },
    { name: 'username', type: 'string', required: false, description: '用户名' },
    { name: 'name', type: 'string', required: false, description: '姓名' },
    { name: 'email', type: 'string', required: false, description: '邮箱' },
    { name: 'phone', type: 'string', required: false, description: '电话' },
    { name: 'avatar', type: 'string', required: false, description: '头像' },
    { name: 'roles', type: 'string[]', required: false, description: '角色列表' },
    { name: '[key: string]', type: 'any', required: false, description: '其他信息' },
  ],
};

// Route 类型定义（包含 RouteMeta）
const routeType = {
  name: 'Route',
  fields: [
    { name: 'path', type: 'string', required: true, description: '路由路径' },
    { name: 'name', type: 'string', required: true, description: '路由名称' },
    { name: 'component', type: 'any', required: true, description: '路由组件' },
    { name: 'redirect', type: 'string', required: false, description: '重定向路径' },
    { name: 'children', type: 'Route[]', required: false, description: '子路由' },
    { name: 'meta', type: 'RouteMeta', required: true, description: '路由元信息' },
  ],
  nested: [
    {
      name: 'RouteMeta',
      fields: [
        { name: 'title', type: 'string', required: true, description: '页面标题' },
        { name: 'icon', type: 'any', required: false, description: '图标' },
        {
          name: 'layout',
          type: "'basic' | 'blank' | 'header'",
          required: false,
          description: '布局类型',
        },
        { name: 'keepAlive', type: 'boolean', required: false, description: '是否缓存' },
        { name: 'pinned', type: 'boolean', required: false, description: '是否固定' },
        { name: 'multiTab', type: 'boolean', required: false, description: '是否支持多标签页' },
        { name: 'hidden', type: 'boolean', required: false, description: '是否隐藏' },
      ],
    },
  ],
};

// Menu 类型定义（包含 menuMeta 和 RouteMeta）
const menuType = {
  name: 'Menu',
  fields: [
    { name: 'key', type: 'string', required: true, description: '唯一值' },
    { name: 'title', type: 'string', required: true, description: '菜单名称' },
    { name: 'pinned', type: 'boolean', required: false, description: '是否固定' },
    { name: 'hidden', type: 'boolean', required: false, description: '是否隐藏' },
    {
      name: 'query',
      type: 'Record<string, any>',
      required: false,
      description: '后端配置的 query',
    },
    {
      name: 'extraProps',
      type: 'Record<string, any>',
      required: false,
      description: '其他业务属性',
    },
    { name: 'meta', type: 'menuMeta', required: true, description: '菜单元信息' },
    { name: 'path', type: 'string', required: false, description: '前端路径' },
    { name: 'icon', type: 'string | any', required: false, description: '菜单图标' },
    { name: 'children', type: 'Menu[]', required: false, description: '子菜单' },
  ],
  nested: [
    {
      name: 'menuMeta',
      extends: 'RouteMeta',
      fields: [
        { name: 'menuKey', type: 'string', required: false, description: '菜单键值' },
        {
          name: 'extraProps',
          type: 'Record<string, any>',
          required: false,
          description: '额外属性',
        },
      ],
    },
    {
      name: 'RouteMeta',
      fields: [
        { name: 'title', type: 'string', required: true, description: '页面标题' },
        { name: 'icon', type: 'any', required: false, description: '图标' },
        {
          name: 'layout',
          type: "'basic' | 'blank' | 'header'",
          required: false,
          description: '布局类型',
        },
        { name: 'keepAlive', type: 'boolean', required: false, description: '是否缓存' },
        { name: 'pinned', type: 'boolean', required: false, description: '是否固定' },
        { name: 'multiTab', type: 'boolean', required: false, description: '是否支持多标签页' },
        { name: 'hidden', type: 'boolean', required: false, description: '是否隐藏' },
      ],
    },
  ],
};

// TabItem 类型定义（包含 TabMeta、menuMeta 和 RouteMeta）
const tabType = {
  name: 'TabItem',
  fields: [
    { name: 'key', type: 'string', required: true, description: 'Tab 的唯一 key，绑定 fullPath' },
    { name: 'title', type: 'string', required: true, description: 'Tab 显示的名称' },
    { name: 'path', type: 'string', required: true, description: 'Tab 的路径' },
    { name: 'query', type: 'Record<string, any>', required: false, description: 'Tab 的 query' },
    { name: 'params', type: 'Record<string, any>', required: false, description: 'Tab 的参数' },
    { name: 'meta', type: 'TabMeta', required: false, description: 'Tab 的元信息' },
  ],
  nested: [
    {
      name: 'TabMeta',
      extends: 'menuMeta',
      fields: [],
    },
    {
      name: 'menuMeta',
      extends: 'RouteMeta',
      fields: [
        { name: 'menuKey', type: 'string', required: false, description: '菜单键值' },
        {
          name: 'extraProps',
          type: 'Record<string, any>',
          required: false,
          description: '额外属性',
        },
      ],
    },
    {
      name: 'RouteMeta',
      fields: [
        { name: 'title', type: 'string', required: true, description: '页面标题' },
        { name: 'icon', type: 'any', required: false, description: '图标' },
        {
          name: 'layout',
          type: "'basic' | 'blank' | 'header'",
          required: false,
          description: '布局类型',
        },
        { name: 'keepAlive', type: 'boolean', required: false, description: '是否缓存' },
        { name: 'pinned', type: 'boolean', required: false, description: '是否固定' },
        { name: 'multiTab', type: 'boolean', required: false, description: '是否支持多标签页' },
        { name: 'hidden', type: 'boolean', required: false, description: '是否隐藏' },
      ],
    },
  ],
};
</script>

<style lang="scss" scoped>
.dashboard {
  height: 100%;
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

  .info-section {
    margin-bottom: 24px;

    .store-info-card {
      height: 200px;

      :deep(.le-card__header) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      :deep(.le-card__title) {
        color: white;
      }

      :deep(.n-descriptions-item__label),
      :deep(.n-descriptions-item__content) {
        color: white;
      }

      &.app-info {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &.user-info {
        background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
      }

      &.menu-info {
        background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
      }

      &.tab-info {
        background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
      }
    }
  }

  .type-info-section {
    margin-bottom: 24px;

    :deep(.n-tabs-nav) {
      padding: 0 16px;
    }

    :deep(.n-tabs-tab-pad) {
      border-bottom: 1px solid rgba(0, 0, 0, 0.06);
    }
  }

  .router-helper-section {
    :deep(.n-card__content) {
      padding: 16px;
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

    .type-info-section {
      :deep(.n-tabs-tab-pad) {
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
      }
    }
  }
}
</style>
