<!--
 * @Description: LeLeftRightLayout 左右布局组件示例页面
-->
<template>
  <LeContainer overflow="auto">
    <n-space vertical :size="24">
      <!-- 基础用法 -->
      <LeCard title="基础用法" padding="24px">
        <div class="demo-layout-wrapper">
          <LeLeftRightLayout>
            <template #left>
              <div class="demo-panel">
                <h3>左侧面板</h3>
                <p>默认宽度 240px</p>
                <n-menu :options="menuOptions" />
              </div>
            </template>
            <template #right>
              <div class="demo-panel">
                <h3>右侧内容区</h3>
                <p>自动撑开剩余宽度，点击中间按钮可以收起/展开左侧面板</p>
                <n-space vertical :size="16">
                  <n-skeleton text :repeat="5" />
                </n-space>
              </div>
            </template>
          </LeLeftRightLayout>
        </div>
      </LeCard>

      <!-- 自定义宽度 -->
      <LeCard title="自定义左侧宽度" padding="24px">
        <div class="demo-layout-wrapper">
          <LeLeftRightLayout :left-width="320" :gap="24">
            <template #left>
              <div class="demo-panel demo-panel--primary">
                <h3>宽度 320px</h3>
                <p>间隔 24px</p>
                <n-tree :data="treeData" block-line />
              </div>
            </template>
            <template #right>
              <div class="demo-panel">
                <h3>内容区域</h3>
                <n-grid :cols="2" :x-gap="12" :y-gap="12">
                  <n-grid-item v-for="i in 4" :key="i">
                    <div class="demo-grid-item">Grid Item {{ i }}</div>
                  </n-grid-item>
                </n-grid>
              </div>
            </template>
          </LeLeftRightLayout>
        </div>
      </LeCard>

      <!-- 默认收起 -->
      <LeCard title="默认收起状态" padding="24px">
        <div class="demo-layout-wrapper">
          <LeLeftRightLayout default-collapsed @collapse="onCollapse" @expand="onExpand">
            <template #left>
              <div class="demo-panel demo-panel--success">
                <h3>左侧面板</h3>
                <p>默认收起，点击按钮展开</p>
                <n-list>
                  <n-list-item v-for="i in 3" :key="i">
                    列表项 {{ i }}
                  </n-list-item>
                </n-list>
              </div>
            </template>
            <template #right>
              <div class="demo-panel">
                <h3>内容区域</h3>
                <n-alert type="info" title="提示">
                  当前左侧面板状态: {{ collapseStatus }}
                </n-alert>
              </div>
            </template>
          </LeLeftRightLayout>
        </div>
      </LeCard>

      <!-- 使用场景示例 -->
      <LeCard title="典型使用场景：文件管理器" padding="0">
        <div class="demo-layout-wrapper demo-layout-wrapper--large">
          <LeLeftRightLayout :left-width="280">
            <template #left>
              <div class="file-tree">
                <div class="file-tree__header">
                  <LeSvgIcon name="ui-menu" :size="16" />
                  <span>文件资源管理器</span>
                </div>
                <n-tree 
                  :data="fileTreeData" 
                  block-line 
                  :default-expanded-keys="['root']"
                  selectable
                />
              </div>
            </template>
            <template #right>
              <div class="file-content">
                <div class="file-content__header">
                  <n-breadcrumb>
                    <n-breadcrumb-item>根目录</n-breadcrumb-item>
                    <n-breadcrumb-item>src</n-breadcrumb-item>
                    <n-breadcrumb-item>components</n-breadcrumb-item>
                  </n-breadcrumb>
                </div>
                <div class="file-content__body">
                  <n-grid :cols="4" :x-gap="16" :y-gap="16">
                    <n-grid-item v-for="file in files" :key="file.name">
                      <div class="file-item">
                        <LeSvgIcon :name="file.icon" :size="32" />
                        <span class="file-item__name">{{ file.name }}</span>
                      </div>
                    </n-grid-item>
                  </n-grid>
                </div>
              </div>
            </template>
          </LeLeftRightLayout>
        </div>
      </LeCard>
    </n-space>
  </LeContainer>
</template>

<script setup lang="ts">
import { ref, h } from 'vue';
import { NIcon } from 'naive-ui';
import { HomeOutline, SettingsOutline, PersonOutline, DocumentOutline } from '@vicons/ionicons5';

// 菜单选项
const menuOptions = [
  {
    label: '首页',
    key: 'home',
    icon: () => h(NIcon, null, { default: () => h(HomeOutline) }),
  },
  {
    label: '设置',
    key: 'settings',
    icon: () => h(NIcon, null, { default: () => h(SettingsOutline) }),
  },
  {
    label: '用户',
    key: 'user',
    icon: () => h(NIcon, null, { default: () => h(PersonOutline) }),
  },
];

// 树形数据
const treeData = [
  {
    label: '节点 1',
    key: '1',
    children: [
      { label: '节点 1-1', key: '1-1' },
      { label: '节点 1-2', key: '1-2' },
    ],
  },
  {
    label: '节点 2',
    key: '2',
    children: [
      { label: '节点 2-1', key: '2-1' },
    ],
  },
];

// 文件树数据
const fileTreeData = [
  {
    label: 'vue-monorepo',
    key: 'root',
    children: [
      {
        label: 'packages',
        key: 'packages',
        children: [
          { label: 'base', key: 'base' },
          { label: 'theme', key: 'theme' },
          { label: 'ui', key: 'ui' },
          { label: 'utils', key: 'utils' },
        ],
      },
      {
        label: 'projects',
        key: 'projects',
        children: [
          { label: 'le-guide', key: 'le-guide' },
          { label: 'le-start', key: 'le-start' },
        ],
      },
      { label: 'package.json', key: 'package.json' },
      { label: 'README.md', key: 'readme' },
    ],
  },
];

// 文件列表
const files = [
  { name: 'Button.tsx', icon: 'ui-edit' },
  { name: 'Card.tsx', icon: 'ui-edit' },
  { name: 'Dialog.tsx', icon: 'ui-edit' },
  { name: 'Table.tsx', icon: 'ui-edit' },
  { name: 'Filter.tsx', icon: 'ui-edit' },
  { name: 'SvgIcon.tsx', icon: 'ui-edit' },
  { name: 'Container.tsx', icon: 'ui-edit' },
  { name: 'LeftRightLayout.tsx', icon: 'ui-edit' },
];

// 收起状态
const collapseStatus = ref('已收起');

const onCollapse = () => {
  collapseStatus.value = '已收起';
};

const onExpand = () => {
  collapseStatus.value = '已展开';
};
</script>

<style lang="scss" scoped>
.demo-layout-wrapper {
  height: 300px;
  border: 1px solid var(--le-divider);
  border-radius: var(--le-radius-md);
  overflow: hidden;

  &--large {
    height: 400px;
  }
}

.demo-panel {
  padding: 16px;
  height: 100%;
  box-sizing: border-box;

  h3 {
    margin: 0 0 12px;
    font-size: 16px;
    font-weight: 600;
    color: var(--le-text-1);
  }

  p {
    margin: 0 0 16px;
    font-size: 14px;
    color: var(--le-text-2);
  }

  &--primary {
    background: linear-gradient(135deg, var(--le-primary-1) 0%, transparent 100%);
  }

  &--success {
    background: linear-gradient(135deg, var(--le-success-1, rgba(82, 196, 26, 0.1)) 0%, transparent 100%);
  }
}

.demo-grid-item {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 80px;
  background-color: var(--le-hover);
  border-radius: var(--le-radius-md);
  color: var(--le-text-2);
}

// 文件管理器样式
.file-tree {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 16px;
    border-bottom: 1px solid var(--le-divider);
    font-weight: 600;
    color: var(--le-text-1);
  }
}

.file-content {
  height: 100%;
  display: flex;
  flex-direction: column;

  &__header {
    padding: 12px 16px;
    border-bottom: 1px solid var(--le-divider);
  }

  &__body {
    flex: 1;
    padding: 16px;
    overflow: auto;
  }
}

.file-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-radius: var(--le-radius-md);
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background-color: var(--le-hover);
  }

  &__name {
    font-size: 12px;
    color: var(--le-text-2);
    text-align: center;
    word-break: break-all;
  }
}
</style>

