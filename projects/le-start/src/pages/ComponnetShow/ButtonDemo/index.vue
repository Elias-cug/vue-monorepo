<template>
  <LeContainer padding="24px">
    <div class="demo-section">
      <LeCard title="基础用法">
        <p class="mb-2 text-sm text-gray-500">LeButton 完全透传 NButton 的 props 和 events</p>
        <div class="flex gap-4 flex-wrap">
          <LeButton type="primary">Primary</LeButton>
          <LeButton type="info">Info</LeButton>
          <LeButton type="success">Success</LeButton>
          <LeButton type="warning">Warning</LeButton>
          <LeButton type="error">Error</LeButton>
          <LeButton>Default</LeButton>
        </div>
      </LeCard>

      <LeCard title="带图标按钮">
        <p class="mb-2 text-sm text-gray-500">通过 icon-name 属性使用 SvgIcon 渲染图标</p>
        <div class="flex gap-4 flex-wrap">
          <LeButton type="primary" icon-name="custom-menu-home">首页</LeButton>
          <LeButton type="success" icon-name="custom-menu-code">代码</LeButton>
          <LeButton type="warning" icon-name="custom-menu-theme">主题</LeButton>
          <LeButton type="info" icon-name="custom-search" circle />
        </div>
      </LeCard>

      <LeCard title="图标大小和颜色">
        <p class="mb-2 text-sm text-gray-500">通过 icon-size 和 icon-color 自定义图标样式</p>
        <div class="flex gap-4 flex-wrap items-center">
          <LeButton type="primary" icon-name="custom-menu-home" icon-size="12px">小图标</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" icon-size="1.2em">默认</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" icon-size="20px">大图标</LeButton>
          <LeButton icon-name="custom-menu-home" icon-color="#f5222d">自定义颜色</LeButton>
        </div>
      </LeCard>

      <LeCard title="Loading 状态">
        <p class="mb-2 text-sm text-gray-500">Loading 时原始 loading 图标会替代自定义图标</p>
        <div class="flex gap-4 flex-wrap">
          <LeButton
            type="primary"
            :loading="loading1"
            icon-name="custom-menu-home"
            @click="handleClick1"
          >
            点击加载
          </LeButton>
          <LeButton type="success" :loading="loading2" @click="handleClick2">无图标加载</LeButton>
          <LeButton type="warning" loading icon-name="custom-menu-code">始终 Loading</LeButton>
        </div>
      </LeCard>

      <LeCard title="不同尺寸">
        <div class="flex gap-4 flex-wrap items-center">
          <LeButton type="primary" size="tiny" icon-name="custom-menu-home">Tiny</LeButton>
          <LeButton type="primary" size="small" icon-name="custom-menu-home">Small</LeButton>
          <LeButton type="primary" size="medium" icon-name="custom-menu-home">Medium</LeButton>
          <LeButton type="primary" size="large" icon-name="custom-menu-home">Large</LeButton>
        </div>
      </LeCard>

      <LeCard title="按钮变体">
        <div class="flex gap-4 flex-wrap">
          <LeButton type="primary" icon-name="custom-menu-home">默认</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" secondary>Secondary</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" tertiary>Tertiary</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" quaternary>Quaternary</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" dashed>Dashed</LeButton>
          <LeButton type="primary" icon-name="custom-menu-home" text>Text</LeButton>
        </div>
      </LeCard>

      <LeCard title="禁用状态">
        <div class="flex gap-4 flex-wrap">
          <LeButton type="primary" disabled icon-name="custom-menu-home">禁用按钮</LeButton>
          <LeButton type="success" disabled>禁用按钮</LeButton>
        </div>
      </LeCard>

      <LeCard title="事件透传">
        <p class="mb-2 text-sm text-gray-500">所有 NButton 事件均可正常使用</p>
        <LeButton type="primary" icon-name="custom-menu-home" @click="handleEvent">
          点击触发事件
        </LeButton>
      </LeCard>
    </div>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useMessage } from 'naive-ui';

const message = useMessage();

const loading1 = ref(false);
const loading2 = ref(false);

function handleClick1() {
  loading1.value = true;
  setTimeout(() => {
    loading1.value = false;
    message.success('加载完成');
  }, 2000);
}

function handleClick2() {
  loading2.value = true;
  setTimeout(() => {
    loading2.value = false;
    message.success('加载完成');
  }, 2000);
}

function handleEvent() {
  message.info('按钮被点击了');
}
</script>

<style lang="scss" scoped>
.demo-section {
  @apply flex flex-col gap-4;
}
</style>
