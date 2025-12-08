# 测试主题响应式更新

## 快速测试步骤

1. **启动项目**

   ```bash
   pnpm run start:le-start
   ```

2. **打开浏览器开发工具**
   - 打开 Elements/检查器
   - 找到 `<html>` 元素
   - 查看其 `style` 属性中的 CSS 变量

3. **测试主题切换**
   - 点击头部的主题设置按钮（调色板图标）
   - 选择不同的主题色（如从蓝色切换到红色）
4. **验证立即生效**
   - ✅ **CSS 变量立即更新**：`--le-primary` 从 `#1677FF` 变为 `#F5222D`
   - ✅ **按钮颜色立即变化**：所有主按钮从蓝色变为红色
   - ✅ **无需刷新页面**

5. **测试明暗模式**
   - 点击深色模式开关
   - 验证：
     - ✅ 背景立即变暗
     - ✅ 文字颜色立即变亮
     - ✅ Naive UI 组件样式立即适配

## 预期效果

### 主题切换

```css
/* 切换前（蓝色主题）*/
:root {
  --le-primary: #1677ff;
  --le-primary-hover: #4096ff;
}

/* 切换后（红色主题）- 立即生效 */
:root {
  --le-primary: #f5222d;
  --le-primary-hover: #ff4d4f;
}
```

### 明暗模式切换

- `data-theme-mode` 属性立即从 `light` 变为 `dark`
- 所有使用 CSS 变量的组件立即响应变化
- Naive UI 组件自动切换到深色样式

## 故障排查

如果主题没有立即生效：

1. **检查控制台错误**
   - 查看是否有 TypeScript 类型错误
   - 查看是否有运行时错误

2. **检查 useTheme 返回值**

   ```javascript
   // 在组件中打印
   const { theme, mode, config } = useTheme();
   console.log('theme is ref?', isRef(theme)); // 应该是 true
   ```

3. **检查 computed 依赖**
   - 确保 `themeOverrides` 依赖了 `config.value`
   - 确保 `naiveTheme` 依赖了 `mode.value`

## 成功标志

- [x] 主题色切换无需刷新
- [x] 明暗模式切换立即生效
- [x] CSS 变量实时更新
- [x] Naive UI 组件同步更新
- [x] 页面所有使用主题变量的元素都响应变化
