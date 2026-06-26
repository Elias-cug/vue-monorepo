# 布局系统

Vue Monorepo 提供了一套完整的布局系统组件，帮助快速搭建应用的整体框架，包括标题栏、侧边栏、标签页等核心布局组件。

## 核心组件

### GlobalHeader 全局头部

全局头部组件，提供应用标题、用户信息、主题切换、文档链接等功能。

#### 基础使用

```vue
<template>
  <GlobalHeader>
    <template #header-left>
      <div class="logo">
        <img src="/logo.svg" alt="Logo" />
        <span>应用名称</span>
      </div>
    </template>

    <template #header-right>
      <DocLink />
      <ThemeSetting />
      <UserDropdown />
    </template>
  </GlobalHeader>
</template>

<script setup>
import { GlobalHeader } from '@lee/base';
</script>
```

#### 组件属性

| 属性            | 类型               | 默认值 | 说明               |
| --------------- | ------------------ | ------ | ------------------ |
| height          | `string \| number` | `60`   | 头部高度           |
| fixed           | `boolean`          | `true` | 是否固定定位       |
| bordered        | `boolean`          | `true` | 是否显示底部边框   |
| showMenuTrigger | `boolean`          | `true` | 是否显示菜单触发器 |

#### 插槽

| 插槽名        | 说明         |
| ------------- | ------------ |
| header-left   | 头部左侧内容 |
| header-center | 头部中间内容 |
| header-right  | 头部右侧内容 |
| default       | 头部主内容区 |

#### 内置组件

##### DocLink 文档链接

```vue
<DocLink />
```

跳转到项目文档：https://elias-cug.github.io/le-guide/

##### ThemeSetting 主题设置

```vue
<ThemeSetting />
```

提供主题切换和模式切换功能。

##### UserDropdown 用户下拉菜单

```vue
<UserDropdown :user="userInfo" @logout="handleLogout" />
```

### GlobalSider 全局侧边栏

可折叠的侧边栏组件，支持多级菜单、路由集成。

#### 基础使用

```vue
<template>
  <GlobalSider v-model:collapsed="collapsed" :menu-options="menuOptions" :width="240" />
</template>

<script setup>
import { ref } from 'vue';
import { GlobalSider } from '@lee/base';

const collapsed = ref(false);

const menuOptions = [
  {
    label: '仪表盘',
    key: 'dashboard',
    icon: renderIcon(DashboardOutline),
    path: '/dashboard',
  },
  {
    label: '用户管理',
    key: 'user',
    icon: renderIcon(PersonOutline),
    children: [
      {
        label: '用户列表',
        key: 'user-list',
        path: '/user/list',
      },
      {
        label: '角色管理',
        key: 'role',
        path: '/user/role',
      },
    ],
  },
];
</script>
```

#### 组件属性

| 属性                | 类型                                 | 默认值  | 说明             |
| ------------------- | ------------------------------------ | ------- | ---------------- |
| collapsed           | `boolean`                            | `false` | 是否折叠         |
| width               | `number`                             | `240`   | 侧边栏宽度       |
| collapsedWidth      | `number`                             | `64`    | 折叠后宽度       |
| menuOptions         | `MenuOption[]`                       | `[]`    | 菜单配置         |
| defaultExpandedKeys | `string[]`                           | `[]`    | 默认展开的菜单键 |
| accordion           | `boolean`                            | `false` | 是否手风琴模式   |
| showTrigger         | `boolean \| 'bar' \| 'arrow-circle'` | `'bar'` | 折叠触发器类型   |

#### 菜单配置

```typescript
interface MenuOption {
  label: string; // 菜单标题
  key: string; // 唯一标识
  path?: string; // 路由路径
  icon?: () => VNode; // 图标渲染函数
  disabled?: boolean; // 是否禁用
  children?: MenuOption[]; // 子菜单
  show?: boolean; // 是否显示
  meta?: any; // 自定义元数据
}
```

#### 路由集成

侧边栏会自动高亮当前路由对应的菜单项：

```typescript
import { useRoute } from 'vue-router';

const route = useRoute();
const activeKey = computed(() => route.name as string);
```

### GlobalTabs 全局标签页

多标签页导航组件，支持标签页的新增、关闭、右键菜单等功能。

#### 基础使用

```vue
<template>
  <GlobalTabs
    v-model:value="activeTab"
    :tabs="tabs"
    @close="handleCloseTab"
    @context-menu="handleContextMenu"
  />
</template>

<script setup>
import { ref } from 'vue';
import { GlobalTabs } from '@lee/base';

const activeTab = ref('home');
const tabs = ref([
  { key: 'home', title: '首页', closable: false },
  { key: 'user', title: '用户管理', closable: true },
]);

const handleCloseTab = (key: string) => {
  tabs.value = tabs.value.filter(tab => tab.key !== key);
};

const handleContextMenu = (key: string, action: string) => {
  switch (action) {
    case 'close':
      handleCloseTab(key);
      break;
    case 'close-others':
      tabs.value = tabs.value.filter(tab => tab.key === key || !tab.closable);
      break;
    case 'close-all':
      tabs.value = tabs.value.filter(tab => !tab.closable);
      break;
  }
};
</script>
```

#### 组件属性

| 属性     | 类型               | 默认值   | 说明             |
| -------- | ------------------ | -------- | ---------------- |
| value    | `string`           | -        | 当前激活的标签页 |
| tabs     | `Tab[]`            | `[]`     | 标签页列表       |
| type     | `'line' \| 'card'` | `'card'` | 标签页类型       |
| animated | `boolean`          | `true`   | 是否开启动画     |
| addable  | `boolean`          | `false`  | 是否可新增标签   |
| closable | `boolean`          | `true`   | 标签是否可关闭   |

#### 标签页配置

```typescript
interface Tab {
  key: string; // 唯一标识
  title: string; // 标题
  closable?: boolean; // 是否可关闭
  icon?: Component; // 图标
  path?: string; // 路由路径
}
```

#### 右键菜单

内置右键菜单功能：

- 关闭当前
- 关闭其他
- 关闭左侧
- 关闭右侧
- 关闭所有
- 重新加载

## 布局模式

### 经典布局

头部 + 侧边栏 + 内容区：

```vue
<template>
  <div class="app-layout">
    <GlobalHeader class="app-header" />
    <div class="app-body">
      <GlobalSider class="app-sider" />
      <div class="app-main">
        <GlobalTabs class="app-tabs" />
        <LeContainer class="app-content">
          <router-view />
        </LeContainer>
      </div>
    </div>
  </div>
</template>

<style scoped>
.app-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  flex-shrink: 0;
}

.app-body {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.app-sider {
  flex-shrink: 0;
}

.app-main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.app-tabs {
  flex-shrink: 0;
}

.app-content {
  flex: 1;
}
</style>
```

### 顶部菜单布局

头部集成菜单，无侧边栏：

```vue
<template>
  <div class="app-layout">
    <GlobalHeader class="app-header">
      <n-menu mode="horizontal" :options="menuOptions" />
    </GlobalHeader>
    <LeContainer class="app-content">
      <router-view />
    </LeContainer>
  </div>
</template>
```

### 混合导航布局

顶部一级菜单 + 侧边栏二级菜单：

```vue
<template>
  <div class="app-layout">
    <GlobalHeader class="app-header">
      <n-menu mode="horizontal" :options="topMenuOptions" v-model:value="activeTopMenu" />
    </GlobalHeader>
    <div class="app-body">
      <GlobalSider class="app-sider" :menu-options="sideMenuOptions" />
      <LeContainer class="app-content">
        <router-view />
      </LeContainer>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const activeTopMenu = ref('product');

// 根据顶部菜单动态切换侧边栏菜单
const sideMenuOptions = computed(() => {
  return menuMap[activeTopMenu.value] || [];
});
</script>
```

## 响应式布局

### 移动端适配

```vue
<template>
  <div class="app-layout">
    <GlobalHeader :show-menu-trigger="isMobile" @menu-trigger-click="toggleSider" />

    <n-drawer v-if="isMobile" v-model:show="showSider" :width="240" placement="left">
      <GlobalSider :show-trigger="false" />
    </n-drawer>

    <GlobalSider v-else v-model:collapsed="collapsed" />

    <LeContainer>
      <router-view />
    </LeContainer>
  </div>
</template>

<script setup>
import { useMediaQuery } from '@vueuse/core';

const isMobile = useMediaQuery('(max-width: 768px)');
const showSider = ref(false);
const collapsed = ref(false);

const toggleSider = () => {
  if (isMobile.value) {
    showSider.value = !showSider.value;
  } else {
    collapsed.value = !collapsed.value;
  }
};
</script>
```

## 主题适配

所有布局组件都完全响应主题变化：

### CSS 变量

```scss
// Header
--le-header-height: 60px;
--le-header-bg: var(--le-neutral-header);
--le-header-border: var(--le-border);

// Sider
--le-sider-width: 240px;
--le-sider-collapsed-width: 64px;
--le-sider-bg: var(--le-neutral-sider);
--le-menu-item-active-bg: var(--le-primary-1);
--le-menu-text-color: rgba(255, 255, 255, 0.82);

// Tabs
--le-tabs-height: 40px;
--le-tabs-bg: var(--le-card);
--le-tab-active-bg: var(--le-primary-1);
--le-tab-active-color: var(--le-primary);
```

### 深色模式适配

```typescript
const isDark = computed(() => themeMode.value === 'dark');

// 组件会自动适配深色模式
<GlobalHeader :theme="isDark ? 'dark' : 'light'" />
```

## 状态持久化

布局状态自动持久化到 localStorage：

```typescript
// 自动保存和恢复的状态
-侧边栏折叠状态 - 打开的标签页 - 菜单展开状态 - 布局模式选择;

// 手动控制持久化
import { useLayoutStore } from '@lee/base';

const layoutStore = useLayoutStore();

// 保存状态
layoutStore.saveSiderCollapsed(true);
layoutStore.saveTabs(tabs);

// 恢复状态
const collapsed = layoutStore.siderCollapsed;
const tabs = layoutStore.tabs;
```

## 最佳实践

### 1. 路由与菜单同步

```typescript
// 从路由自动生成菜单
import { routes } from '@/router';

const generateMenus = routes => {
  return routes
    .filter(route => !route.meta?.hidden)
    .map(route => ({
      label: route.meta?.title || route.name,
      key: route.name,
      path: route.path,
      icon: route.meta?.icon,
      children: route.children ? generateMenus(route.children) : undefined,
    }));
};

const menuOptions = generateMenus(routes);
```

### 2. 权限控制

```typescript
// 根据权限过滤菜单
const filterMenusByPermission = (menus, permissions) => {
  return menus.filter(menu => {
    if (menu.meta?.permission) {
      return permissions.includes(menu.meta.permission);
    }
    if (menu.children) {
      menu.children = filterMenusByPermission(menu.children, permissions);
    }
    return true;
  });
};
```

### 3. 面包屑导航

```vue
<template>
  <n-breadcrumb>
    <n-breadcrumb-item v-for="item in breadcrumbs" :key="item.path" @click="handleClick(item)">
      {{ item.title }}
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script setup>
const route = useRoute();

const breadcrumbs = computed(() => {
  return route.matched.map(item => ({
    title: item.meta?.title || item.name,
    path: item.path,
  }));
});
</script>
```

## API 参考

完整的 API 文档正在建设中。

## 相关资源

- [主题系统](/theme/) - 了解主题配置
- [UI 组件](/ui/) - 更多 UI 组件
- [路由系统](/base/router) - 路由配置
