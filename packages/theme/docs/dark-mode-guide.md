# 自定义组件明暗模式支持指南

## 核心原则

### 1. 使用 CSS 变量而非硬编码颜色

```scss
// ❌ 不推荐：硬编码颜色
.header {
  background: #ffffff;
  color: #333333;
  border: 1px solid #e5e5e5;
}

// ✅ 推荐：使用主题 CSS 变量
.header {
  background: var(--le-neutral-card);
  color: var(--le-text-1);
  border: 1px solid var(--le-border);
}
```

### 2. 利用 data 属性选择器

主题系统会在根元素上设置 `data-theme` 和 `data-theme-mode` 属性：

```scss
// 针对特定主题的样式
[data-theme='blue'] .header {
  // 蓝色主题特有样式
}

// 针对明暗模式的样式
[data-theme-mode='dark'] .header {
  // 深色模式特有样式（通常不需要，CSS 变量会自动适配）
}
```

### 3. 语义化颜色命名

使用语义化的颜色变量，而非具体颜色：

```scss
// ❌ 不推荐
.card {
  background: var(--le-gray-100); // 具体颜色
}

// ✅ 推荐
.card {
  background: var(--le-neutral-card); // 语义化命名
}
```

## 常用 CSS 变量映射

### 背景色

- **页面背景**: `var(--le-neutral-body)`
- **卡片背景**: `var(--le-neutral-card)`
- **弹窗背景**: `var(--le-neutral-modal)`
- **气泡背景**: `var(--le-neutral-popover)`
- **表格背景**: `var(--le-table)`

### 文本颜色

- **主要文本**: `var(--le-text-1)`
- **次要文本**: `var(--le-text-2)`
- **辅助文本**: `var(--le-text-3)`
- **禁用文本**: `var(--le-text-disabled)`

### 边框和分割线

- **边框**: `var(--le-border)`
- **分割线**: `var(--le-divider)`

### 交互状态

- **悬停背景**: `var(--le-hover)`
- **按下背景**: `var(--le-pressed)`
- **选中背景**: `var(--le-primary)`

### 阴影

- **轻微阴影**: `var(--le-shadow-1)`
- **中等阴影**: `var(--le-shadow-2)`
- **深度阴影**: `var(--le-shadow-3)`

## 实践示例

### 1. 卡片组件

```scss
.custom-card {
  // 背景和边框
  background: var(--le-neutral-card);
  border: 1px solid var(--le-border);
  border-radius: var(--le-radius-lg);

  // 阴影
  box-shadow: var(--le-shadow-1);

  // 文本
  color: var(--le-text-1);

  // 交互效果
  transition: all 0.3s ease;

  &:hover {
    box-shadow: var(--le-shadow-2);
    border-color: var(--le-primary);
  }

  .card-title {
    color: var(--le-text-1);
    font-size: var(--le-font-size-lg);
  }

  .card-description {
    color: var(--le-text-2);
    font-size: var(--le-font-size-sm);
  }
}
```

### 2. 按钮组件

```scss
.custom-button {
  // 主按钮
  &.primary {
    background: var(--le-primary);
    color: var(--le-text-invert);
    border: none;

    &:hover {
      background: var(--le-primary-hover);
    }

    &:active {
      background: var(--le-primary-active);
    }
  }

  // 默认按钮
  &.default {
    background: var(--le-neutral-card);
    color: var(--le-text-1);
    border: 1px solid var(--le-border);

    &:hover {
      background: var(--le-hover);
      border-color: var(--le-primary);
    }
  }
}
```

### 3. 表单组件

```scss
.custom-input {
  background: var(--le-neutral-card);
  border: 1px solid var(--le-border);
  color: var(--le-text-1);

  &::placeholder {
    color: var(--le-text-3);
  }

  &:focus {
    border-color: var(--le-primary);
    box-shadow: 0 0 0 2px var(--le-primary-suppl);
  }

  &:disabled {
    background: var(--le-neutral-body);
    color: var(--le-text-disabled);
    cursor: not-allowed;
  }
}
```

## Vue 组件中的使用

### 1. 在 Script 中获取 CSS 变量

```vue
<script setup lang="ts">
import { useTheme } from '@lee/theme';

const { getCssVar } = useTheme();

// 获取 CSS 变量值
const primaryColor = getCssVar('primary');

// 动态样式
const dynamicStyle = computed(() => ({
  borderColor: getCssVar('primary'),
  backgroundColor: getCssVar('neutral-card'),
}));
</script>
```

### 2. 响应式监听主题变化

```vue
<script setup lang="ts">
import { useTheme } from '@lee/theme';

const { mode, theme } = useTheme();

// 监听模式变化
watch(mode, newMode => {
  if (newMode === 'dark') {
    // 深色模式特殊处理
  }
});

// 监听主题变化
watch(theme, newTheme => {
  console.log('主题切换到:', newTheme);
});
</script>
```

### 3. 条件渲染

```vue
<template>
  <div class="container">
    <!-- 根据模式显示不同图标 -->
    <Icon v-if="mode === 'dark'" name="moon" />
    <Icon v-else name="sun" />

    <!-- 根据主题显示不同内容 -->
    <div v-if="theme === 'blue'" class="theme-specific">蓝色主题特有内容</div>
  </div>
</template>

<script setup lang="ts">
import { useTheme } from '@lee/theme';
const { mode, theme } = useTheme();
</script>
```

## 最佳实践清单

### ✅ DO（推荐做法）

1. **始终使用 CSS 变量** - 所有颜色值都应该使用 `--le-*` 变量
2. **语义化命名** - 使用 `neutral-card` 而非 `white` 或 `#ffffff`
3. **渐进增强** - 先实现基础样式，再添加主题特定样式
4. **保持一致性** - 同类元素使用相同的变量
5. **测试所有主题** - 确保在所有 12 个主题的明暗模式下都正常显示

### ❌ DON'T（避免做法）

1. **不要硬编码颜色** - 避免 `#ffffff`、`rgba(0,0,0,0.5)` 等
2. **不要假设颜色** - 不要假设背景一定是白色或黑色
3. **不要混用系统** - 要么全部用 CSS 变量，要么不用
4. **不要忽略对比度** - 确保文本在所有主题下都可读
5. **不要过度定制** - 让主题系统处理大部分样式

## 迁移指南

### 第一步：识别硬编码颜色

```scss
// 查找所有硬编码颜色
// 搜索模式: #[0-9a-fA-F]{3,6}|rgba?\(|hsl\(
```

### 第二步：映射到 CSS 变量

| 原始值               | 建议替换                 |
| -------------------- | ------------------------ |
| `#ffffff`, `white`   | `var(--le-neutral-card)` |
| `#000000`, `black`   | `var(--le-text-1)`       |
| `#f5f5f5`, `#fafafa` | `var(--le-neutral-body)` |
| `#e5e5e5`, `#e8e8e8` | `var(--le-border)`       |
| `#333333`            | `var(--le-text-1)`       |
| `#666666`            | `var(--le-text-2)`       |
| `#999999`            | `var(--le-text-3)`       |
| `rgba(0,0,0,0.1)`    | `var(--le-divider)`      |
| `rgba(0,0,0,0.05)`   | `var(--le-hover)`        |

### 第三步：测试验证

1. 切换所有 12 个主题
2. 切换明暗模式
3. 检查对比度和可读性
4. 验证交互状态（hover、active、focus）
