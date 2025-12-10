# 服务层使用文档

## 安装依赖

```bash
pnpm add axios
```

## 功能特性

✅ 统一的请求封装  
✅ 自动携带 Token  
✅ 请求/响应拦截  
✅ 区分 HTTP 错误和业务错误  
✅ 403/401 自动跳转登录  
✅ 统一错误提示  
✅ 支持文件上传  
✅ 支持文件下载  
✅ TypeScript 类型支持  
✅ **🆕 请求重试机制**  
✅ **🆕 请求缓存管理**  
✅ **🆕 请求取消控制**  
✅ **🆕 请求优先级队列**  
✅ **🆕 请求进度监控**  
✅ **🆕 并发控制**

## 基础用法

### 1. GET 请求

```typescript
import { get } from '@base/service';

// 简单请求
const data = await get<UserInfo>('/user/info');

// 带参数
const list = await get('/user/list', {
  params: { page: 1, pageSize: 10 },
});
```

### 2. POST 请求

```typescript
import { post } from '@base/service';

// 简单 POST
const result = await post('/user/create', {
  username: 'test',
  nickname: '测试用户',
});

// 显示成功提示
const result = await post('/user/update', data, {
  showSuccess: true, // 成功后显示提示
});
```

### 3. PUT 请求

```typescript
import { put } from '@base/service';

const result = await put(
  '/user/123',
  {
    nickname: '新昵称',
  },
  {
    showSuccess: true,
  }
);
```

### 4. DELETE 请求

```typescript
import { del } from '@base/service';

await del('/user/123', {
  showSuccess: true,
});
```

## 高级用法

### 1. 文件上传

```typescript
import { upload } from '@base/service';

// 上传单个文件
const file = document.querySelector('input[type="file"]').files[0];
const result = await upload<{ url: string }>('/upload', file, {
  showSuccess: true,
});

// 上传 FormData
const formData = new FormData();
formData.append('file', file);
formData.append('type', 'avatar');
const result = await upload('/upload', formData);
```

### 2. 文件下载

```typescript
import { download } from '@base/service';

// 下载文件（自动触发浏览器下载）
const { blob, filename, url } = await download('/export/users', {
  downloadConfig: {
    filename: '用户列表.xlsx', // 可选，指定文件名
    autoDownload: true, // 默认 true，自动下载
  },
});

// 手动控制下载
const { blob, url } = await download('/export/report', {
  downloadConfig: {
    autoDownload: false, // 不自动下载
  },
});
// 可以将 url 赋值给 img 或 a 标签
```

### 3. 配置选项

```typescript
import { get, post } from '@base/service';

// 不显示错误提示
await get('/api/check', {
  showError: false,
});

// 跳过 token（公开接口）
await post('/api/public', data, {
  skipToken: true,
});

// 返回原始响应（不解包 data）
const response = await get('/api/data', {
  returnRaw: true,
});
console.log(response); // { code: 200, data: {...}, message: '成功' }

// 自定义请求头
await post('/api/upload', data, {
  headers: {
    'Content-Type': 'multipart/form-data',
  },
});

// 请求超时设置
await get('/api/slow', {
  timeout: 60000, // 60 秒
});
```

### 4. 批量请求

```typescript
import { all, race } from '@base/service';

// 并发请求（等待所有完成）
const [user, menus, permissions] = await all([
  { method: 'GET', url: '/user/info' },
  { method: 'GET', url: '/user/menus' },
  { method: 'GET', url: '/user/permissions' },
]);

// 竞速请求（返回最快的）
const fastestData = await race([
  { method: 'GET', url: '/api/server1' },
  { method: 'GET', url: '/api/server2' },
  { method: 'GET', url: '/api/server3' },
]);
```

### 5. 🆕 请求重试

```typescript
import { get } from '@base/service';

// 自动重试 3 次，使用指数退避
const data = await get('/api/unstable', {
  retry: {
    count: 3, // 重试 3 次
    delay: 1000, // 初始延迟 1 秒
    condition: error => {
      // 自定义重试条件
      // 默认：网络错误、5xx 错误、429 限流、408 超时会重试
      return error.response?.status >= 500;
    },
  },
});
```

### 6. 🆕 请求缓存

```typescript
import { get, requestCache } from '@base/service';

// 启用缓存（仅适用于 GET 请求）
const data = await get('/api/config', {
  cache: {
    enable: true, // 启用缓存
    ttl: 5 * 60 * 1000, // 缓存 5 分钟
    key: 'config-data', // 自定义缓存键（可选）
  },
});

// 手动管理缓存
requestCache.clear(); // 清空所有缓存
requestCache.delete('key'); // 删除指定缓存
requestCache.clearExpired(); // 清理过期缓存
```

### 7. 🆕 请求取消

```typescript
import { get, createCancelController, cancelRequest, cancelAllRequests } from '@base/service';

// 方式1：使用 AbortController
const controller = createCancelController();

try {
  const data = await get('/api/slow', {
    abortController: controller,
  });
} catch (error) {
  if (error.code === 'ERR_CANCELED') {
    console.log('请求已取消');
  }
}

// 取消请求
controller.abort();

// 方式2：使用标签批量取消
get('/api/data1', { tag: 'page-data' });
get('/api/data2', { tag: 'page-data' });
get('/api/data3', { tag: 'page-data' });

// 取消所有带 'page-data' 标签的请求
cancelRequest('page-data');

// 取消所有请求
cancelAllRequests();
```

### 8. 🆕 请求优先级和并发控制

```typescript
import { get, post, getRequestStatus } from '@base/service';

// 设置请求优先级
get('/api/important', { priority: 'high' }); // 高优先级
get('/api/normal', { priority: 'normal' }); // 正常优先级
get('/api/background', { priority: 'low' }); // 低优先级

// 查看请求状态
const status = getRequestStatus();
console.log(status);
// {
//   pending: 3,        // 进行中的请求
//   queued: 5,         // 队列中的请求
//   concurrent: 6,     // 当前并发数
//   maxConcurrent: 6   // 最大并发数
// }

// 调整最大并发数
import { requestManager } from '@base/service';
requestManager.setMaxConcurrent(10);
```

### 9. 🆕 请求进度监控

```typescript
import { upload, download } from '@base/service';

// 上传进度
const result = await upload('/api/upload', file, {
  onProgress: event => {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(`上传进度: ${percent}%`);
  },
});

// 下载进度
const { blob } = await download('/api/download', {
  onProgress: event => {
    const percent = Math.round((event.loaded / event.total) * 100);
    console.log(`下载进度: ${percent}%`);
  },
});
```

### 10. 🆕 请求生命周期回调

```typescript
import { get } from '@base/service';

const data = await get('/api/data', {
  onStart: () => {
    console.log('请求开始');
    // 可以显示 loading
  },
  onFinish: () => {
    console.log('请求结束');
    // 可以隐藏 loading
  },
  onProgress: event => {
    // 进度更新
  },
});
```

### 11. 🆕 安全模式（默认开启，不抛出异常）

安全模式现在**默认开启**，请求永远返回 `resolve`，通过数据结构区分成功和失败。如需使用传统模式（失败时抛出异常），可设置 `safe: false`：

```typescript
import { get, post } from '@base/service';

// 默认使用安全模式（无需指定 safe）
const result = await get('/api/user');

// result 的类型是 SafeResponse<T>
// 成功: { data: T, error: null }
// 失败: { data: null, error: { message: string, code?: string | number, details?: any } }

if (result.error) {
  console.error('请求失败:', result.error.message);
} else {
  console.log('请求成功:', result.data);
}

// POST 请求（默认安全模式）
const createResult = await post('/api/user', { name: 'test' });

if (createResult.error) {
  // 错误处理
  alert(`错误 ${createResult.error.code}: ${createResult.error.message}`);
} else {
  // 成功处理
  console.log('创建成功:', createResult.data);
}

// 使用传统模式（失败时抛出异常）
try {
  const data = await get('/api/user', { safe: false });
  console.log('成功:', data);
} catch (error) {
  console.error('失败:', error.message);
}

// 在 Vue 组件中使用
const loading = ref(false);
const userData = ref(null);
const error = ref(null);

async function fetchUser(id: string) {
  loading.value = true;
  error.value = null;

  const result = await get(`/api/user/${id}`); // 默认安全模式

  loading.value = false;

  if (result.error) {
    error.value = result.error.message;
  } else {
    userData.value = result.data;
  }
}

// 批量请求（使用 Promise.all）
const [userResult, configResult] = await Promise.all([
  get('/api/user'), // 默认安全模式
  get('/api/config'), // 默认安全模式
]);

// 处理结果
const user = userResult.error ? null : userResult.data;
const config = configResult.error ? {} : configResult.data;
```

#### 安全响应数据结构

```typescript
interface SafeResponse<T> {
  data: T | null; // 成功时为数据，失败时为 null
  error: {
    // 成功时为 null，失败时为错误信息
    message: string;
    code?: string | number;
    details?: any;
  } | null;
}
```

## API 文件组织

推荐在 `api/` 目录下按模块组织接口：

```
api/
├── user.ts      # 用户相关接口
├── auth.ts      # 认证相关接口
├── menu.ts      # 菜单相关接口
└── common.ts    # 通用接口
```

示例（`api/user.ts`）：

```typescript
import { get, post, put, del } from '@base/service';
import type { Response } from '@base/service';

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
}

export function getUserInfo(): Response<UserInfo> {
  return get<UserInfo>('/user/info');
}

export function updateUser(id: string, data: Partial<UserInfo>): Response<UserInfo> {
  return put<UserInfo>(\`/user/\${id}\`, data, {
    showSuccess: true
  });
}
```

## 错误处理

### 业务错误

业务错误会自动显示后端返回的错误消息，也可以手动处理：

```typescript
try {
  await post('/user/create', data);
} catch (error) {
  console.error('创建失败:', error.message);
}
```

### HTTP 错误

HTTP 错误（如 404、500）会自动显示友好的错误提示。

### 权限错误

- `401` 或 `403` HTTP 状态码
- `code: 403` 或 `code: 401` 业务错误码
- Token 过期错误码 `10007` 或 `10008`

以上情况会自动：

1. 清除本地 Token
2. 跳转到登录页
3. 保留当前路径到 redirect 参数

## 错误码管理

错误码定义在 `service/errorCode.ts` 中：

```typescript
export const ERROR_CODE_MAP: Record<number, string> = {
  200: '操作成功',
  400: '请求参数错误',
  403: '权限不足',
  404: '请求的资源不存在',
  // ... 业务错误码
  10001: '用户名或密码错误',
  10002: '用户不存在',
  // ...
};
```

### 添加新的错误码

```typescript
// errorCode.ts
export const ERROR_CODE_MAP: Record<number, string> = {
  // ... 现有错误码
  40001: '自定义错误描述',
};
```

## 环境变量

在项目根目录创建环境变量文件：

```env
# .env.development
VITE_API_BASE_URL=http://localhost:3000/api

# .env.production
VITE_API_BASE_URL=https://api.example.com
```

## TypeScript 类型

```typescript
import type {
  ApiResponse, // 响应数据结构
  RequestConfig, // 请求配置
  Response, // 响应 Promise 类型
  DownloadConfig, // 下载配置
  RetryConfig, // 重试配置
  AxiosProgressEvent, // 进度事件类型
} from '@base/service';

// 使用示例
function getList(params: any): Response<{ list: any[]; total: number }> {
  return get('/list', { params });
}
```

## 注意事项

1. **Token 管理**：Token 自动从 localStorage 读取（key: `token`），并添加到请求头 `Authorization: Bearer {token}`

2. **错误提示**：默认显示错误提示，可通过 `showError: false` 关闭

3. **成功提示**：默认不显示成功提示，可通过 `showSuccess: true` 开启

4. **响应数据**：默认自动解包返回 `data` 字段，可通过 `returnRaw: true` 返回完整响应

5. **文件下载**：设置 `isDownload: true` 会自动将 `responseType` 设为 `blob`

6. **超时时间**：默认 30 秒，可在 `constants/index.ts` 中修改或单独为请求设置

7. **缓存机制**：仅适用于 GET 请求，缓存会定期自动清理过期数据

8. **重试机制**：使用指数退避策略，避免重试风暴

9. **并发控制**：默认最大并发数 6，超过后会进入队列

10. **请求取消**：取消的请求会抛出 `ERR_CANCELED` 错误

## 完整示例

```typescript
// api/user.ts
import { get, post, upload, download } from '@base/service';
import type { Response } from '@base/service';

export interface UserInfo {
  id: string;
  username: string;
  nickname: string;
  avatar?: string;
}

// 获取用户信息
export function getUserInfo(): Response<UserInfo> {
  return get<UserInfo>('/user/info');
}

// 更新用户
export function updateUser(data: Partial<UserInfo>): Response<UserInfo> {
  return post('/user/update', data, { showSuccess: true });
}

// 上传头像
export function uploadAvatar(file: File): Response<{ url: string }> {
  return upload('/user/avatar', file, { showSuccess: true });
}

// 导出数据
export function exportData(): Promise<{ blob: Blob; filename: string; url: string }> {
  return download('/user/export', {
    downloadConfig: { filename: '用户数据.xlsx' },
  });
}
```

```vue
<!-- 组件中使用 -->
<script setup lang="ts">
import { ref } from 'vue';
import { getUserInfo, updateUser, uploadAvatar, exportData } from '@base/api/user';

const userInfo = ref<UserInfo>();

// 获取用户信息
async function fetchUserInfo() {
  userInfo.value = await getUserInfo();
}

// 更新用户
async function handleUpdate() {
  await updateUser({ nickname: '新昵称' });
  await fetchUserInfo(); // 刷新数据
}

// 上传头像
async function handleUpload(file: File) {
  const { url } = await uploadAvatar(file);
  userInfo.value!.avatar = url;
}

// 导出数据
async function handleExport() {
  await exportData(); // 会自动下载文件
}
</script>
```
