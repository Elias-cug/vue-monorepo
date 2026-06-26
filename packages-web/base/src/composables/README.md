# Composables 使用文档

## toLogin - 跳转登录页

独立的登录跳转函数，用于统一处理登录跳转逻辑。

### 使用方式

```typescript
import { toLogin } from '@base/composables';

// 基础使用：跳转到登录页并清除 token
toLogin();

// 带重定向：跳转后可以返回原页面
toLogin('/dashboard');
toLogin(router.currentRoute.value.fullPath);

// 不清除 token（特殊场景）
toLogin('/dashboard', false);
```

### 参数说明

| 参数       | 类型    | 默认值    | 说明                               |
| ---------- | ------- | --------- | ---------------------------------- |
| redirect   | string  | undefined | 重定向路径，登录成功后跳转到此路径 |
| clearToken | boolean | true      | 是否清除 token                     |

### 使用场景

1. **响应拦截器中**：401/403 状态码时自动跳转登录
2. **退出登录**：logout 函数内部调用
3. **手动跳转**：任何需要跳转到登录页的场景

## useRouterHelper

提供路由相关的辅助方法。

### 方法列表

- `logout(redirect?)` - 退出登录（清除状态并跳转登录页）
- `clearCurrentTabAndGo(to, replace?)` - 清除当前 tab 并跳转
- `clearCacheAndGo(to, componentName?, replace?)` - 清除缓存并跳转
- `clearAllCacheAndGo(to, replace?)` - 清除所有缓存并跳转
- `refreshCurrentPage()` - 刷新当前页面
- `closeCurrentTab()` - 关闭当前 tab
- `closeOtherTabs()` - 关闭其他 tabs
- `closeAllTabs(to?)` - 关闭所有 tabs

### 使用示例

```typescript
import { useRouterHelper } from '@base/composables';

const { logout, refreshCurrentPage } = useRouterHelper();

// 退出登录
logout();

// 刷新当前页面
refreshCurrentPage();
```
