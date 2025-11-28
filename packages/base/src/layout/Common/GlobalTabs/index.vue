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
import { ref, watch } from 'vue';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import { Close } from '@vicons/ionicons5';
import { useAppStore } from '../../../store/app';
import type { TabItem } from '../../../types/app';
import ScrollableContainer from './ScrollableContainer.vue';

const appStore = useAppStore();
const router = useRouter();

const { tabs, activeTab } = storeToRefs(appStore);
const scrollContainer = ref<InstanceType<typeof ScrollableContainer> | null>(null);

// 监听 activeTab 变化，自动跳转路由并滚动到对应位置
watch(
  () => activeTab.value,
  newTab => {
    if (newTab && router.currentRoute.value.fullPath !== newTab.key) {
      router.push(newTab.key);
    }
    // 滚动到激活的 tab
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
  appStore.removeTab(tab);
  closeMenu();
}
function onCloseOthers(tab: TabItem) {
  appStore.removeOtherTabs(tab);
  closeMenu();
}
function onCloseAll() {
  appStore.removeAllTabs();
  closeMenu();
}

function onClickTab(tab: TabItem) {
  appStore.setActiveTab(tab);
  router.push(tab.key);
}

function onClickCloseTab(tab: TabItem) {
  appStore.removeTab(tab);
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
