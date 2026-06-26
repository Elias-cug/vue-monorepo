# Tabs 组件主题化设计

## 设计理念

Tabs 组件采用分层的色阶设计，通过不同深度的主题色创建视觉层次：

- **整体背景**：使用最浅的色阶，作为基础层
- **交互状态**：渐进式加深，提供清晰的视觉反馈
- **激活状态**：使用对比色，突出当前选中项

## 色阶分配

### 主体结构

| 元素     | CSS 变量              | 色阶   | 说明               |
| -------- | --------------------- | ------ | ------------------ |
| 整体背景 | `var(--le-primary-1)` | 色阶 1 | 最浅的主题色背景   |
| Tab 默认 | `transparent`         | 透明   | 与整体背景融为一体 |
| Tab 悬停 | `var(--le-primary-2)` | 色阶 2 | 轻微加深，提供反馈 |
| Tab 激活 | `var(--le-card)`      | 卡片色 | 明显对比，突出选中 |
| 底部边框 | `var(--le-primary)`   | 主色   | 激活标识线         |

### 文字颜色

| 状态 | CSS 变量            | 说明       |
| ---- | ------------------- | ---------- |
| 默认 | `var(--le-text-2)`  | 次要文字色 |
| 悬停 | `var(--le-text-1)`  | 主要文字色 |
| 激活 | `var(--le-primary)` | 主题色     |

### 关闭按钮

| 状态 | 样式                                 | 说明     |
| ---- | ------------------------------------ | -------- |
| 默认 | `opacity: 0.6`                       | 弱化显示 |
| 悬停 | `opacity: 1, color: var(--le-error)` | 红色警示 |

## 右键菜单

### 背景与边框

| 属性   | CSS 变量                     | 说明       |
| ------ | ---------------------------- | ---------- |
| 背景色 | `var(--le-popover)`          | 弹出层背景 |
| 边框   | `1px solid var(--le-border)` | 增强对比度 |
| 阴影   | `var(--le-shadow-2)`         | 中等阴影   |
| 圆角   | `var(--le-radius-lg)`        | 大圆角     |

### 菜单项状态

| 状态 | 背景色              | 文字色                    |
| ---- | ------------------- | ------------------------- |
| 默认 | 透明                | `var(--le-text-1)`        |
| 悬停 | `var(--le-hover)`   | `var(--le-primary)`       |
| 按下 | `var(--le-pressed)` | -                         |
| 禁用 | 透明                | `var(--le-text-disabled)` |

## 滚动容器

### 箭头按钮

| 元素     | CSS 变量              | 说明             |
| -------- | --------------------- | ---------------- |
| 背景     | `var(--le-primary-1)` | 与 tabs 整体一致 |
| 悬停背景 | `var(--le-primary-2)` | 色阶 2           |
| 按下背景 | `var(--le-primary-3)` | 色阶 3           |
| 边框     | `var(--le-primary-3)` | 色阶 3 边框      |
| 图标默认 | `var(--le-text-2)`    | 次要文字色       |
| 图标悬停 | `var(--le-primary)`   | 主题色           |
| 禁用状态 | `opacity: 0.4`        | 降低透明度       |

## SCSS 实现

```scss
// GlobalTabs/index.scss
.global-tabs {
  background-color: var(--le-primary-1);
  box-shadow: var(--le-shadow-1);
  transition: background-color 0.3s ease;

  .global-tabs-item {
    color: var(--le-text-2);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;

    &:hover:not(.active) {
      background-color: var(--le-primary-2);
      color: var(--le-text-1);
    }

    &.active {
      background-color: var(--le-card);
      color: var(--le-primary);
      border-bottom-color: var(--le-primary);
      box-shadow: var(--le-shadow-1);
    }
  }
}
```

## 主题效果示例

### 蓝色主题

- 整体背景：#e6f4ff（色阶 1）
- 悬停背景：#bae0ff（色阶 2）
- 激活背景：白色/深色卡片
- 激活边框：#1677ff（主色）

### 红色主题

- 整体背景：#fff1f0（色阶 1）
- 悬停背景：#ffccc7（色阶 2）
- 激活背景：白色/深色卡片
- 激活边框：#f5222d（主色）

### 绿色主题

- 整体背景：#f6ffed（色阶 1）
- 悬停背景：#d9f7be（色阶 2）
- 激活背景：白色/深色卡片
- 激活边框：#52c41a（主色）

## 暗黑模式适配

在暗黑模式下，CSS 变量会自动切换：

- `--le-card`：从白色变为深色卡片背景
- `--le-text-1/2`：从深色变为浅色文字
- `--le-primary-1/2/3`：自动调整为暗色版本的色阶
- `--le-popover`：从白色变为深色弹出背景

## 优势

1. **视觉层次清晰**
   - 通过色阶递进创建自然的层次感
   - 激活态使用对比色突出重点

2. **交互反馈明确**
   - 悬停、激活、按下等状态区分明显
   - 过渡动画流畅自然

3. **主题一致性**
   - 与整体主题系统无缝集成
   - 切换主题时自动适配

4. **可访问性**
   - 文字对比度符合 WCAG 标准
   - 禁用状态明确标识

## 使用建议

1. **色阶选择原则**
   - 背景：1-3 色阶
   - 边框：3-4 色阶
   - 强调：主色（色阶 6）

2. **状态设计原则**
   - 默认态：融入背景
   - 悬停态：轻微强调
   - 激活态：明显区分

3. **动画原则**
   - 使用 0.2s 过渡时间
   - 背景、颜色、阴影都添加过渡
   - 避免突兀的视觉跳跃
