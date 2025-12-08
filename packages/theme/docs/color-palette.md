# 主题色板使用指南

## 概述

主题系统现在暴露了完整的主题色板，提供从浅到深的 10 个色阶，方便在不同场景下使用。

## 色板结构

每个主题预设都包含一个完整的主题色板：

```typescript
interface ColorSystem {
  // 基础主色
  primary: string; // 主色（色阶 6）
  primaryHover: string; // 悬停色（色阶 5）
  primaryActive: string; // 激活色（色阶 7）
  primarySuppl: string; // 补充色（色阶 4）

  // 完整色板
  primaryPalette: {
    1: string; // 最浅 - 适合背景
    2: string; // 很浅 - 适合悬停背景
    3: string; // 浅色 - 适合选中背景
    4: string; // 次浅 - 补充色
    5: string; // 中浅 - 悬停色
    6: string; // 主色 - 品牌色
    7: string; // 中深 - 激活色
    8: string; // 深色 - 强调色
    9: string; // 很深 - 文字色
    10: string; // 最深 - 深色文字
  };
}
```

## CSS 变量

生成的 CSS 变量包括：

### 基础变量

- `--le-primary` - 主色
- `--le-primary-hover` - 悬停色
- `--le-primary-active` - 激活色
- `--le-primary-suppl` - 补充色

### 色板变量

- `--le-primary-1` - 色阶 1（最浅）
- `--le-primary-2` - 色阶 2
- `--le-primary-3` - 色阶 3
- `--le-primary-4` - 色阶 4
- `--le-primary-5` - 色阶 5
- `--le-primary-6` - 色阶 6（主色）
- `--le-primary-7` - 色阶 7
- `--le-primary-8` - 色阶 8
- `--le-primary-9` - 色阶 9
- `--le-primary-10` - 色阶 10（最深）

## 使用场景

### 1. 背景色层次

```scss
.container {
  background-color: var(--le-primary-1); // 最浅背景

  .card {
    background-color: var(--le-primary-2); // 稍深一点

    &:hover {
      background-color: var(--le-primary-3); // 悬停效果
    }
  }
}
```

### 2. 文字色层次

```scss
.text-primary {
  color: var(--le-primary-6); // 主色文字
}

.text-primary-dark {
  color: var(--le-primary-9); // 深色文字
}

.text-primary-light {
  color: var(--le-primary-4); // 浅色文字
}
```

### 3. 边框和分割线

```scss
.divider {
  border-color: var(--le-primary-3); // 浅色边框
}

.border-emphasis {
  border-color: var(--le-primary-6); // 强调边框
}
```

### 4. 状态指示

```scss
.status {
  &.light {
    background-color: var(--le-primary-1);
    color: var(--le-primary-8);
  }

  &.normal {
    background-color: var(--le-primary-6);
    color: white;
  }

  &.dark {
    background-color: var(--le-primary-9);
    color: white;
  }
}
```

## 在组件中使用

### Vue 组件示例

```vue
<template>
  <div class="color-palette-demo">
    <!-- 使用不同色阶创建渐变效果 -->
    <div
      v-for="i in 10"
      :key="i"
      class="color-block"
      :style="`background-color: var(--le-primary-${i})`"
    >
      色阶 {{ i }}
    </div>
  </div>
</template>

<style scoped>
.color-palette-demo {
  display: flex;
  gap: 8px;
}

.color-block {
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 12px;
  color: v-bind('i <= 5 ? "var(--le-text-1)" : "white"');
}
</style>
```

### 动态使用

```typescript
import { useTheme } from '@lee/theme';

const { config } = useTheme();

// 获取当前主题的色板
const palette = computed(() => config.value.colors.primaryPalette);

// 动态使用色板
const getColorByLevel = (level: number) => {
  return palette.value?.[level] || config.value.colors.primary;
};
```

## 主题色示例

### 蓝色主题 (Blue)

| 色阶 | 色值    | 用途建议    |
| ---- | ------- | ----------- |
| 1    | #e6f4ff | 浅色背景    |
| 2    | #bae0ff | 悬停背景    |
| 3    | #91caff | 选中背景    |
| 4    | #69b1ff | 次要元素    |
| 5    | #4096ff | 悬停状态    |
| 6    | #1677ff | 主色/品牌色 |
| 7    | #0958d9 | 激活状态    |
| 8    | #003eb3 | 深色强调    |
| 9    | #002c8c | 深色文字    |
| 10   | #001d66 | 最深文字    |

### 红色主题 (Red)

| 色阶 | 色值    | 用途建议  |
| ---- | ------- | --------- |
| 1    | #fff1f0 | 错误背景  |
| 2    | #ffccc7 | 警告背景  |
| 3    | #ffa39e | 危险背景  |
| 4    | #ff7875 | 次要警告  |
| 5    | #ff4d4f | 悬停警告  |
| 6    | #f5222d | 错误/危险 |
| 7    | #cf1322 | 激活错误  |
| 8    | #a8071a | 深色错误  |
| 9    | #820014 | 深色文字  |
| 10   | #5c0011 | 最深文字  |

## 最佳实践

1. **保持一致性**：在同一功能模块中使用相邻的色阶
2. **注意对比度**：确保文字和背景有足够的对比度
3. **语义化使用**：
   - 1-3：背景色
   - 4-6：交互元素
   - 7-10：文字和边框
4. **避免跳跃**：不要在相邻元素间使用跨度太大的色阶

## API 参考

### 获取色板

```typescript
import { useTheme } from '@lee/theme';

const { config } = useTheme();

// 获取完整色板
const primaryPalette = config.value.colors.primaryPalette;

// 获取特定色阶
const lightestColor = primaryPalette?.[1]; // 最浅色
const primaryColor = primaryPalette?.[6]; // 主色
const darkestColor = primaryPalette?.[10]; // 最深色
```

### CSS 变量使用

```css
/* 直接使用 */
.element {
  background: var(--le-primary-3);
  color: var(--le-primary-8);
  border-color: var(--le-primary-5);
}

/* 带回退值 */
.element {
  background: var(--le-primary-1, #e6f4ff);
}
```
