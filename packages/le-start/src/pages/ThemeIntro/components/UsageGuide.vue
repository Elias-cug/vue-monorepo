<template>
  <LeCard title="📚 使用指南" :bordered="false">
    <n-collapse>
      <n-collapse-item title="如何在项目中使用主题系统" name="1">
        <n-space direction="vertical">
          <n-text>1. 安装 @lee/theme 包</n-text>
          <n-code code="pnpm add @lee/theme" language="bash" />

          <n-text>2. 在 App.vue 中引入 useTheme 并初始化</n-text>
          <n-code :code="appInitCode" language="vue" />

          <n-text>3. 使用 CSS 变量或主题化组件</n-text>
          <n-code :code="cssVarUsageCode" language="scss" />

          <n-text>4. 可选：配置主题切换器组件</n-text>
          <n-code :code="themeSwitcherCode" language="vue" />
        </n-space>
      </n-collapse-item>

      <n-collapse-item title="如何自定义主题" name="2">
        <n-space direction="vertical">
          <n-text>主题系统支持自定义主题预设，你可以：</n-text>
          <n-text>1. 定义自己的色板（10 个色阶）</n-text>
          <n-text>2. 创建主题预设对象</n-text>
          <n-text>3. 注册到主题管理器</n-text>
          <n-code :code="customThemeCode" language="typescript" />
        </n-space>
      </n-collapse-item>

      <n-collapse-item title="CSS 变量最佳实践" name="3">
        <n-space direction="vertical">
          <n-text strong>✅ 推荐做法：</n-text>
          <ul>
            <li>优先使用语义化的 CSS 变量（如 --le-text-1 而非具体颜色）</li>
            <li>利用色阶系统创建视觉层次（1-10 递进）</li>
            <li>使用设计 token 保持一致性（间距、圆角、阴影）</li>
            <li>组合使用多个阴影创建特殊效果</li>
          </ul>

          <n-text strong>❌ 避免做法：</n-text>
          <ul>
            <li>硬编码颜色值（#fff, rgba(0,0,0,0.1)）</li>
            <li>使用不存在的变量（如 --le-primary-rgb）</li>
            <li>混用不同的设计体系</li>
          </ul>

          <n-code :code="bestPracticesCode" language="scss" />
        </n-space>
      </n-collapse-item>

      <n-collapse-item title="主题持久化" name="4">
        <n-space direction="vertical">
          <n-text>主题系统自动将用户选择保存到 localStorage：</n-text>
          <n-descriptions :column="1" bordered size="small">
            <n-descriptions-item label="主题键名">
              <n-text code>app-theme</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="模式键名">
              <n-text code>app-mode</n-text>
            </n-descriptions-item>
            <n-descriptions-item label="存储格式">JSON 字符串</n-descriptions-item>
          </n-descriptions>

          <n-text>你也可以手动管理持久化：</n-text>
          <n-code :code="persistenceCode" language="typescript" />
        </n-space>
      </n-collapse-item>

      <n-collapse-item title="常见问题" name="5">
        <n-space direction="vertical">
          <n-text strong>Q: 主题切换后没有立即生效？</n-text>
          <n-text>A: 确保使用了响应式引用，不要解构 useTheme 的返回值。</n-text>

          <n-text strong>Q: 暗黑模式下颜色不对？</n-text>
          <n-text>A: 检查是否使用了硬编码颜色，应该使用 CSS 变量。</n-text>

          <n-text strong>Q: 如何支持更多主题？</n-text>
          <n-text>A: 参考现有主题预设，创建新的主题配置并注册。</n-text>

          <n-text strong>Q: CSS 变量在 TypeScript 中没有类型提示？</n-text>
          <n-text>A: 可以创建类型定义文件声明 CSS 变量。</n-text>
        </n-space>
      </n-collapse-item>
    </n-collapse>
  </LeCard>
</template>

<script setup lang="ts">
import {
  NCollapse,
  NCollapseItem,
  NSpace,
  NText,
  NCode,
  NDescriptions,
  NDescriptionsItem,
} from 'naive-ui';
import { Card as LeCard } from '@lee/ui';

const appInitCode = `<template>
  <n-config-provider :theme="naiveTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <router-view />
    </n-message-provider>
  </n-config-provider>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useTheme, createNaiveTheme } from '@lee/theme';
import { lightTheme, darkTheme } from 'naive-ui';

const { config, mode, initTheme } = useTheme();

onMounted(() => {
  initTheme();
});

const naiveTheme = computed(() => 
  mode.value === 'dark' ? darkTheme : lightTheme
);

const themeOverrides = computed(() => 
  createNaiveTheme(config.value)
);
<\/script>`;

const cssVarUsageCode = `.my-component {
  /* 使用主题色 */
  color: var(--le-primary);
  background: var(--le-primary-1);
  border: 1px solid var(--le-primary-3);
  
  /* 使用文本色 */
  .title {
    color: var(--le-text-1);
  }
  
  .description {
    color: var(--le-text-2);
  }
  
  /* 使用设计 token */
  padding: var(--le-spacing-md);
  border-radius: var(--le-radius-lg);
  box-shadow: var(--le-shadow-1);
  
  &:hover {
    box-shadow: var(--le-shadow-2);
    transform: translateY(-2px);
  }
}`;

const themeSwitcherCode = `<template>
  <div class="theme-switcher">
    <n-select 
      v-model:value="theme" 
      :options="themeOptions"
      @update:value="setTheme"
    />
    <n-switch 
      v-model:value="isDark"
      @update:value="handleModeChange"
    />
  </div>
</template>

<script setup>
import { useTheme, themePresets } from '@lee/theme';

const { theme, mode, setTheme, setMode } = useTheme();

const isDark = computed({
  get: () => mode.value === 'dark',
  set: (val) => setMode(val ? 'dark' : 'light')
});
<\/script>`;

const customThemeCode = `// 1. 定义色板
const purpleColors = [
  '#faf5ff', // 1
  '#f3e8ff', // 2
  '#e9d5ff', // 3
  '#d8b4fe', // 4
  '#c084fc', // 5
  '#a855f7', // 6 - 主色
  '#9333ea', // 7
  '#7e22ce', // 8
  '#6b21a8', // 9
  '#581c87', // 10
];

// 2. 创建主题预设
const purpleTheme = {
  name: 'purple',
  label: '紫色',
  primaryColor: '#a855f7',
  light: generateColorSystem(purpleColors, false),
  dark: generateColorSystem(purpleColors, true),
};

// 3. 注册主题
themeManager.registerTheme(purpleTheme);`;

const bestPracticesCode = `/* ✅ 好的实践 */
.card {
  background: var(--le-card);
  border: 1px solid var(--le-border);
  box-shadow: var(--le-shadow-1);
  
  &:hover {
    box-shadow: var(--le-shadow-2);
  }
  
  &.selected {
    /* 组合阴影创建光晕效果 */
    box-shadow: var(--le-shadow-1), 0 0 0 3px var(--le-primary-1);
  }
}

/* ❌ 避免的实践 */
.card {
  background: #ffffff; /* 硬编码颜色 */
  border: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  
  /* 不存在的变量 */
  color: rgba(var(--le-primary-rgb), 0.5);
}`;

const persistenceCode = `import { useTheme } from '@lee/theme';

const { theme, mode, setTheme, setMode } = useTheme();

// 手动保存
function saveThemePreference() {
  localStorage.setItem('custom-theme', theme.value);
  localStorage.setItem('custom-mode', mode.value);
}

// 手动恢复
function loadThemePreference() {
  const savedTheme = localStorage.getItem('custom-theme');
  const savedMode = localStorage.getItem('custom-mode');
  
  if (savedTheme) setTheme(savedTheme);
  if (savedMode) setMode(savedMode);
}`;
</script>

<style lang="scss" scoped>
ul {
  margin: 8px 0;
  padding-left: 20px;
  color: var(--le-text-2);

  li {
    margin: 4px 0;
  }
}
</style>
