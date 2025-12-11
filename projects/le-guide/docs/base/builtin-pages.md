# 内置页面

Vue Monorepo 提供了一套完整的系统页面，包括登录、错误页面、结果页面等，所有页面都支持主题切换和响应式布局。

## 页面类型

### 登录页面

完整的登录解决方案，支持多种登录方式：

- **密码登录** - 传统用户名密码登录
- **验证码登录** - 手机号短信验证码
- **第三方登录** - GitHub、微信、Google OAuth
- **记住密码** - 本地存储加密保存
- **自动登录** - Token 自动续期

```vue
<!-- 基础登录表单 -->
<template>
  <div class="login-page">
    <n-form :model="loginForm" :rules="rules">
      <n-form-item path="username">
        <n-input v-model:value="loginForm.username" placeholder="用户名" />
      </n-form-item>

      <n-form-item path="password">
        <n-input v-model:value="loginForm.password" type="password" placeholder="密码" />
      </n-form-item>

      <n-button type="primary" block @click="handleLogin">登录</n-button>
    </n-form>
  </div>
</template>
```

### 错误页面

#### 403 无权限

```vue
<template>
  <div class="error-page">
    <n-icon :size="120" color="var(--le-warning)">
      <LockClosedOutline />
    </n-icon>
    <h1>403</h1>
    <p>抱歉，您无权访问此页面</p>
    <n-button @click="router.push('/')">返回首页</n-button>
  </div>
</template>
```

#### 404 页面不存在

```vue
<template>
  <div class="error-page">
    <h1 class="error-404">404</h1>
    <p>页面找不到了</p>
    <div class="quick-links">
      <router-link to="/">首页</router-link>
      <router-link to="/dashboard">仪表盘</router-link>
    </div>
  </div>
</template>
```

#### 500 服务器错误

```vue
<template>
  <div class="error-page">
    <h1>500</h1>
    <p>服务器错误</p>
    <n-button @click="location.reload()">刷新页面</n-button>
  </div>
</template>
```

### 结果页面

展示操作结果的反馈页面：

#### 成功页

```vue
<n-result status="success" title="操作成功" description="您的操作已成功完成">
  <template #footer>
    <n-button type="primary">返回首页</n-button>
  </template>
</n-result>
```

#### 失败页

```vue
<n-result status="error" title="操作失败" description="请稍后重试">
  <template #footer>
    <n-button type="primary">重新尝试</n-button>
  </template>
</n-result>
```

### 特殊页面

#### 系统维护

```vue
<template>
  <div class="maintenance-page">
    <n-icon :size="120">
      <ConstructOutline />
    </n-icon>
    <h1>系统维护中</h1>
    <div class="countdown">
      <span>{{ hours }}:{{ minutes }}:{{ seconds }}</span>
    </div>
  </div>
</template>
```

#### 网络异常

```vue
<template>
  <div class="offline-page">
    <n-icon :size="100">
      <WifiOffOutline />
    </n-icon>
    <h2>网络连接失败</h2>
    <n-button @click="checkNetwork">重新检测</n-button>
  </div>
</template>
```

## 页面配置

### 路由配置

```typescript
export const systemRoutes = [
  {
    path: '/login',
    component: () => import('@/pages/login/index.vue'),
    meta: {
      title: '登录',
      noAuth: true, // 不需要认证
      noLayout: true, // 不使用布局
    },
  },
  {
    path: '/403',
    component: () => import('@/pages/error/403.vue'),
    meta: {
      title: '无权限',
      noAuth: true,
    },
  },
  {
    path: '/404',
    component: () => import('@/pages/error/404.vue'),
    meta: {
      title: '页面不存在',
      noAuth: true,
    },
  },
  {
    path: '/500',
    component: () => import('@/pages/error/500.vue'),
    meta: {
      title: '服务器错误',
      noAuth: true,
    },
  },
];
```

### 统一错误处理

```typescript
// 全局错误处理
export function handlePageError(error: any) {
  const errorMap: Record<number, string> = {
    403: '/403',
    404: '/404',
    500: '/500',
  };

  const status = error.response?.status;
  const path = errorMap[status] || '/500';

  router.push({
    path,
    query: {
      from: router.currentRoute.value.fullPath,
      message: error.message,
    },
  });
}

// 路由守卫中使用
router.beforeEach(async (to, from, next) => {
  try {
    // 权限验证
    if (!hasPermission(to)) {
      next('/403');
    } else {
      next();
    }
  } catch (error) {
    handlePageError(error);
  }
});
```

## 页面特性

### 主题响应

所有内置页面都支持主题切换：

```scss
.error-page {
  background: var(--le-neutral-body);

  h1 {
    color: var(--le-text-1);
    background: linear-gradient(135deg, var(--le-primary) 0%, var(--le-primary-7) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  p {
    color: var(--le-text-2);
  }
}
```

### 响应式布局

```scss
// 移动端适配
@media (max-width: 768px) {
  .login-page {
    padding: 20px;

    .login-container {
      width: 100%;
      max-width: 400px;
    }
  }

  .error-page {
    h1 {
      font-size: 48px; // 移动端缩小字体
    }

    .error-actions {
      flex-direction: column; // 按钮垂直排列
    }
  }
}
```

### 动画效果

```vue
<template>
  <transition name="fade-scale" mode="out-in">
    <component :is="currentPage" />
  </transition>
</template>

<style>
.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.3s ease;
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}
</style>
```

## 登录流程

### 完整登录示例

```typescript
// stores/user.ts
export const useUserStore = defineStore('user', {
  actions: {
    async login(loginForm: LoginForm) {
      // 1. 调用登录接口
      const { data } = await loginApi(loginForm);

      // 2. 保存 token
      this.token = data.token;
      storage.set('token', data.token);

      // 3. 获取用户信息
      await this.getUserInfo();

      // 4. 生成动态路由
      await generateRoutes();

      // 5. 跳转到首页或之前页面
      const redirect = route.query.redirect as string;
      router.push(redirect || '/');
    },

    async logout() {
      // 1. 清空 token
      this.token = '';
      storage.remove('token');

      // 2. 清空用户信息
      this.userInfo = null;

      // 3. 重置路由
      resetRouter();

      // 4. 跳转到登录页
      router.push('/login');
    },
  },
});
```

### OAuth 登录

```typescript
// 第三方登录
const handleOAuth = async (provider: string) => {
  // 1. 获取授权 URL
  const { authUrl } = await getOAuthUrl(provider);

  // 2. 打开授权窗口
  const authWindow = window.open(authUrl, 'oauth', 'width=500,height=600');

  // 3. 监听授权结果
  window.addEventListener('message', async event => {
    if (event.data.type === 'oauth-success') {
      const { code } = event.data;

      // 4. 使用 code 换取 token
      const { token } = await oauthLogin(provider, code);

      // 5. 保存并登录
      userStore.setToken(token);
      await userStore.getUserInfo();

      authWindow?.close();
      router.push('/');
    }
  });
};
```

## 页面优化

### 预加载

```typescript
// 预加载错误页面
const preloadErrorPages = () => {
  import('@/pages/error/403.vue');
  import('@/pages/error/404.vue');
  import('@/pages/error/500.vue');
};

// 应用启动时预加载
onMounted(() => {
  requestIdleCallback(preloadErrorPages);
});
```

### SEO 优化

```typescript
// 设置页面 meta
router.beforeEach((to, from, next) => {
  // 设置标题
  document.title = `${to.meta.title || '页面'} - Vue Monorepo`;

  // 设置描述
  const description = to.meta.description || '企业级前端解决方案';
  document.querySelector('meta[name="description"]')?.setAttribute('content', description);

  next();
});
```

## 最佳实践

1. **统一风格** - 保持所有系统页面视觉风格一致
2. **友好提示** - 提供明确的错误信息和解决方案
3. **快速导航** - 提供返回首页等快捷操作
4. **响应式设计** - 确保在各种设备上正常显示
5. **主题适配** - 支持明暗主题切换
6. **性能优化** - 错误页面应该轻量快速加载

## 相关资源

- [路由系统](/base/router) - 路由配置和守卫
- [布局系统](/base/layout) - 页面布局组件
- [主题系统](/theme/) - 页面主题配置
- [状态管理](/base/state) - 登录状态管理
