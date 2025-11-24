# useRouterHelper 使用文档

路由辅助 composable，提供常用的路由操作方法。

## 导入

```typescript
import { useRouterHelper } from '@lee/base';
```

## API

### 1. logout - 退出登录

退出登录，清除所有状态并跳转到登录页。

**参数：**
- `redirect?: boolean` - 是否保留当前路由作为重定向参数，默认 `true`

**功能：**
- ✅ 清除 token
- ✅ 清除持久化状态（tabs、activeTab、collapsed）
- ✅ 清除缓存路由
- ✅ 跳转到登录页

**示例：**

```vue
<template>
  <n-button @click="handleLogout">退出登录</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { logout } = useRouterHelper();

// 退出并保留重定向
function handleLogout() {
  logout(); // 跳转到 /login?redirect=/current/path
}

// 退出不保留重定向
function handleLogoutNoRedirect() {
  logout(false); // 直接跳转到 /login
}
</script>
```

---

### 2. clearCurrentTabAndGo - 清除当前 tab 并跳转

关闭当前 tab 并跳转到指定路由。

**参数：**
- `to: RouteLocationRaw` - 要跳转的路由（支持字符串路径、路由对象）
- `replace?: boolean` - 是否使用 replace 模式，默认 `false`

**示例：**

```vue
<template>
  <n-button @click="goToHome">关闭当前页并返回首页</n-button>
  <n-button @click="goToDetail">关闭并跳转详情</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearCurrentTabAndGo } = useRouterHelper();

// 字符串路径
function goToHome() {
  clearCurrentTabAndGo('/home');
}

// 路径对象 + 查询参数
function goToDetail() {
  clearCurrentTabAndGo({ 
    path: '/detail/123',
    query: { tab: 'info' }
  });
}

// 命名路由 + params
function goToUser() {
  clearCurrentTabAndGo({ 
    name: 'UserDetail',
    params: { id: '123' }
  });
}

// 使用 replace 模式
function goToHomeReplace() {
  clearCurrentTabAndGo('/home', true);
}
</script>
```

---

### 3. clearCacheAndGo - 清除指定缓存并跳转

清除指定路由的 keepalive 缓存并跳转，用于强制刷新页面。

**参数：**
- `to: RouteLocationRaw` - 要跳转的路由（支持字符串路径、路由对象）
- `componentName?: string` - 要清除缓存的组件名称，默认使用路由的 name
- `replace?: boolean` - 是否使用 replace 模式，默认 `false`

**示例：**

```vue
<template>
  <n-button @click="reloadDetail">重新加载详情</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo, route } = useRouterHelper();

// 字符串路径
function reloadDetail() {
  clearCacheAndGo('/detail/123');
}

// 带查询参数
function reloadDetailWithQuery() {
  clearCacheAndGo({ 
    path: '/detail/123',
    query: { refresh: Date.now() }
  });
}

// 命名路由 + params
function reloadUserProfile() {
  clearCacheAndGo({ 
    name: 'UserProfile',
    params: { userId: '456' }
  });
}

// 刷新当前页（带所有参数）
function reloadCurrentPage() {
  clearCacheAndGo(route.fullPath);
}

// 指定组件名称清除缓存
function reloadDetailWithName() {
  clearCacheAndGo('/detail/123', 'DetailPage');
}
</script>
```

---

### 4. clearAllCacheAndGo - 清除所有缓存并跳转

清除所有 keepalive 缓存并跳转。

**参数：**
- `to: RouteLocationRaw` - 要跳转的路由（支持字符串路径、路由对象）
- `replace?: boolean` - 是否使用 replace 模式，默认 `false`

**示例：**

```vue
<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearAllCacheAndGo } = useRouterHelper();

// 字符串路径
function resetAndGoHome() {
  clearAllCacheAndGo('/home');
}

// 带查询参数
function resetAndGoHomeWithQuery() {
  clearAllCacheAndGo({ 
    path: '/home',
    query: { reset: 'true' }
  });
}

// 命名路由
function resetAndGoToDashboard() {
  clearAllCacheAndGo({ name: 'Dashboard' });
}
</script>
```

---

### 5. refreshCurrentPage - 刷新当前页面

刷新当前页面（通过清除缓存实现）。

**示例：**

```vue
<template>
  <n-button @click="refresh">刷新页面</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { refreshCurrentPage } = useRouterHelper();

function refresh() {
  refreshCurrentPage();
}
</script>
```

---

### 6. closeCurrentTab - 关闭当前 tab

关闭当前 tab 并自动跳转到前一个或后一个 tab。

**示例：**

```vue
<template>
  <n-button @click="close">关闭当前页</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { closeCurrentTab } = useRouterHelper();

function close() {
  closeCurrentTab();
}
</script>
```

---

### 7. closeOtherTabs - 关闭其他 tabs

关闭除当前 tab 外的所有 tabs（保留不可关闭的 tabs）。

**示例：**

```vue
<template>
  <n-button @click="closeOthers">关闭其他页面</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { closeOtherTabs } = useRouterHelper();

function closeOthers() {
  closeOtherTabs();
}
</script>
```

---

### 8. closeAllTabs - 关闭所有 tabs

关闭所有 tabs（保留不可关闭的 tabs），可选择性跳转到指定路由。

**参数：**
- `to?: RouteLocationRaw` - 关闭后跳转的路由（支持字符串路径、路由对象），默认不跳转

**示例：**

```vue
<template>
  <n-button @click="closeAll">关闭所有页面</n-button>
  <n-button @click="closeAllAndGoHome">关闭所有并返回首页</n-button>
  <n-button @click="closeAllAndGoDetail">关闭所有并跳转详情</n-button>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { closeAllTabs } = useRouterHelper();

function closeAll() {
  // 只关闭，不跳转
  closeAllTabs();
}

// 字符串路径
function closeAllAndGoHome() {
  closeAllTabs('/home');
}

// 带查询参数
function closeAllAndGoDetail() {
  closeAllTabs({ 
    path: '/detail/123',
    query: { from: 'reset' }
  });
}

// 命名路由
function closeAllAndGoDashboard() {
  closeAllTabs({ name: 'Dashboard' });
}
</script>
```

---

### 9. router & route - 原始对象

还可以直接访问原始的 router 和 route 对象。

**示例：**

```vue
<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { router, route } = useRouterHelper();

// 使用原始 router
router.push('/home');

// 访问当前路由信息
console.log(route.path);
console.log(route.params);
</script>
```

---

## 完整使用示例

```vue
<template>
  <div class="page-header">
    <n-space>
      <n-button @click="handleRefresh">刷新</n-button>
      <n-button @click="handleCloseCurrentTab">关闭</n-button>
      <n-button @click="handleCloseOtherTabs">关闭其他</n-button>
      <n-button @click="handleCloseAllTabs">关闭所有</n-button>
      <n-button type="error" @click="handleLogout">退出登录</n-button>
    </n-space>
  </div>

  <div class="page-content">
    <!-- 页面内容 -->
  </div>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';
import { useDialog } from 'naive-ui';

const { 
  logout, 
  refreshCurrentPage, 
  closeCurrentTab, 
  closeOtherTabs, 
  closeAllTabs,
  clearCacheAndGo 
} = useRouterHelper();

const dialog = useDialog();

// 刷新页面
function handleRefresh() {
  refreshCurrentPage();
}

// 关闭当前页
function handleCloseCurrentTab() {
  closeCurrentTab();
}

// 关闭其他页
function handleCloseOtherTabs() {
  dialog.warning({
    title: '提示',
    content: '确定要关闭其他页面吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeOtherTabs();
    }
  });
}

// 关闭所有页
function handleCloseAllTabs() {
  dialog.warning({
    title: '提示',
    content: '确定要关闭所有页面吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      closeAllTabs('/home');
    }
  });
}

// 退出登录
function handleLogout() {
  dialog.warning({
    title: '确认退出',
    content: '确定要退出登录吗？',
    positiveText: '确定',
    negativeText: '取消',
    onPositiveClick: () => {
      logout();
    }
  });
}

// 保存后重新加载
async function handleSave() {
  // 保存逻辑
  await saveData();
  
  // 清除缓存并重新加载当前页
  clearCacheAndGo(route.fullPath);
}
</script>
```

---

## 在右键菜单中使用

```vue
<template>
  <n-dropdown :options="contextMenuOptions" @select="handleContextMenu">
    <div>右键我</div>
  </n-dropdown>
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { 
  refreshCurrentPage, 
  closeCurrentTab, 
  closeOtherTabs, 
  closeAllTabs 
} = useRouterHelper();

const contextMenuOptions = [
  { label: '刷新', key: 'refresh' },
  { label: '关闭', key: 'close' },
  { label: '关闭其他', key: 'closeOther' },
  { label: '关闭所有', key: 'closeAll' },
];

function handleContextMenu(key: string) {
  switch (key) {
    case 'refresh':
      refreshCurrentPage();
      break;
    case 'close':
      closeCurrentTab();
      break;
    case 'closeOther':
      closeOtherTabs();
      break;
    case 'closeAll':
      closeAllTabs();
      break;
  }
}
</script>
```

---

## 最佳实践

### 1. 表单提交后刷新

```typescript
async function handleSubmit() {
  await submitForm();
  // 清除缓存重新加载，确保数据最新
  clearCacheAndGo(route.fullPath);
}
```

### 2. 保存并关闭

```typescript
async function handleSaveAndClose() {
  await saveData();
  // 保存成功后关闭当前页，返回列表
  clearCurrentTabAndGo('/list');
}
```

### 3. 登录超时处理

```typescript
// 在 axios 响应拦截器中
if (response.code === 401) {
  const { logout } = useRouterHelper();
  logout(); // 自动跳转登录页
}
```

### 4. 权限不足跳转

```typescript
if (!hasPermission) {
  const { clearCurrentTabAndGo } = useRouterHelper();
  clearCurrentTabAndGo('/403');
}
```

---

## 注意事项

1. **logout** 会清除所有持久化状态，包括 tabs、collapsed 等
2. **closeCurrentTab** 会自动跳转到邻近的 tab
3. **不可关闭的 tab**（`closable: false`）在关闭操作中会被保留
4. **刷新页面** 通过清除 keepalive 缓存实现，不是浏览器刷新
5. **clearCacheAndGo** 适合在数据更新后强制重新加载页面

