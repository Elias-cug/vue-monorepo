# LeDialog 弹窗组件

基于 Naive UI 的 NModal 二次封装的弹窗组件，支持全屏切换和拖拽功能。

## 特性

- ✅ 基于 NModal 二次封装，属性和事件透传
- ✅ 支持 `v-model:visible` 控制弹窗显示/隐藏
- ✅ 支持全屏/退出全屏切换
- ✅ 支持拖拽移动（含边界限制）
- ✅ 支持自定义 header、footer 插槽
- ✅ 主题响应式，自动适配明暗模式

## 基础用法

```vue
<template>
  <n-button @click="visible = true">打开弹窗</n-button>

  <LeDialog v-model:visible="visible" title="弹窗标题">
    <p>弹窗内容</p>
  </LeDialog>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { LeDialog } from '@lee/ui';

const visible = ref(false);
</script>
```

## 带底部操作

```vue
<template>
  <LeDialog v-model:visible="visible" title="确认操作">
    <p>确定要执行此操作吗？</p>

    <template #footer>
      <n-button @click="visible = false">取消</n-button>
      <n-button type="primary" @click="handleConfirm">确定</n-button>
    </template>
  </LeDialog>
</template>
```

## 自定义 Header

```vue
<template>
  <LeDialog v-model:visible="visible">
    <template #header>
      <div class="custom-header">
        <n-icon><SettingsOutline /></n-icon>
        <span>自定义标题</span>
      </div>
    </template>

    <p>弹窗内容</p>
  </LeDialog>
</template>
```

## 禁用全屏功能

```vue
<template>
  <LeDialog v-model:visible="visible" title="不可全屏" :fullscreenable="false">
    <p>此弹窗不支持全屏</p>
  </LeDialog>
</template>
```

## 可拖拽弹窗

```vue
<template>
  <LeDialog v-model:visible="visible" title="拖拽我" draggable>
    <p>拖拽标题栏可以移动弹窗</p>
    <p>弹窗不会超出视口边界</p>
  </LeDialog>
</template>
```

### 拖拽特性

- **仅标题栏可拖拽**：避免内容区域误操作
- **边界限制**：弹窗不会被拖出视口范围
- **关闭重置**：弹窗关闭后位置自动重置到中心
- **全屏禁用**：全屏模式下不可拖拽

## Props

| 属性           | 类型               | 默认值  | 说明                              |
| -------------- | ------------------ | ------- | --------------------------------- |
| visible        | `boolean`          | `false` | 控制弹窗显示/隐藏，支持 `v-model` |
| title          | `string`           | -       | 弹窗标题                          |
| width          | `string \| number` | `520`   | 弹窗宽度                          |
| closable       | `boolean`          | `true`  | 是否显示关闭按钮                  |
| fullscreenable | `boolean`          | `true`  | 是否支持全屏切换                  |
| draggable      | `boolean`          | `true`  | 是否可拖拽移动                    |
| maskClosable   | `boolean`          | `true`  | 点击遮罩是否关闭                  |
| destroyOnClose | `boolean`          | `false` | 关闭时是否销毁内容                |
| style          | `CSSProperties`    | -       | 自定义样式                        |
| class          | `string`           | -       | 自定义类名                        |
| contentStyle   | `CSSProperties`    | -       | 弹窗内容的自定义样式              |

## Events

| 事件名           | 参数                      | 说明                   |
| ---------------- | ------------------------- | ---------------------- |
| update:visible   | `(visible: boolean)`      | 弹窗显示状态变化时触发 |
| close            | -                         | 弹窗关闭时触发         |
| fullscreenChange | `(isFullscreen: boolean)` | 全屏状态变化时触发     |
| afterEnter       | -                         | 弹窗进入动画完成后触发 |
| afterLeave       | -                         | 弹窗离开动画完成后触发 |
| esc              | -                         | 按下 Esc 键时触发      |
| maskClick        | -                         | 点击遮罩时触发         |

## Slots

| 插槽名  | 说明                           |
| ------- | ------------------------------ |
| default | 弹窗内容                       |
| header  | 自定义头部内容，会保留操作按钮 |
| footer  | 底部操作区域                   |

## 透传属性

组件会将未声明的属性透传给 NModal，可以使用 NModal 的所有属性：

```vue
<template>
  <!-- 使用 NModal 的其他属性 -->
  <LeDialog
    v-model:visible="visible"
    title="透传示例"
    :z-index="2000"
    :auto-focus="false"
    :trap-focus="true"
    :block-scroll="true"
    to="body"
    @after-enter="handleAfterEnter"
    @after-leave="handleAfterLeave"
  >
    <p>内容</p>
  </LeDialog>
</template>
```

### 常用透传属性

| 属性             | 类型                | 说明                    |
| ---------------- | ------------------- | ----------------------- |
| zIndex           | `number`            | 弹窗层级                |
| autoFocus        | `boolean`           | 是否自动聚焦            |
| trapFocus        | `boolean`           | 是否限制焦点在弹窗内    |
| blockScroll      | `boolean`           | 是否阻止背景滚动        |
| to               | `string \| Element` | 弹窗挂载位置            |
| displayDirective | `'if' \| 'show'`    | 显示指令（v-if/v-show） |

## 样式变量

组件使用以下 CSS 变量，可通过主题系统自定义：

- `--le-card` - 弹窗背景色
- `--le-divider` - 分割线颜色
- `--le-text-1` - 标题文字颜色
- `--le-text-2` - 按钮图标颜色
- `--le-hover` - 悬停背景色
- `--le-pressed` - 按下背景色
- `--le-error` - 关闭按钮悬停颜色
- `--le-radius-lg` - 圆角大小
- `--le-shadow-3` - 阴影
