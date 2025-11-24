# useRouterHelper 传参方式完整示例

所有跳转方法都支持和 `router.push` 一致的传参方式。

## 支持的传参方式

### 1. 字符串路径

```typescript
const { clearCacheAndGo, clearCurrentTabAndGo } = useRouterHelper();

// 简单路径
clearCacheAndGo('/home');

// 带路径参数
clearCacheAndGo('/user/123');

// 带查询字符串
clearCurrentTabAndGo('/list?page=1&size=10');
```

---

### 2. 路径对象 + query

```typescript
const { clearCacheAndGo } = useRouterHelper();

// 基础用法
clearCacheAndGo({
  path: '/user/list',
  query: {
    page: 1,
    pageSize: 10,
    keyword: 'test'
  }
});

// 复杂查询参数
clearCacheAndGo({
  path: '/search',
  query: {
    category: 'electronics',
    priceMin: 100,
    priceMax: 1000,
    sort: 'price-asc',
    tags: ['new', 'featured'] // 数组参数
  }
});
```

---

### 3. 命名路由 + params

```typescript
const { clearCacheAndGo, clearCurrentTabAndGo } = useRouterHelper();

// 基础用法
clearCacheAndGo({
  name: 'UserDetail',
  params: {
    id: '123'
  }
});

// 带查询参数
clearCurrentTabAndGo({
  name: 'ProductDetail',
  params: {
    id: '456'
  },
  query: {
    tab: 'reviews',
    page: 1
  }
});

// 多个 params
clearCacheAndGo({
  name: 'OrderDetail',
  params: {
    orderId: 'ORD123',
    userId: 'USER456'
  }
});
```

---

### 4. 带 hash

```typescript
const { clearCacheAndGo } = useRouterHelper();

// 字符串形式
clearCacheAndGo('/article/123#comments');

// 对象形式
clearCacheAndGo({
  path: '/article/123',
  hash: '#comments'
});

// 命名路由 + hash
clearCacheAndGo({
  name: 'Article',
  params: { id: '123' },
  hash: '#section-2'
});
```

---

## 实战示例

### 示例 1：列表页跳转详情

```vue
<template>
  <n-data-table :data="list" :columns="columns" />
</template>

<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo } = useRouterHelper();

const columns = [
  // ... 其他列
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return h(NButton, {
        onClick: () => goToDetail(row)
      }, '查看详情');
    }
  }
];

function goToDetail(row: any) {
  // 方式1：字符串路径
  clearCacheAndGo(`/user/detail/${row.id}`);
  
  // 方式2：命名路由（推荐）
  clearCacheAndGo({
    name: 'UserDetail',
    params: { id: row.id },
    query: { from: 'list' } // 记录来源
  });
}
</script>
```

---

### 示例 2：表单保存后跳转

```vue
<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearCurrentTabAndGo, route } = useRouterHelper();

async function handleSave() {
  const result = await saveData();
  
  // 保存成功，关闭当前页，跳转到详情
  clearCurrentTabAndGo({
    name: 'UserDetail',
    params: { id: result.id },
    query: { 
      action: 'created',
      timestamp: Date.now()
    }
  });
}
</script>
```

---

### 示例 3：搜索功能

```vue
<template>
  <n-form inline>
    <n-form-item label="关键词">
      <n-input v-model:value="keyword" />
    </n-form-item>
    <n-form-item label="分类">
      <n-select v-model:value="category" :options="categories" />
    </n-form-item>
    <n-form-item>
      <n-button type="primary" @click="handleSearch">搜索</n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo } = useRouterHelper();

const keyword = ref('');
const category = ref('');

function handleSearch() {
  // 清除缓存，重新加载搜索结果
  clearCacheAndGo({
    path: '/search',
    query: {
      keyword: keyword.value,
      category: category.value,
      page: 1,
      timestamp: Date.now() // 强制刷新
    }
  });
}
</script>
```

---

### 示例 4：Tab 切换带参数

```vue
<template>
  <n-tabs v-model:value="activeTab" @update:value="handleTabChange">
    <n-tab-pane name="info" tab="基本信息" />
    <n-tab-pane name="orders" tab="订单列表" />
    <n-tab-pane name="records" tab="操作记录" />
  </n-tabs>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo, route } = useRouterHelper();

const activeTab = ref('info');

function handleTabChange(tab: string) {
  // 切换 tab 时更新 URL 参数，并清除缓存重新加载
  clearCacheAndGo({
    path: route.path,
    query: {
      ...route.query,
      tab: tab
    }
  });
}
</script>
```

---

### 示例 5：分页切换

```vue
<template>
  <n-pagination
    v-model:page="page"
    :page-count="totalPages"
    @update:page="handlePageChange"
  />
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo, route } = useRouterHelper();

const page = ref(1);
const totalPages = ref(10);

function handlePageChange(newPage: number) {
  // 切换页码，清除缓存重新加载
  clearCacheAndGo({
    path: route.path,
    query: {
      ...route.query,
      page: newPage
    }
  });
}
</script>
```

---

### 示例 6：复杂筛选条件

```vue
<script setup lang="ts">
import { reactive } from 'vue';
import { useRouterHelper } from '@lee/base';

const { clearCacheAndGo } = useRouterHelper();

const filters = reactive({
  keyword: '',
  status: [],
  dateRange: [],
  priceRange: [0, 1000],
  sortBy: 'createTime',
  sortOrder: 'desc'
});

function handleFilter() {
  // 构建查询参数
  const query: Record<string, any> = {
    page: 1 // 重置页码
  };

  if (filters.keyword) {
    query.keyword = filters.keyword;
  }

  if (filters.status.length > 0) {
    query.status = filters.status.join(',');
  }

  if (filters.dateRange.length === 2) {
    query.startDate = filters.dateRange[0];
    query.endDate = filters.dateRange[1];
  }

  if (filters.priceRange[0] > 0 || filters.priceRange[1] < 1000) {
    query.priceMin = filters.priceRange[0];
    query.priceMax = filters.priceRange[1];
  }

  query.sortBy = filters.sortBy;
  query.sortOrder = filters.sortOrder;

  // 清除缓存并应用筛选
  clearCacheAndGo({
    path: '/product/list',
    query
  });
}
</script>
```

---

### 示例 7：带状态的跳转

```vue
<script setup lang="ts">
import { useRouterHelper } from '@lee/base';

const { clearCurrentTabAndGo } = useRouterHelper();

function editUser(userId: string) {
  // 跳转到编辑页，传递状态
  clearCurrentTabAndGo({
    name: 'UserEdit',
    params: { id: userId },
    query: {
      mode: 'edit',
      returnUrl: route.fullPath // 记录返回地址
    }
  });
}

function createUser() {
  // 跳转到创建页
  clearCurrentTabAndGo({
    name: 'UserEdit',
    query: {
      mode: 'create',
      returnUrl: route.fullPath
    }
  });
}
</script>
```

---

## 类型定义

所有方法使用 `RouteLocationRaw` 类型，这是 Vue Router 的标准类型：

```typescript
type RouteLocationRaw = 
  | string 
  | RouteLocationPathRaw 
  | RouteLocationNamedRaw;

interface RouteLocationPathRaw {
  path: string;
  query?: Record<string, any>;
  hash?: string;
}

interface RouteLocationNamedRaw {
  name: string;
  params?: Record<string, any>;
  query?: Record<string, any>;
  hash?: string;
}
```

---

## 注意事项

1. **params vs query**
   - `params`：用于命名路由，参数在路径中（如 `/user/123`）
   - `query`：查询参数，参数在 URL 后（如 `/user?id=123`）

2. **命名路由的优势**
   - 不需要硬编码路径
   - 更改路径时不需要修改代码
   - TypeScript 类型检查更好

3. **参数类型**
   - query 参数会被转为字符串
   - 需要传递对象或数组时，需要序列化

4. **清除缓存**
   - `clearCacheAndGo` 会自动在跳转后恢复 keepAlive
   - 适合表单提交后刷新页面的场景

