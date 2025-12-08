<template>
  <LeCard title="🎯 CSS 变量系统" :bordered="false">
    <n-tabs type="line" animated>
      <n-tab-pane name="colors" tab="颜色变量">
        <n-h4>主题色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="i in 10" :key="`primary-${i}`">
            <ColorDisplay
              :name="`--le-primary-${i}`"
              :value="getCssVar(`--le-primary-${i}`)"
              :label="`色阶 ${i}`"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>文本色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="text in textColors" :key="text.name">
            <ColorDisplay :name="text.name" :value="getCssVar(text.name)" :label="text.label" />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>背景色</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="5">
          <n-grid-item v-for="bg in bgColors" :key="bg.name">
            <ColorDisplay :name="bg.name" :value="getCssVar(bg.name)" :label="bg.label" />
          </n-grid-item>
        </n-grid>
      </n-tab-pane>

      <n-tab-pane name="design" tab="设计变量">
        <n-h4>圆角系统</n-h4>
        <n-grid :x-gap="12" :y-gap="12" :cols="7">
          <n-grid-item v-for="radius in radiusList" :key="radius">
            <DesignToken
              type="radius"
              :name="`--le-radius-${radius}`"
              :value="getCssVar(`--le-radius-${radius}`)"
              :label="radius"
            />
          </n-grid-item>
        </n-grid>

        <n-divider />
        <n-h4>阴影系统</n-h4>
        <n-space direction="vertical" size="large" style="width: 100%">
          <div v-for="shadow in shadowList" :key="shadow" class="shadow-demo">
            <div class="shadow-box" :style="{ boxShadow: getCssVar(`--le-shadow-${shadow}`) }">
              <n-text code>--le-shadow-{{ shadow }}</n-text>
            </div>
          </div>
        </n-space>
      </n-tab-pane>

      <n-tab-pane name="all" tab="所有变量">
        <n-input
          v-model:value="cssVarSearch"
          placeholder="搜索 CSS 变量..."
          clearable
          style="margin-bottom: 16px"
        >
          <template #prefix>
            <n-icon :component="SearchOutline" />
          </template>
        </n-input>
        <n-table :columns="cssVarColumns" :data="filteredCssVars" />
      </n-tab-pane>
    </n-tabs>
  </LeCard>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, h } from 'vue';
import {
  NTabs,
  NTabPane,
  NH4,
  NGrid,
  NGridItem,
  NDivider,
  NSpace,
  NText,
  NTable,
  NInput,
  NIcon,
} from 'naive-ui';
import { SearchOutline } from '@vicons/ionicons5';
import { Card as LeCard } from '@lee/ui';
import ColorDisplay from './ColorDisplay.vue';
import DesignToken from './DesignToken.vue';

const cssVarSearch = ref('');

// 颜色配置
const textColors = [
  { name: '--le-text-1', label: '主要文本' },
  { name: '--le-text-2', label: '次要文本' },
  { name: '--le-text-3', label: '辅助文本' },
  { name: '--le-text-disabled', label: '禁用文本' },
  { name: '--le-text-invert', label: '反色文本' },
];

const bgColors = [
  { name: '--le-card', label: '卡片背景' },
  { name: '--le-neutral-body', label: '页面背景' },
  { name: '--le-hover', label: '悬停背景' },
  { name: '--le-pressed', label: '按下背景' },
  { name: '--le-sider-bg', label: '侧边栏背景' },
];

// 设计 token 列表
const radiusList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', 'round'];
const shadowList = ['xs', 'sm', 'md', 'lg', 'xl', 'xxl', '1', '2', '3'];

// CSS 变量表格
const cssVarColumns = [
  { title: '变量名', key: 'name' },
  {
    title: '值',
    key: 'value',
    render: (row: any) => {
      if (row.name.includes('color') || row.name.includes('primary') || row.name.includes('text')) {
        return h(
          'div',
          {
            style: {
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            },
          },
          [
            h('div', {
              style: {
                width: '24px',
                height: '24px',
                borderRadius: '4px',
                background: row.value,
                border: '1px solid #e0e0e0',
              },
            }),
            h('span', row.value),
          ]
        );
      }
      return row.value;
    },
  },
  { title: '分类', key: 'category' },
];

// 获取 CSS 变量
function getCssVar(name: string) {
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

// 获取所有 CSS 变量
const allCssVars = ref<any[]>([]);

onMounted(() => {
  const styles = getComputedStyle(document.documentElement);
  const vars: any[] = [];

  for (let i = 0; i < styles.length; i++) {
    const prop = styles[i];
    if (prop?.startsWith('--le-')) {
      const value = styles.getPropertyValue(prop);
      let category = '其他';

      if (prop.includes('primary')) category = '主题色';
      else if (prop.includes('text')) category = '文本色';
      else if (prop.includes('bg') || prop.includes('background')) category = '背景色';
      else if (prop.includes('border')) category = '边框';
      else if (prop.includes('shadow')) category = '阴影';
      else if (prop.includes('radius')) category = '圆角';
      else if (prop.includes('spacing')) category = '间距';

      vars.push({
        name: prop,
        value: value.trim(),
        category,
      });
    }
  }

  allCssVars.value = vars;
});

// 过滤 CSS 变量
const filteredCssVars = computed(() => {
  if (!cssVarSearch.value) return allCssVars.value;

  const search = cssVarSearch.value.toLowerCase();
  return allCssVars.value.filter(
    v =>
      v.name.toLowerCase().includes(search) ||
      v.value.toLowerCase().includes(search) ||
      v.category.toLowerCase().includes(search)
  );
});
</script>

<style lang="scss" scoped>
.shadow-demo {
  .shadow-box {
    padding: 24px;
    background: var(--le-card);
    border-radius: var(--le-radius-lg);
    text-align: center;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
    }
  }
}
</style>
