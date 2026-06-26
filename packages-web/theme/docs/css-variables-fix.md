# CSS 变量修复说明

## 问题描述

GlobalHeader 在暗黑模式下字体颜色没有变化

## 问题原因

CSS 变量名称不匹配：

- SCSS 中使用：`var(--le-text-1)`
- CSS 生成器生成：`--le-text-base`

## 解决方案

在 `css-generator.ts` 中添加了常用的 CSS 变量别名：

### 文本颜色别名

```typescript
// 原始变量
--le-text-base
--le-text-secondary
--le-text-tertiary

// 新增别名（更易用）
--le-text-1  → colors.text.base      // 主要文本
--le-text-2  → colors.text.secondary // 次要文本
--le-text-3  → colors.text.tertiary  // 辅助文本
--le-text-invert → colors.text.inverse // 反色文本
```

### 其他常用别名

```typescript
// 边框
--le-border → colors.border.base

// 背景交互状态
--le-hover → colors.bg.hover
--le-pressed → colors.bg.active

// 常用背景
--le-card → colors.neutral.card
--le-popover → colors.neutral.popover
--le-modal → colors.neutral.modal
--le-body → colors.neutral.body
```

## 验证步骤

1. **检查 CSS 变量是否正确生成**

   ```javascript
   // 在浏览器控制台执行
   const styles = getComputedStyle(document.documentElement);
   console.log('text-1:', styles.getPropertyValue('--le-text-1'));
   console.log('text-2:', styles.getPropertyValue('--le-text-2'));
   console.log('text-3:', styles.getPropertyValue('--le-text-3'));
   ```

2. **检查明暗模式下的值**
   - 浅色模式：`--le-text-1` 应该是 `#000000e0` (深色带透明度)
   - 深色模式：`--le-text-1` 应该是 `#ffffffd1` (白色带透明度)

3. **验证 GlobalHeader 样式**
   - 标题文字应该在深色模式下显示为浅色
   - 用户名文字应该在深色模式下显示为浅色

## 测试代码

在组件中测试 CSS 变量：

```vue
<template>
  <div class="test-text">
    <p style="color: var(--le-text-1)">主要文本 text-1</p>
    <p style="color: var(--le-text-2)">次要文本 text-2</p>
    <p style="color: var(--le-text-3)">辅助文本 text-3</p>
    <p style="background: var(--le-primary); color: var(--le-text-invert)">反色文本 text-invert</p>
  </div>
</template>
```

## 影响范围

所有使用以下 CSS 变量的组件都会受益：

- `var(--le-text-1)`
- `var(--le-text-2)`
- `var(--le-text-3)`
- `var(--le-border)`
- `var(--le-hover)`
- `var(--le-pressed)`

这样可以让组件样式更加语义化和易于理解。
