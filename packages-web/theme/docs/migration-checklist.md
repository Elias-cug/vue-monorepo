# 组件明暗模式迁移清单

## 快速迁移步骤

### 1. 审查现有样式文件

查找所有硬编码的颜色值：

```bash
# 查找十六进制颜色
grep -r '#[0-9a-fA-F]\{3,6\}' --include="*.scss" --include="*.css" --include="*.vue"

# 查找 rgb/rgba
grep -r 'rgba\?\(' --include="*.scss" --include="*.css" --include="*.vue"

# 查找颜色关键字
grep -r '\(white\|black\|gray\|grey\)' --include="*.scss" --include="*.css" --include="*.vue"
```

### 2. 颜色映射对照表

| 原始值                                   | 推荐替换                         | 使用场景       |
| ---------------------------------------- | -------------------------------- | -------------- |
| **背景色**                               |
| `#ffffff`, `white`                       | `var(--le-neutral-card)`         | 卡片、容器背景 |
| `#fafafa`, `#f5f5f5`                     | `var(--le-neutral-body)`         | 页面背景       |
| `#f0f0f0`                                | `var(--le-neutral-modal)`        | 弹窗背景       |
| **文本色**                               |
| `#000000`, `black`                       | `var(--le-text-1)`               | 主要文本       |
| `#333333`, `#303133`                     | `var(--le-text-1)`               | 标题文本       |
| `#666666`, `#606266`                     | `var(--le-text-2)`               | 次要文本       |
| `#999999`, `#909399`                     | `var(--le-text-3)`               | 辅助文本       |
| `#c0c4cc`                                | `var(--le-text-disabled)`        | 禁用文本       |
| **边框**                                 |
| `#e5e5e5`, `#e8e8e8`                     | `var(--le-border)`               | 边框           |
| `#dcdfe6`, `#e4e7ed`                     | `var(--le-border)`               | 边框           |
| `#ebeef5`                                | `var(--le-divider)`              | 分割线         |
| **交互色**                               |
| `hover背景`                              | `var(--le-hover)`                | 悬停背景       |
| `active背景`                             | `var(--le-pressed)`              | 按下背景       |
| **阴影**                                 |
| `box-shadow: 0 2px 4px rgba(0,0,0,0.1)`  | `box-shadow: var(--le-shadow-1)` | 轻微阴影       |
| `box-shadow: 0 4px 8px rgba(0,0,0,0.15)` | `box-shadow: var(--le-shadow-2)` | 中等阴影       |
| `box-shadow: 0 8px 16px rgba(0,0,0,0.2)` | `box-shadow: var(--le-shadow-3)` | 深度阴影       |

### 3. GlobalHeader 改造示例

#### 改造前

```scss
.global-header {
  background-color: #fff;
  box-shadow: 0px 2px 4px 0px rgba(53, 63, 94, 0.1);

  .header-title {
    font-size: 24px;
    font-weight: 500;
  }

  .user-name {
    margin-right: 8px;
  }
}
```

#### 改造后

```scss
.global-header {
  // 主题自适应背景和阴影
  background-color: var(--le-neutral-card);
  box-shadow: var(--le-shadow-1);
  transition:
    background-color 0.3s ease,
    box-shadow 0.3s ease;

  .header-title {
    font-size: 24px;
    font-weight: 500;
    color: var(--le-text-1); // 添加主题文本颜色
  }

  .user-name {
    margin-right: 8px;
    color: var(--le-text-1); // 添加主题文本颜色
    font-size: var(--le-font-size-sm); // 使用设计 token
  }

  .user-area {
    padding: 4px 8px;
    border-radius: var(--le-radius-md); // 使用设计 token
    transition: background-color 0.2s ease;

    &:hover {
      background-color: var(--le-hover); // 悬停效果
    }
  }
}
```

### 4. 测试验证清单

- [ ] **基础测试**
  - [ ] 在浅色模式下查看所有页面
  - [ ] 在深色模式下查看所有页面
  - [ ] 快速切换主题，检查过渡效果

- [ ] **主题测试**（12个主题）
  - [ ] Blue 蓝色
  - [ ] Red 红色
  - [ ] Orange 橙色
  - [ ] Green 绿色
  - [ ] Purple 紫色
  - [ ] Magenta 品红
  - [ ] Cyan 青色
  - [ ] Geekblue 极客蓝
  - [ ] Volcano 火山橙
  - [ ] Gold 金色
  - [ ] Yellow 黄色
  - [ ] Lime 青柠

- [ ] **交互状态**
  - [ ] Hover 悬停效果
  - [ ] Active 激活效果
  - [ ] Focus 焦点效果
  - [ ] Disabled 禁用效果

- [ ] **可读性检查**
  - [ ] 文本对比度是否足够
  - [ ] 图标是否清晰可见
  - [ ] 边框是否明显
  - [ ] 交互元素是否易于识别

### 5. 常见问题处理

#### Q: 某些颜色在深色模式下不协调怎么办？

使用 data 属性选择器进行特殊处理：

```scss
// 通常情况，CSS 变量会自动适配
.component {
  background: var(--le-neutral-card);
}

// 特殊情况下的深色模式处理
[data-theme-mode='dark'] {
  .component {
    // 深色模式特殊样式
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

#### Q: 需要使用具体的颜色值怎么办？

如果确实需要使用具体颜色（如品牌色），可以：

1. 定义为 CSS 变量
2. 使用透明度适配

```scss
.brand-element {
  // 定义品牌色
  --brand-color: #ff6600;

  // 浅色模式
  background: var(--brand-color);

  // 深色模式调整透明度
  [data-theme-mode='dark'] & {
    background: color-mix(in srgb, var(--brand-color) 80%, transparent);
  }
}
```

#### Q: 图片在深色模式下太亮怎么办？

```scss
.image-container {
  img {
    transition: filter 0.3s ease;
  }

  [data-theme-mode='dark'] & {
    img {
      // 降低亮度
      filter: brightness(0.8);
    }
  }
}
```

### 6. 性能优化建议

1. **使用 CSS 过渡**

   ```scss
   .component {
     transition:
       background-color 0.3s ease,
       color 0.3s ease,
       border-color 0.3s ease;
   }
   ```

2. **避免过度绘制**
   - 只对需要变化的属性添加过渡
   - 使用 `will-change` 优化关键元素

3. **减少重排**
   - 使用 `transform` 和 `opacity` 做动画
   - 避免改变布局相关属性

### 7. 完成标志

✅ 所有硬编码颜色已替换为 CSS 变量
✅ 所有文本颜色使用主题变量
✅ 交互状态正确响应
✅ 过渡动画流畅
✅ 12个主题测试通过
✅ 明暗模式切换正常
✅ 可读性和对比度良好
