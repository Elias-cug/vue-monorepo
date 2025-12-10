# Service 模块

Base 包的 Service 模块提供了一套完整的 HTTP 请求解决方案，包含请求封装、错误处理、重试机制、缓存管理等企业级功能。

## 基础使用

### 简单请求

```typescript
import { get, post, put, del } from '@lee/base/service';

// GET 请求
const user = await get('/api/user/1');

// POST 请求
const result = await post('/api/users', {
  name: 'John',
  email: 'john@example.com',
});

// PUT 请求
await put('/api/user/1', { name: 'Jane' });

// DELETE 请求
await del('/api/user/1');
```

### 带配置的请求

```typescript
import { request } from '@lee/base/service';

const data = await request({
  url: '/api/data',
  method: 'GET',
  params: { page: 1, size: 10 },
  headers: {
    'X-Custom-Header': 'value',
  },
  timeout: 5000,
});
```

## 安全模式

安全模式让你无需 try-catch 即可处理错误：

```typescript
import { get, type SafeResponse } from '@lee/base/service';

// 使用安全模式
const result: SafeResponse<User> = await get('/api/user', { safe: true });

if (result.error) {
  // 处理错误
  console.error('请求失败:', result.error.message);
  return;
}

// 使用数据
console.log('用户信息:', result.data);
```

### 批量安全请求

```typescript
// 并行请求，都使用安全模式
const [userResult, configResult] = await Promise.all([
  get('/api/user', { safe: true }),
  get('/api/config', { safe: true }),
]);

// 分别处理结果
if (!userResult.error) {
  setUser(userResult.data);
}
if (!configResult.error) {
  setConfig(configResult.data);
}
```

## 请求重试

自动重试失败的请求：

```typescript
import { enhancedGet } from '@lee/base/service';

// 配置重试
const data = await enhancedGet('/api/data', {
  retry: {
    enabled: true,
    maxAttempts: 3, // 最多重试 3 次
    delay: 1000, // 初始延迟 1 秒
    maxDelay: 10000, // 最大延迟 10 秒
    backoffMultiplier: 2, // 指数退避倍数
    retryCondition: error => {
      // 自定义重试条件
      return error.code === 'NETWORK_ERROR';
    },
  },
});
```

### 默认重试规则

默认情况下，以下情况会触发重试：

- 网络错误
- 5xx 服务器错误
- 429 Too Many Requests
- 408 Request Timeout

## 请求缓存

缓存 GET 请求结果，减少不必要的网络请求：

```typescript
import { enhancedGet, cacheManager } from '@lee/base/service';

// 使用缓存
const data = await enhancedGet('/api/config', {
  cache: {
    enabled: true,
    ttl: 60000, // 缓存 60 秒
    key: 'app-config', // 自定义缓存键
  },
});

// 手动管理缓存
cacheManager.set('custom-key', data, 30000);
const cached = cacheManager.get('custom-key');
cacheManager.delete('custom-key');
cacheManager.clear(); // 清空所有缓存
```

## 请求优先级

控制请求的执行优先级：

```typescript
import { enhancedPost } from '@lee/base/service';

// 高优先级请求
await enhancedPost('/api/critical', data, {
  priority: 'high', // high | normal | low
});

// 普通优先级（默认）
await enhancedPost('/api/normal', data);

// 低优先级请求
await enhancedPost('/api/background', data, {
  priority: 'low',
});
```

## 请求管理

### 取消请求

```typescript
import { requestManager, enhancedGet } from '@lee/base/service';

// 方式1：使用 AbortController
const controller = new AbortController();
const promise = enhancedGet('/api/data', {
  abortController: controller,
});

// 取消请求
controller.abort();

// 方式2：使用标签批量管理
await enhancedGet('/api/user', { tag: 'user-data' });
await enhancedGet('/api/profile', { tag: 'user-data' });

// 取消所有带 'user-data' 标签的请求
requestManager.cancelByTag('user-data');
```

### 并发控制

```typescript
import { requestManager } from '@lee/base/service';

// 设置最大并发数
requestManager.setMaxConcurrent(3);

// 请求会自动排队，最多同时执行 3 个
const promises = urls.map(url => enhancedGet(url));
const results = await Promise.all(promises);
```

## 批量请求

### 并发请求

```typescript
import { all } from '@lee/base/service';

// 并发执行多个请求
const [users, posts, comments] = await all([
  { url: '/api/users', method: 'GET' },
  { url: '/api/posts', method: 'GET' },
  { url: '/api/comments', method: 'GET' },
]);
```

### 竞速请求

```typescript
import { race } from '@lee/base/service';

// 使用最快返回的结果
const data = await race([
  { url: '/api/server1/data', method: 'GET' },
  { url: '/api/server2/data', method: 'GET' },
  { url: '/api/server3/data', method: 'GET' },
]);
```

## 生命周期回调

监听请求的不同阶段：

```typescript
import { enhancedGet } from '@lee/base/service';

await enhancedGet('/api/data', {
  onStart: () => {
    console.log('请求开始');
    showLoading();
  },
  onFinish: response => {
    console.log('请求完成', response);
    hideLoading();
  },
  onProgress: event => {
    // 上传/下载进度
    console.log(`进度: ${event.loaded}/${event.total}`);
  },
});
```

## 全局配置

### 设置基础 URL

```typescript
import { setGlobalConfig } from '@lee/base/service';

setGlobalConfig({
  baseURL: 'https://api.example.com',
  timeout: 10000,
  headers: {
    'X-App-Version': '1.0.0',
  },
});
```

### 请求拦截器

```typescript
import { requestInterceptor } from '@lee/base/service';

// 添加请求拦截器
requestInterceptor.use(
  config => {
    // 添加 token
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);
```

### 响应拦截器

```typescript
import { responseInterceptor } from '@lee/base/service';

// 添加响应拦截器
responseInterceptor.use(
  response => {
    // 统一处理响应
    if (response.data.code === 0) {
      return response.data.data;
    }
    return Promise.reject(new Error(response.data.message));
  },
  error => {
    // 统一错误处理
    if (error.response?.status === 401) {
      // 跳转登录
      router.push('/login');
    }
    return Promise.reject(error);
  }
);
```

## 错误处理

### 错误码映射

```typescript
import { errorCodeMap } from '@lee/base/service';

// 自定义错误码映射
errorCodeMap.set('NETWORK_ERROR', '网络连接失败，请检查网络设置');
errorCodeMap.set('AUTH_FAILED', '认证失败，请重新登录');
errorCodeMap.set('PERMISSION_DENIED', '没有权限访问该资源');
```

### 错误类型

```typescript
interface ServiceError {
  message: string; // 错误消息
  code: string; // 错误码
  details?: any; // 详细信息
  statusCode?: number; // HTTP 状态码
  url?: string; // 请求 URL
  method?: string; // 请求方法
}
```

## TypeScript 支持

### 类型定义

```typescript
import { get, post } from '@lee/base/service';

interface User {
  id: number;
  name: string;
  email: string;
}

// 自动类型推断
const user = await get<User>('/api/user/1');
// user 的类型为 User

// 带参数的请求
interface CreateUserDto {
  name: string;
  email: string;
}

const newUser = await post<User, CreateUserDto>('/api/users', {
  name: 'John',
  email: 'john@example.com',
});
```

## 最佳实践

### 1. 使用安全模式处理错误

```typescript
// ✅ 推荐：使用安全模式
const result = await get('/api/data', { safe: true });
if (result.error) {
  handleError(result.error);
} else {
  processData(result.data);
}

// ❌ 不推荐：try-catch 嵌套
try {
  const data = await get('/api/data');
  processData(data);
} catch (error) {
  handleError(error);
}
```

### 2. 合理使用缓存

```typescript
// 配置数据适合缓存
const config = await enhancedGet('/api/config', {
  cache: { enabled: true, ttl: 300000 }, // 5 分钟
});

// 实时数据不要缓存
const liveData = await get('/api/live-data'); // 不使用缓存
```

### 3. 设置合理的超时

```typescript
// 普通 API 请求
const data = await get('/api/data', { timeout: 5000 });

// 文件上传需要更长超时
const result = await post('/api/upload', formData, {
  timeout: 60000, // 60 秒
});
```

### 4. 使用请求标签管理相关请求

```typescript
// 页面组件
onMounted(() => {
  // 所有请求使用相同标签
  loadUserData({ tag: 'user-page' });
  loadUserPosts({ tag: 'user-page' });
});

onUnmounted(() => {
  // 离开页面时取消所有未完成请求
  requestManager.cancelByTag('user-page');
});
```

## API 参考

完整的 API 文档请参考 [Service API 参考](/api/base#service)。
