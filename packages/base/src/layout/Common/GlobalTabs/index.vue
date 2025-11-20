<template>
  <div class="global-tabs">
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
        class="tab-close"
        :color="activeTab?.key === tab.key ? '#b5bdc7' : '#8c939c'"
        :border-radius="0"
        :size="16"
        @click.stop="onClickCloseTab(tab)"
      >
        <n-icon :size="16" :component="Close"></n-icon>
      </n-icon-wrapper>
    </div>

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
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { Close } from '@vicons/ionicons5';
import { useAppStore } from '../../../store/app';

const appStore = useAppStore();

const { tabs, activeTab } = storeToRefs(appStore);

const menu = ref({ visible: false, x: 0, y: 0, tab: {} });

const contextmenuList = ref([
  { label: '关闭当前', key: 'close-current', fn: onClose },
  { label: '关闭其他', key: 'close-other', fn: onCloseOthers },
  { label: '关闭所有', key: 'close-all', fn: onCloseAll },
]);

function onClose(tab: any) {
  console.log(tab);
  closeMenu();
}
function onCloseOthers(tab: any) {
  console.log(tab);
  closeMenu();
}
function onCloseAll(tab: any) {
  console.log(tab);
  closeMenu();
}

function onClickTab(tab: any) {
  appStore.setActiveTab(tab);
}

function onClickCloseTab(tab: any) {}
function onContextmenuTab(e: MouseEvent, tab: any) {
  openMenuAt(e.clientX, e.clientY, tab);
}

function openMenuAt(x: number, y: number, tab: any) {
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
  menu.value.tab = {};
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
