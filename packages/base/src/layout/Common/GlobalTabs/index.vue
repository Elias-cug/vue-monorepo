<template>
  <div class="global-tabs">
    <ScrollableContainer ref="scrollContainer" :item-count="tabs.length">
      <div
        v-for="tab in tabs"
        :key="tab.key"
        class="global-tabs-item"
        :class="{ active: activeTab?.key === tab.key }"
        @click="onClickTab(tab)"
        @contextmenu.prevent.stop="onContextmenuTab($event, tab)"
      >
        <span class="tab-label">{{ tab.title }}</span>
        <n-icon-wrapper
          v-if="tab.meta?.pinned !== true"
          class="tab-close"
          :color="activeTab?.key === tab.key ? '#b5bdc7' : '#8c939c'"
          :border-radius="0"
          :size="16"
          @click.stop="onClickCloseTab(tab)"
        >
          <n-icon :size="16" :component="Close"></n-icon>
        </n-icon-wrapper>
      </div>
    </ScrollableContainer>

    <teleport to="body">
      <ul
        v-if="menu.visible"
        class="tabs-contextmenu"
        :style="{ top: menu.y + 'px', left: menu.x + 'px' }"
        tabindex="0"
        @blur="closeMenu"
      >
        <li
          v-for="item in contextmenuList"
          :key="item.key"
          class="tabs-contextmenu-item"
          @click="item.fn(menu.tab)"
        >
          {{ item.label }}
        </li>
      </ul>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter, useRoute } from 'vue-router';
import { Close } from '@vicons/ionicons5';
import { useAppStore } from '../../../store/app';
import type { TabItem } from '../../../types/app';
import ScrollableContainer from './ScrollableContainer.vue';

const appStore = useAppStore();
const router = useRouter();
const route = useRoute();

const { tabs } = storeToRefs(appStore);
const scrollContainer = ref<InstanceType<typeof ScrollableContainer> | null>(null);

// 根据当前路由计算 activeTab
const activeTab = computed(() => {
  const currentPath = route.fullPath;
  const currentRoutePath = route.path;

  // 优先匹配完整路径（fullPath）
  const matchedTab = tabs.value.find(tab => tab.key === currentPath);
  if (matchedTab) return matchedTab;

  // 如果没有匹配到，尝试匹配 path（不含 query）
  return tabs.value.find(tab => tab.path === currentRoutePath) || null;
});

// 监听路由变化，滚动到对应的 tab
watch(
  () => route.fullPath,
  () => {
    scrollToActiveTab();
  }
);

const menu = ref<{ visible: boolean; x: number; y: number; tab: TabItem | null }>({
  visible: false,
  x: 0,
  y: 0,
  tab: null,
});

const contextmenuList = ref([
  {
    label: '关闭当前',
    key: 'close-current',
    fn: (tab: TabItem | null) => tab && onClose(tab),
  },
  {
    label: '关闭其他',
    key: 'close-other',
    fn: (tab: TabItem | null) => tab && onCloseOthers(tab),
  },
  { label: '关闭所有', key: 'close-all', fn: () => onCloseAll() },
]);

function onClose(tab: TabItem) {
  const nextTab = appStore.removeTab(tab, route.fullPath);
  closeMenu();
  // 如果删除的是当前激活的 tab，跳转到下一个 tab
  if (nextTab) {
    router.push(nextTab.key);
  }
}
function onCloseOthers(tab: TabItem) {
  appStore.removeOtherTabs(tab);
  closeMenu();
  // 确保跳转到当前 tab
  if (route.fullPath !== tab.key) {
    router.push(tab.key);
  }
}
function onCloseAll() {
  appStore.removeAllTabs();
  closeMenu();
  // 关闭所有 tab 后，跳转到第一个固定的 tab 或 homeMenu
  const firstTab = appStore.tabs[0];
  if (firstTab && route.fullPath !== firstTab.key) {
    router.push(firstTab.key);
  }
}

function onClickTab(tab: TabItem) {
  // 直接跳转路由，activeTab 会自动根据路由计算
  router.push(tab.key);
}

function onClickCloseTab(tab: TabItem) {
  const nextTab = appStore.removeTab(tab, route.fullPath);
  // 如果删除的是当前激活的 tab，跳转到下一个 tab
  if (nextTab) {
    router.push(nextTab.key);
  }
}
function onContextmenuTab(e: MouseEvent, tab: any) {
  openMenuAt(e.clientX, e.clientY, tab);
}

function openMenuAt(x: number, y: number, tab: TabItem) {
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const menuW = 160;
  const menuH = 200;

  const left = x + menuW > vw ? Math.max(8, vw - menuW - 8) : x;
  const top = y + menuH > vh ? Math.max(8, vh - menuH - 8) : y;

  menu.value = { visible: true, x: left, y: top, tab };

  // focus for accessibility
  setTimeout(() => {
    const el = document.querySelector('.tabs-contextmenu') as HTMLElement | null;
    el?.focus();
  });
}

function closeMenu() {
  menu.value.visible = false;
  menu.value.tab = null;
}

// 滚动到激活的 tab
function scrollToActiveTab() {
  if (!scrollContainer.value || !activeTab.value) return;

  const activeIndex = tabs.value.findIndex(tab => tab.key === activeTab.value?.key);
  if (activeIndex !== -1) {
    scrollContainer.value.scrollToIndex(activeIndex);
  }
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
