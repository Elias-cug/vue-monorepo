<template>
  <div class="scrollable-container">
    <div
      v-if="showArrows"
      class="scroll-arrow scroll-arrow-left"
      :class="{ disabled: isLeftDisabled }"
      @click="handleScrollLeft"
    >
      <n-icon :size="16" :component="ChevronBack"></n-icon>
    </div>

    <div ref="containerRef" class="scroll-content">
      <slot></slot>
    </div>

    <div
      v-if="showArrows"
      class="scroll-arrow scroll-arrow-right"
      :class="{ disabled: isRightDisabled }"
      @click="handleScrollRight"
    >
      <n-icon :size="16" :component="ChevronForward"></n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue';
import { ChevronBack, ChevronForward } from '@vicons/ionicons5';

interface Props {
  /** 滚动步长（px） */
  scrollStep?: number;
  /** 监听的内容数量，用于检测内容变化 */
  itemCount?: number;
}

const props = withDefaults(defineProps<Props>(), {
  scrollStep: 200,
  itemCount: 0,
});

const containerRef = ref<HTMLElement | null>(null);
const showArrows = ref(false);
const isLeftDisabled = ref(true);
const isRightDisabled = ref(false);

/** 检查是否需要显示滚动箭头和箭头状态 */
function checkScroll() {
  if (!containerRef.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = containerRef.value;

  // 如果内容宽度大于容器宽度，显示箭头
  showArrows.value = scrollWidth > clientWidth;

  // 检查左右箭头是否应该禁用
  isLeftDisabled.value = scrollLeft <= 0;
  isRightDisabled.value = scrollLeft + clientWidth >= scrollWidth - 1;
}

/** 向左滚动 */
function handleScrollLeft() {
  if (!containerRef.value || isLeftDisabled.value) return;
  containerRef.value.scrollBy({ left: -props.scrollStep, behavior: 'smooth' });
  setTimeout(checkScroll, 300);
}

/** 向右滚动 */
function handleScrollRight() {
  if (!containerRef.value || isRightDisabled.value) return;
  containerRef.value.scrollBy({ left: props.scrollStep, behavior: 'smooth' });
  setTimeout(checkScroll, 300);
}

/** 滚动到指定位置 */
function scrollTo(left: number, behavior: ScrollBehavior = 'smooth') {
  if (!containerRef.value) return;
  containerRef.value.scrollTo({ left, behavior });
  setTimeout(checkScroll, 300);
}

/** 滚动到指定索引的子元素 */
function scrollToIndex(index: number, behavior: ScrollBehavior = 'smooth') {
  if (!containerRef.value) return;

  const children = containerRef.value.children;
  const targetElement = children[index] as HTMLElement;
  if (!targetElement) return;

  const containerRect = containerRef.value.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const scrollLeft = containerRef.value.scrollLeft;
  const targetScroll =
    scrollLeft +
    (targetRect.left - containerRect.left) -
    (containerRect.width - targetRect.width) / 2;

  scrollTo(targetScroll, behavior);
}

// 监听内容数量变化
watch(
  () => props.itemCount,
  () => {
    setTimeout(checkScroll, 100);
  }
);

onMounted(() => {
  checkScroll();
  window.addEventListener('resize', checkScroll);
  if (containerRef.value) {
    containerRef.value.addEventListener('scroll', checkScroll);
  }
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScroll);
  if (containerRef.value) {
    containerRef.value.removeEventListener('scroll', checkScroll);
  }
});

// 暴露方法给父组件
defineExpose({
  scrollTo,
  scrollToIndex,
  checkScroll,
});
</script>

<style lang="scss" scoped>
.scrollable-container {
  width: 100%;
  height: 100%;
  display: flex;
  position: relative;

  .scroll-content {
    flex: 1;
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-behavior: smooth;

    // 隐藏滚动条
    &::-webkit-scrollbar {
      display: none;
    }
    -ms-overflow-style: none;
    scrollbar-width: none;
  }

  .scroll-arrow {
    width: 32px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    // 使用与 tabs 整体背景一致的色阶 1
    background-color: var(--le-primary-1);
    cursor: pointer;
    flex-shrink: 0;
    transition:
      background-color 0.2s,
      opacity 0.2s,
      color 0.2s;
    // 图标颜色
    color: var(--le-text-2);

    &:hover:not(.disabled) {
      // hover 状态使用色阶 2
      background-color: var(--le-primary-2);
      // hover 时图标颜色加深
      color: var(--le-primary);
    }

    &.disabled {
      cursor: not-allowed;
      opacity: 0.4;
      color: var(--le-text-disabled);
    }

    &.scroll-arrow-left {
      // 使用主题边框色
      border-right: 1px solid var(--le-primary-3);
    }

    &.scroll-arrow-right {
      // 使用主题边框色
      border-left: 1px solid var(--le-primary-3);
    }

    &:active:not(.disabled) {
      // 按下效果
      background-color: var(--le-primary-3);
    }
  }
}
</style>
