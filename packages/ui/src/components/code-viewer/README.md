# LeCodeViewer 代码查看器

基于 highlight.js 的代码高亮显示组件，支持多种编程语言。

## 特性

- ✅ 支持 TypeScript、JavaScript、Markdown、JSON、Shell、Vue 等语言
- ✅ 可选显示行号
- ✅ GitHub Dark 主题
- ✅ 自适应滚动
- ✅ 支持单独引入和整体注册

## 安装

已内置在 `@lee/ui` 包中，无需额外安装。

## 使用方法

### 单独引入

```vue
<template>
  <LeCodeViewer :code="code" language="typescript" />
</template>

<script setup lang="ts">
import { CodeViewer } from '@ui/components/code-viewer';

const code = `function hello() {
  console.log('Hello World');
}`;
</script>
```

### 整体注册

```typescript
// main.ts
import { createApp } from 'vue';
import UI from '@lee/ui';
import App from './App.vue';

const app = createApp(App);
app.use(UI);
app.mount('#app');
```

```vue
<template>
  <LeCodeViewer :code="code" language="typescript" />
</template>
```

## API

### Props

| 属性            | 说明         | 类型                                                                                                         | 默认值         | 必填 |
| --------------- | ------------ | ------------------------------------------------------------------------------------------------------------ | -------------- | ---- |
| code            | 代码内容     | `string`                                                                                                     | -              | 是   |
| language        | 语言类型     | `'typescript' \| 'javascript' \| 'markdown' \| 'json' \| 'shell' \| 'ts' \| 'js' \| 'md' \| 'bash' \| 'vue'` | `'typescript'` | 否   |
| showLineNumbers | 是否显示行号 | `boolean`                                                                                                    | `true`         | 否   |
| style           | 自定义样式   | `CSSProperties`                                                                                              | -              | 否   |
| class           | 自定义类名   | `string`                                                                                                     | -              | 否   |

## 示例

### TypeScript 代码

```vue
<LeCodeViewer :code="tsCode" language="typescript" />
```

### 隐藏行号

```vue
<LeCodeViewer :code="code" language="javascript" :show-line-numbers="false" />
```

### 自定义样式

```vue
<LeCodeViewer :code="code" language="json" :style="{ maxHeight: '400px' }" />
```

## 支持的语言

- `typescript` / `ts` - TypeScript
- `javascript` / `js` - JavaScript
- `markdown` / `md` - Markdown
- `json` - JSON
- `shell` / `bash` - Shell/Bash
- `vue` - Vue 单文件组件（使用 XML 语法高亮）

## 注意事项

1. 组件使用 highlight.js 的 GitHub Dark 主题
2. 长代码会自动显示滚动条
3. Vue 文件使用 XML 语言包进行语法高亮，能正确高亮 template、script、style 标签及属性
4. 建议在暗色背景下使用以获得最佳视觉效果
