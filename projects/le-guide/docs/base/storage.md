# 持久化存储

Vue Monorepo 提供了一套完善的本地存储解决方案，对 localStorage 和 sessionStorage 进行了统一封装，支持数据加密、过期时间、命名空间等高级功能。

## 核心特性

- 🔐 **数据加密** - 支持 AES 加密存储敏感数据
- ⏰ **过期控制** - 自动清理过期数据
- 🏷️ **命名空间** - 避免键名冲突
- 📦 **自动序列化** - 自动处理对象和数组
- 🎯 **类型安全** - 完整的 TypeScript 支持
- 🔄 **响应式** - 可选的响应式存储
- 💾 **容量管理** - 存储容量监控和管理

## 基础使用

### 简单存储

```typescript
import { storage } from '@lee/base';

// 存储数据
storage.set('username', '张三');
storage.set('userInfo', { id: 1, name: '张三', age: 25 });
storage.set('tags', ['vue', 'react', 'angular']);

// 读取数据
const username = storage.get('username'); // '张三'
const userInfo = storage.get('userInfo'); // { id: 1, name: '张三', age: 25 }
const tags = storage.get('tags'); // ['vue', 'react', 'angular']

// 删除数据
storage.remove('username');

// 清空所有数据
storage.clear();
```

### 设置过期时间

```typescript
import { storage } from '@lee/base';

// 设置 1 小时后过期
storage.set('token', 'jwt-token-string', { expire: 60 * 60 * 1000 });

// 设置具体过期时间
storage.set('cache', data, {
  expire: new Date('2024-12-31 23:59:59').getTime(),
});

// 读取时自动检查过期
const token = storage.get('token'); // 过期返回 null
```

### Session Storage

```typescript
import { sessionStorage } from '@lee/base';

// 与 localStorage API 相同，但数据在会话结束后清除
sessionStorage.set('tempData', { temp: true });
const tempData = sessionStorage.get('tempData');
```

## 高级功能

### 数据加密

```typescript
import { createStorage } from '@lee/base';

// 创建加密存储实例
const secureStorage = createStorage({
  prefixKey: 'secure_',
  encryption: {
    enabled: true,
    secret: 'your-secret-key',
    algorithm: 'AES', // AES | Base64
  },
});

// 存储加密数据
secureStorage.set('password', '123456'); // 自动加密
const password = secureStorage.get('password'); // 自动解密

// 查看原始存储值
localStorage.getItem('secure_password'); // 加密后的字符串
```

### 命名空间

```typescript
import { createStorage } from '@lee/base';

// 创建带命名空间的存储
const appStorage = createStorage({
  prefixKey: 'app_',
  namespace: 'myapp',
});

const userStorage = createStorage({
  prefixKey: 'user_',
  namespace: 'myapp',
});

// 存储时自动添加前缀
appStorage.set('config', {}); // 实际键名: myapp_app_config
userStorage.set('profile', {}); // 实际键名: myapp_user_profile

// 按命名空间清理
appStorage.clearNamespace(); // 只清理 app_ 前缀的数据
```

### 响应式存储

```typescript
import { useStorage } from '@lee/base';
import { watch } from 'vue';

// 创建响应式存储
const [userInfo, setUserInfo, removeUserInfo] = useStorage('userInfo', {
  name: '默认用户',
});

// 组件中使用
<template>
  <div>
    <p>用户名：{{ userInfo.name }}</p>
    <n-button @click="updateUser">更新用户</n-button>
  </div>
</template>

<script setup>
const updateUser = () => {
  setUserInfo({ name: '新用户' }); // 自动更新视图和存储
};

// 监听变化
watch(userInfo, (newValue) => {
  console.log('用户信息更新:', newValue);
});
</script>
```

### 批量操作

```typescript
import { storage } from '@lee/base';

// 批量设置
storage.setMultiple({
  key1: 'value1',
  key2: 'value2',
  key3: 'value3',
});

// 批量获取
const values = storage.getMultiple(['key1', 'key2', 'key3']);
// { key1: 'value1', key2: 'value2', key3: 'value3' }

// 批量删除
storage.removeMultiple(['key1', 'key2']);

// 按前缀删除
storage.removeByPrefix('temp_');

// 按正则删除
storage.removeByPattern(/^cache_/);
```

## 存储管理

### 容量监控

```typescript
import { storage, StorageManager } from '@lee/base';

// 获取存储信息
const info = StorageManager.getStorageInfo();
console.log(info);
// {
//   used: 2048,      // 已使用 (字节)
//   total: 5242880,  // 总容量 (字节)
//   available: 5240832, // 可用空间 (字节)
//   usage: '0.04%',  // 使用率
//   items: 10,       // 存储项数量
// }

// 检查是否有足够空间
const canStore = StorageManager.hasSpace(1024); // 需要 1KB

// 获取所有键
const keys = storage.keys();

// 获取存储项大小
const size = storage.getSize('userInfo'); // 返回字节数
```

### 数据导入导出

```typescript
import { storage } from '@lee/base';

// 导出所有数据
const exportData = storage.export();
// 可以保存为文件或传输到服务器

// 导出指定键
const partialExport = storage.export(['user', 'config']);

// 导入数据
storage.import(exportData);

// 合并导入（不覆盖已存在的）
storage.import(newData, { merge: true });

// 导出为 JSON 文件
storage.exportToFile('backup.json');

// 从文件导入
const fileInput = document.querySelector('input[type=file]');
fileInput.addEventListener('change', e => {
  storage.importFromFile(e.target.files[0]);
});
```

### 数据清理

```typescript
import { StorageCleaner } from '@lee/base';

// 清理过期数据
StorageCleaner.cleanExpired();

// 清理指定天数前的数据
StorageCleaner.cleanOldData(7); // 清理 7 天前的数据

// 智能清理（当容量超过阈值时）
StorageCleaner.smartClean({
  threshold: 0.8, // 使用率超过 80% 时触发
  strategy: 'lru', // lru | fifo | expired-first
});

// 定时清理任务
StorageCleaner.startAutoClean({
  interval: 60 * 60 * 1000, // 每小时
  onClean: result => {
    console.log(`清理了 ${result.count} 项，释放 ${result.size} 字节`);
  },
});
```

## 数据迁移

### 版本迁移

```typescript
import { StorageMigration } from '@lee/base';

// 定义迁移规则
const migrations = [
  {
    version: 1,
    migrate: data => {
      // v0 -> v1: 重命名字段
      if (data.username) {
        data.user_name = data.username;
        delete data.username;
      }
      return data;
    },
  },
  {
    version: 2,
    migrate: data => {
      // v1 -> v2: 数据结构调整
      if (data.user_name) {
        data.user = {
          name: data.user_name,
          createTime: Date.now(),
        };
        delete data.user_name;
      }
      return data;
    },
  },
];

// 执行迁移
StorageMigration.migrate(migrations);
```

### 跨域共享

```typescript
import { CrossDomainStorage } from '@lee/base';

// 主域设置
CrossDomainStorage.setup({
  trustedOrigins: ['https://sub.example.com'],
});

// 子域访问
const crossStorage = new CrossDomainStorage('https://main.example.com');
await crossStorage.set('sharedData', data);
const sharedData = await crossStorage.get('sharedData');
```

## 工具函数

### 存储装饰器

```typescript
import { StorageCache } from '@lee/base';

class UserService {
  @StorageCache('user_list', 60 * 1000) // 缓存 1 分钟
  async getUserList() {
    return await api.get('/users');
  }

  @StorageCache(id => `user_${id}`, 5 * 60 * 1000) // 缓存 5 分钟
  async getUser(id: string) {
    return await api.get(`/users/${id}`);
  }
}
```

### 计算属性存储

```typescript
import { computedStorage } from '@lee/base';

const theme = computedStorage('theme', () => {
  // 如果存储中没有，使用计算值
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
});

// 使用
console.log(theme.value); // 'dark' 或 'light'
theme.value = 'blue'; // 更新存储
```

### 存储事件

```typescript
import { storage } from '@lee/base';

// 监听存储变化
storage.on('change', (key, newValue, oldValue) => {
  console.log(`${key} 从 ${oldValue} 变为 ${newValue}`);
});

// 监听特定键
storage.on('change:userInfo', (newValue, oldValue) => {
  console.log('用户信息更新', newValue);
});

// 跨标签页同步
storage.on('sync', changes => {
  console.log('其他标签页的变化', changes);
});

// 移除监听器
const unsubscribe = storage.on('change', handler);
unsubscribe(); // 取消监听
```

## 配置选项

### 全局配置

```typescript
import { configureStorage } from '@lee/base';

configureStorage({
  // 默认过期时间 (毫秒)
  defaultExpire: 24 * 60 * 60 * 1000, // 1 天

  // 默认加密配置
  encryption: {
    enabled: false,
    secret: 'default-secret',
  },

  // 序列化配置
  serializer: {
    stringify: JSON.stringify,
    parse: JSON.parse,
  },

  // 错误处理
  errorHandler: (error, key, value) => {
    console.error(`存储错误 [${key}]:`, error);
  },

  // 容量限制
  maxSize: 5 * 1024 * 1024, // 5MB

  // 自动清理
  autoClean: {
    enabled: true,
    interval: 60 * 60 * 1000, // 1 小时
  },
});
```

### 实例配置

```typescript
const customStorage = createStorage({
  // 存储类型
  type: 'localStorage', // 'localStorage' | 'sessionStorage' | 'memory'

  // 键前缀
  prefixKey: 'app_',

  // 命名空间
  namespace: 'myapp',

  // 加密选项
  encryption: {
    enabled: true,
    secret: 'custom-secret',
  },

  // 过期时间
  expire: 7 * 24 * 60 * 60 * 1000, // 7 天

  // 自定义序列化
  serializer: {
    stringify: value => {
      // 自定义序列化逻辑
      return JSON.stringify(value);
    },
    parse: text => {
      // 自定义反序列化逻辑
      return JSON.parse(text);
    },
  },
});
```

## TypeScript 支持

### 类型定义

```typescript
// 定义存储数据类型
interface UserData {
  id: string;
  name: string;
  email: string;
}

// 类型安全的存储
const typedStorage = createTypedStorage<{
  user: UserData;
  token: string;
  settings: Record<string, any>;
}>();

// 自动类型推导
const user = typedStorage.get('user'); // UserData | null
const token = typedStorage.get('token'); // string | null

// 类型错误检查
typedStorage.set('user', { id: '1' }); // TS Error: 缺少 name 和 email
```

### 泛型支持

```typescript
import { useStorage } from '@lee/base';

// 泛型存储
function useUserStorage() {
  return useStorage<UserData>('user', {
    id: '',
    name: '',
    email: '',
  });
}

const [user, setUser] = useUserStorage();
// user 类型为 UserData
```

## 性能优化

### 防抖和节流

```typescript
import { createStorage } from '@lee/base';

const storage = createStorage({
  // 写入防抖
  debounce: {
    wait: 500, // 延迟 500ms
    maxWait: 2000, // 最大延迟 2s
  },

  // 批量写入
  batch: {
    enabled: true,
    size: 10, // 批量大小
    delay: 100, // 批处理延迟
  },
});
```

### 内存缓存

```typescript
import { createCachedStorage } from '@lee/base';

// 创建带内存缓存的存储
const cachedStorage = createCachedStorage({
  cache: {
    max: 100, // 最大缓存数
    ttl: 60000, // 缓存时间 (ms)
  },
});

// 首次从 localStorage 读取，后续从内存读取
const value1 = cachedStorage.get('key'); // localStorage
const value2 = cachedStorage.get('key'); // memory cache
```

## 最佳实践

### 1. 合理设置过期时间

```typescript
// ✅ 临时数据设置短期过期
storage.set('tempData', data, { expire: 10 * 60 * 1000 }); // 10分钟

// ✅ 长期数据设置长期过期或不过期
storage.set('userPreference', preference, { expire: 30 * 24 * 60 * 60 * 1000 }); // 30天
```

### 2. 敏感数据加密

```typescript
// ✅ 敏感信息使用加密存储
secureStorage.set('token', authToken);
secureStorage.set('password', password);

// ❌ 避免明文存储敏感信息
storage.set('password', password);
```

### 3. 避免存储大量数据

```typescript
// ✅ 只存储必要的数据
storage.set('userInfo', {
  id: user.id,
  name: user.name,
  avatar: user.avatar,
});

// ❌ 避免存储整个对象
storage.set('userInfo', entireUserObject);
```

### 4. 定期清理

```typescript
// ✅ 设置自动清理
StorageCleaner.startAutoClean({
  interval: 24 * 60 * 60 * 1000, // 每天清理一次
});

// ✅ 主动清理不需要的数据
storage.removeByPrefix('temp_');
storage.removeByPrefix('cache_');
```

## API 参考

完整的 API 文档正在建设中。

## 相关资源

- [状态管理](/base/state) - Pinia 状态持久化
- [Service 模块](/base/service) - API 请求和缓存
- [工具函数](/utils/) - 更多工具函数
