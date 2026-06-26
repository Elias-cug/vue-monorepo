# 状态管理

Vue Monorepo 使用 Pinia 作为状态管理方案，提供了模块化的 store 设计和完整的 TypeScript 支持。

## 核心特性

- 🎯 **模块化设计** - 按功能拆分 store，职责清晰
- 📝 **TypeScript 支持** - 完整的类型推导和智能提示
- 💾 **持久化插件** - 自动保存和恢复状态
- 🔄 **响应式系统** - 基于 Vue 3 响应式
- 🎨 **DevTools 集成** - 完美支持 Vue DevTools
- 🚀 **轻量高效** - 体积小，性能优异

## 基础使用

### 安装配置

```typescript
// main.ts
import { createApp } from 'vue';
import { createPinia } from 'pinia';
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate';

const app = createApp(App);
const pinia = createPinia();

// 使用持久化插件
pinia.use(piniaPluginPersistedstate);

app.use(pinia);
```

### 定义 Store

```typescript
// stores/user.ts
import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  // 状态
  state: () => ({
    userInfo: null as UserInfo | null,
    token: '',
    permissions: [] as string[],
  }),

  // 计算属性
  getters: {
    isLogin: state => !!state.token,
    hasPermission: state => {
      return (permission: string) => {
        return state.permissions.includes(permission);
      };
    },
    userName: state => state.userInfo?.name || '未登录',
  },

  // 方法
  actions: {
    // 登录
    async login(loginForm: LoginForm) {
      const { data } = await loginApi(loginForm);
      this.token = data.token;
      this.userInfo = data.userInfo;
      this.permissions = data.permissions;
    },

    // 登出
    logout() {
      this.token = '';
      this.userInfo = null;
      this.permissions = [];
    },

    // 更新用户信息
    updateUserInfo(userInfo: Partial<UserInfo>) {
      this.userInfo = { ...this.userInfo, ...userInfo };
    },
  },

  // 持久化配置
  persist: {
    key: 'user-store',
    storage: localStorage,
    paths: ['token', 'userInfo'], // 只持久化部分状态
  },
});
```

### 使用 Store

```vue
<template>
  <div class="user-info">
    <p>用户名：{{ userStore.userName }}</p>
    <p>登录状态：{{ userStore.isLogin ? '已登录' : '未登录' }}</p>
    <n-button @click="handleLogout">退出登录</n-button>
  </div>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

const userStore = useUserStore();
const router = useRouter();

const handleLogout = () => {
  userStore.logout();
  router.push('/login');
};
</script>
```

## Setup Store 写法

推荐使用 Composition API 风格的 Setup Store：

```typescript
// stores/app.ts
import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAppStore = defineStore(
  'app',
  () => {
    // state
    const sidebarCollapsed = ref(false);
    const device = ref<'desktop' | 'mobile'>('desktop');
    const language = ref('zh-CN');
    const loading = ref(false);

    // getters
    const isMobile = computed(() => device.value === 'mobile');
    const isDesktop = computed(() => device.value === 'desktop');

    // actions
    function toggleSidebar() {
      sidebarCollapsed.value = !sidebarCollapsed.value;
    }

    function setDevice(newDevice: 'desktop' | 'mobile') {
      device.value = newDevice;
    }

    function setLoading(status: boolean) {
      loading.value = status;
    }

    // 返回需要暴露的内容
    return {
      // state
      sidebarCollapsed,
      device,
      language,
      loading,
      // getters
      isMobile,
      isDesktop,
      // actions
      toggleSidebar,
      setDevice,
      setLoading,
    };
  },
  {
    // 持久化配置
    persist: {
      key: 'app-store',
      storage: localStorage,
      paths: ['sidebarCollapsed', 'language'],
    },
  }
);
```

## 预置 Store

### AppStore 应用状态

```typescript
import { useAppStore } from '@lee/base';

const appStore = useAppStore();

// 状态
appStore.sidebarCollapsed; // 侧边栏折叠状态
appStore.device; // 设备类型
appStore.language; // 语言设置
appStore.loading; // 全局加载状态

// 方法
appStore.toggleSidebar(); // 切换侧边栏
appStore.setDevice('mobile'); // 设置设备类型
appStore.setLoading(true); // 设置加载状态
```

### ThemeStore 主题状态

```typescript
import { useThemeStore } from '@lee/base';

const themeStore = useThemeStore();

// 状态
themeStore.theme; // 当前主题
themeStore.mode; // 明暗模式
themeStore.primaryColor; // 主色调

// 方法
themeStore.setTheme('blue'); // 设置主题
themeStore.setMode('dark'); // 设置模式
themeStore.toggleMode(); // 切换明暗模式
```

### RouteStore 路由状态

```typescript
import { useRouteStore } from '@lee/base';

const routeStore = useRouteStore();

// 状态
routeStore.visitedRoutes; // 访问过的路由
routeStore.cachedRoutes; // 缓存的路由
routeStore.tabs; // 标签页列表
routeStore.activeTab; // 当前标签页

// 方法
routeStore.addTab(tab); // 添加标签页
routeStore.removeTab(key); // 移除标签页
routeStore.clearTabs(); // 清空标签页
routeStore.setActiveTab(key); // 设置当前标签
```

## 模块化组织

### Store 目录结构

```
src/stores/
├── modules/          # 模块化 store
│   ├── user.ts      # 用户模块
│   ├── app.ts       # 应用模块
│   ├── theme.ts     # 主题模块
│   └── permission.ts # 权限模块
├── index.ts         # 统一导出
└── types.ts         # 类型定义
```

### 统一导出

```typescript
// stores/index.ts
export { useUserStore } from './modules/user';
export { useAppStore } from './modules/app';
export { useThemeStore } from './modules/theme';
export { usePermissionStore } from './modules/permission';

// 统一类型
export type * from './types';
```

### 类型定义

```typescript
// stores/types.ts
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  roles: string[];
}

export interface AppState {
  sidebarCollapsed: boolean;
  device: 'desktop' | 'mobile';
  language: string;
  loading: boolean;
}

export interface ThemeState {
  theme: string;
  mode: 'light' | 'dark';
  primaryColor: string;
}
```

## 持久化存储

### 基础配置

```typescript
defineStore('user', {
  // ...
  persist: true, // 启用默认持久化
});

// 或自定义配置
defineStore('user', {
  // ...
  persist: {
    key: 'my-user-store', // 存储键名
    storage: localStorage, // 存储方式
    paths: ['token'], // 持久化路径
    beforeRestore: ctx => {
      // 恢复前的钩子
    },
    afterRestore: ctx => {
      // 恢复后的钩子
    },
  },
});
```

### 选择性持久化

```typescript
// 只持久化部分状态
persist: {
  paths: ['user.token', 'user.refreshToken'],
  // 或使用函数
  paths: (state) => {
    return ['user.token'];
  },
}
```

### 自定义存储

```typescript
// 使用 sessionStorage
persist: {
  storage: sessionStorage,
}

// 自定义存储适配器
const customStorage = {
  getItem: (key: string) => {
    return encrypt(localStorage.getItem(key));
  },
  setItem: (key: string, value: string) => {
    localStorage.setItem(key, decrypt(value));
  },
  removeItem: (key: string) => {
    localStorage.removeItem(key);
  },
};

persist: {
  storage: customStorage,
}
```

## Store 间通信

### 相互引用

```typescript
// stores/user.ts
import { useAppStore } from './app';

export const useUserStore = defineStore('user', () => {
  const appStore = useAppStore();

  async function login(form: LoginForm) {
    appStore.setLoading(true);
    try {
      // 登录逻辑
    } finally {
      appStore.setLoading(false);
    }
  }

  return { login };
});
```

### 监听变化

```typescript
// 监听其他 store 的变化
import { watch } from 'vue';
import { useThemeStore } from './theme';

const themeStore = useThemeStore();

watch(
  () => themeStore.mode,
  newMode => {
    console.log('主题模式变更:', newMode);
    // 执行相关逻辑
  }
);
```

### 订阅 Actions

```typescript
// 订阅 store 的 action
const unsubscribe = store.$onAction(
  ({
    name, // action 名称
    store, // store 实例
    args, // 传递给 action 的参数
    after, // action 成功后的钩子
    onError, // action 出错时的钩子
  }) => {
    // action 执行前
    console.log(`Action ${name} 开始执行`);

    // action 执行后
    after(result => {
      console.log(`Action ${name} 执行完成`, result);
    });

    // action 出错时
    onError(error => {
      console.error(`Action ${name} 执行失败`, error);
    });
  }
);

// 取消订阅
unsubscribe();
```

## 插件开发

### 创建插件

```typescript
// plugins/logger.ts
import { PiniaPluginContext } from 'pinia';

export function createLoggerPlugin() {
  return (context: PiniaPluginContext) => {
    const { store } = context;

    // 添加属性
    store.$state.startTime = Date.now();

    // 订阅状态变化
    store.$subscribe((mutation, state) => {
      console.log(`[${store.$id}] 状态变更:`, mutation);
    });

    // 订阅 action
    store.$onAction(({ name, args, after }) => {
      console.log(`[${store.$id}] Action ${name} 调用:`, args);

      after(result => {
        console.log(`[${store.$id}] Action ${name} 结果:`, result);
      });
    });

    // 返回要添加到 store 的属性
    return {
      secretProperty: `秘密值-${store.$id}`,
    };
  };
}

// 使用插件
pinia.use(createLoggerPlugin());
```

### 全局扩展

```typescript
// pinia.d.ts
import 'pinia';

declare module 'pinia' {
  export interface PiniaCustomProperties {
    // 添加全局属性
    $reset: () => void;
    $hydrate: () => void;
  }

  export interface PiniaCustomStateProperties<S> {
    // 添加状态属性
    startTime: number;
  }
}
```

## 测试

### 单元测试

```typescript
// stores/__tests__/user.spec.ts
import { setActivePinia, createPinia } from 'pinia';
import { useUserStore } from '../user';

describe('UserStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('登录成功', async () => {
    const store = useUserStore();

    await store.login({
      username: 'admin',
      password: '123456',
    });

    expect(store.isLogin).toBe(true);
    expect(store.token).toBeTruthy();
  });

  it('登出', () => {
    const store = useUserStore();
    store.token = 'test-token';

    store.logout();

    expect(store.isLogin).toBe(false);
    expect(store.token).toBe('');
  });
});
```

### 组件测试

```typescript
import { mount } from '@vue/test-utils';
import { createTestingPinia } from '@pinia/testing';
import UserInfo from '@/components/UserInfo.vue';

test('显示用户信息', () => {
  const wrapper = mount(UserInfo, {
    global: {
      plugins: [
        createTestingPinia({
          initialState: {
            user: {
              userInfo: {
                name: '测试用户',
              },
            },
          },
        }),
      ],
    },
  });

  expect(wrapper.text()).toContain('测试用户');
});
```

## 最佳实践

### 1. 合理拆分模块

```typescript
// ✅ 好的：按功能拆分
stores / user.ts; // 用户相关
product.ts; // 产品相关
cart.ts; // 购物车相关

// ❌ 不好：所有状态放在一起
stores / index.ts; // 所有状态
```

### 2. 避免直接修改状态

```typescript
// ✅ 好的：通过 action 修改
const store = useUserStore();
store.updateProfile({ name: '新名称' });

// ❌ 不好：直接修改
store.userInfo.name = '新名称';
```

### 3. 使用 TypeScript

```typescript
// ✅ 定义明确的类型
interface UserState {
  userInfo: UserInfo | null;
  token: string;
}

// ❌ 使用 any
state: () => ({
  userInfo: null as any,
});
```

### 4. 合理使用持久化

```typescript
// ✅ 只持久化必要的状态
persist: {
  paths: ['token', 'userInfo'],
}

// ❌ 持久化所有状态
persist: true
```

## API 参考

- [Pinia 官方文档](https://pinia.vuejs.org/)
- [持久化插件文档](https://prazdevs.github.io/pinia-plugin-persistedstate/)
- [DevTools 使用指南](https://devtools.vuejs.org/)

## 相关资源

- [路由系统](/base/router) - 路由状态管理
- [存储方案](/base/storage) - 本地存储封装
- [请求模块](/base/service) - API 状态管理
