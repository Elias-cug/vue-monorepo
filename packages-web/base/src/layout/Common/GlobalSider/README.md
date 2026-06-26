# GlobalSider 侧边栏组件

## 主题配置说明

由于侧边栏使用深色背景（主题色），菜单需要使用白色文字以保证可读性。

### 使用方式

在 GlobalSider 组件中使用专门的侧边栏菜单主题：

```vue
<template>
  <div class="global-sider">
    <n-config-provider :theme-overrides="menuThemeOverrides">
      <n-menu :options="menuOptions" :value="activeKey" @update:value="handleMenuChange" />
    </n-config-provider>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { NConfigProvider, NMenu } from 'naive-ui';
import { createSidebarMenuTheme } from '@lee/theme';

// 使用侧边栏专用的菜单主题（白色文字）
const menuThemeOverrides = computed(() => ({
  Menu: createSidebarMenuTheme(),
}));
</script>

<style lang="scss" scoped>
.global-sider {
  background-color: var(--le-primary); // 使用主题色作为背景
}
</style>
```

### 主题特点

1. **文字颜色**：无论明暗模式，都使用白色文字
   - 普通状态：`rgba(255, 255, 255, 0.82)`
   - 悬停状态：`#ffffff`
   - 激活状态：`#ffffff`

2. **背景色**：白色半透明
   - 悬停：`rgba(255, 255, 255, 0.1)`
   - 激活：`rgba(255, 255, 255, 0.15)`
   - 激活+悬停：`rgba(255, 255, 255, 0.2)`

3. **其他元素**
   - 箭头：白色带透明度
   - 分组标题：`rgba(255, 255, 255, 0.5)`

### 对比普通菜单

普通菜单（非侧边栏）应该使用 `createDefaultMenuTheme`，它会根据明暗模式自动调整颜色：

```typescript
import { createDefaultMenuTheme } from '@lee/theme';

// 普通菜单主题（会根据明暗模式自适应）
const menuThemeOverrides = computed(() => ({
  Menu: createDefaultMenuTheme(config.colors, mode === 'dark'),
}));
```
