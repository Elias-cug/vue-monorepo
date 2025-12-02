## 概述

这是一个基础库，提供项目所需的基础框架，包括布局、路由、状态管理、请求响应、一些常用内置页面（登录、403、404）。该库旨在处理通用后端业务逻辑。

## 布局系统

以 AdminLayout 为基础，扩展出常用的 BasicLayout、HeaderLayout、BlankLayout。

1. BasicLayout：涵盖 header tabs sider content

2. HeaderLayout：涵盖 header content

3. BlankLayout：涵盖 content

### 子项：

- **header**

  **功能：**左侧展示系统 logo，系统标题。右侧展示用户信息、退出登录等操作
  **自定义：**支持自定义 header 内容，默认使用系统内置的公共 Header；同时支持header的插槽扩展，支持插入左侧，中间，右侧的信息展示。
  **数据来源：**appStore.appInfo 以及 authStore.userInfo

- **sider**

**功能：** 展示侧边菜单，支持折叠
**数据来源：** authStore.menus

- **tabs**

**功能：** 展示标签页，右键菜单支持关闭当前，关闭其他、关闭全部
**数据来源：** appStore.tabs

- **content**

  **功能：** 展示 router-view 内容

## 路由管理与权限控制

## 状态管理方案

### 类型

涉及 appInfo、UserInfo、Menu、TabItem

- **appInfo**

```ts
interface AppInfo {
  id: string;
  name: string;
  icon: string;
  version: string;
  description: string;
}
```

- **UserInfo**

```ts
interface UserInfo {
  /** 用户 ID */
  id?: string | number;
  /** 用户名 */
  username?: string;
  /** 姓名 */
  name?: string;
  /** 邮箱 */
  email?: string;
  /** 电话 */
  phone?: string;
  /** 头像 */
  avatar?: string;
  /** 角色 */
  roles?: string[];
  /** 其他信息 */
  [key: string]: any;
}
```

- **menus**

```ts
export interface Menu {
  /** 唯一值 */
  key: string;
  /** 菜单名称 */
  title: string;
  /** 是否固定 */
  pinned?: boolean;
  /** 是否隐藏，默认 false */
  hidden?: boolean;
  /** query */
  query?: Record<string, any>;
  /** 前端路径不建议在后端返回 */
  path?: string;
  /** 菜单图标，不建议在后端返回 */
  icon?: string | any;
  /** 其他属性，存放一些业务属性 */
  extraProps?: Record<string, any>;
  /** 菜单元信息 */
  meta: Record<string, any>;
  /** 子菜单 */
  children?: Menu[];
}
```

- **tabs**

```ts
interface TabItem {
  /** Tab 的唯一 key，绑定 fullPath */
  key: string;
  /** Tab 显示的名称 */
  title: string;
  /** Tab 的路径 */
  path: string;
  /** Tab 的 query */
  query?: Record<string, any>;
  /** Tab 的元信息 */
  meta?: RouteMeta;
}
```

## HTTP 请求封装

- 统一请求接口
- 响应拦截处理
- 错误统一处理

## 常用内置页面（登录、403、404）
