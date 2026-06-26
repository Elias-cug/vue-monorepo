import { ref, onUnmounted, type Ref } from 'vue';

export interface DraggableOptions {
  /** 边界限制 */
  boundary?: boolean;
  /** 边界内边距 */
  boundaryPadding?: number;
  /** 拖拽结束回调 */
  onDragEnd?: (position: { x: number; y: number }) => void;
}

export interface DraggableReturn {
  /** 当前位置 */
  position: Ref<{ x: number; y: number }>;
  /** 是否正在拖拽 */
  isDragging: Ref<boolean>;
  /** 重置位置 */
  resetPosition: () => void;
  /** 开始拖拽（绑定到 mousedown） */
  handleDragStart: (e: MouseEvent) => void;
}

/**
 * 拖拽功能 Hook
 * @param options 配置选项
 */
export function useDraggable(options: DraggableOptions = {}): DraggableReturn {
  const { boundary = true, boundaryPadding = 20, onDragEnd } = options;

  const position = ref({ x: 0, y: 0 });
  const isDragging = ref(false);

  // 记录拖拽起始状态
  const dragState = {
    startX: 0,
    startY: 0,
    initialX: 0,
    initialY: 0,
    targetRect: null as DOMRect | null,
  };

  /**
   * 计算边界限制后的位置
   */
  const clampToBoundary = (x: number, y: number): { x: number; y: number } => {
    if (!boundary || !dragState.targetRect) {
      return { x, y };
    }

    const rect = dragState.targetRect;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // 计算弹窗当前的边界位置（基于初始位置 + 偏移量）
    const currentLeft = rect.left + x - dragState.initialX;
    const currentRight = rect.right + x - dragState.initialX;
    const currentTop = rect.top + y - dragState.initialY;
    const currentBottom = rect.bottom + y - dragState.initialY;

    let clampedX = x;
    let clampedY = y;

    // 左边界限制
    if (currentLeft < boundaryPadding) {
      clampedX = x + (boundaryPadding - currentLeft);
    }
    // 右边界限制
    if (currentRight > viewportWidth - boundaryPadding) {
      clampedX = x - (currentRight - viewportWidth + boundaryPadding);
    }
    // 上边界限制
    if (currentTop < boundaryPadding) {
      clampedY = y + (boundaryPadding - currentTop);
    }
    // 下边界限制
    if (currentBottom > viewportHeight - boundaryPadding) {
      clampedY = y - (currentBottom - viewportHeight + boundaryPadding);
    }

    return { x: clampedX, y: clampedY };
  };

  /**
   * 鼠标移动处理
   */
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value) return;

    e.preventDefault();

    const deltaX = e.clientX - dragState.startX;
    const deltaY = e.clientY - dragState.startY;

    const newX = dragState.initialX + deltaX;
    const newY = dragState.initialY + deltaY;

    position.value = clampToBoundary(newX, newY);
  };

  /**
   * 鼠标释放处理
   */
  const handleMouseUp = () => {
    if (!isDragging.value) return;

    isDragging.value = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);

    // 恢复文本选择
    document.body.style.userSelect = '';

    onDragEnd?.(position.value);
  };

  /**
   * 开始拖拽（绑定到 header 的 mousedown）
   */
  const handleDragStart = (e: MouseEvent) => {
    // 只响应左键
    if (e.button !== 0) return;

    e.preventDefault();

    isDragging.value = true;

    // 记录起始鼠标位置和当前偏移
    dragState.startX = e.clientX;
    dragState.startY = e.clientY;
    dragState.initialX = position.value.x;
    dragState.initialY = position.value.y;

    // 获取弹窗内容元素的位置信息
    const target = (e.target as HTMLElement).closest('.le-dialog__content');
    if (target) {
      dragState.targetRect = target.getBoundingClientRect();
    }

    // 禁用文本选择
    document.body.style.userSelect = 'none';

    // 添加全局事件
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  /**
   * 重置位置到初始状态
   */
  const resetPosition = () => {
    position.value = { x: 0, y: 0 };
    dragState.targetRect = null;
  };

  // 组件卸载时清理
  onUnmounted(() => {
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    document.body.style.userSelect = '';
  });

  return {
    position,
    isDragging,
    resetPosition,
    handleDragStart,
  };
}

export default useDraggable;
