import { defineComponent, ref, computed, watch } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NModal, NIcon } from 'naive-ui';
import { CloseOutline, ExpandOutline, ContractOutline } from '@vicons/ionicons5';
import { useDraggable } from './useDraggable';
import './styles/index.scss';

export interface DialogProps {
  /** 控制弹窗显示/隐藏 */
  visible?: boolean;
  /** 弹窗标题 */
  title?: string;
  /** 弹窗宽度 */
  width?: string | number;
  /** 是否显示关闭按钮 */
  closable?: boolean;
  /** 是否支持全屏 */
  fullscreenable?: boolean;
  /** 是否可拖拽 */
  draggable?: boolean;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
  /** 点击遮罩是否关闭 */
  maskClosable?: boolean;
  /** 关闭时是否销毁内容 */
  destroyOnClose?: boolean;
  /** 弹窗内容的自定义样式 */
  contentStyle?: CSSProperties;
}

const dialogProps = {
  visible: {
    type: Boolean,
    default: false,
  },
  title: {
    type: String,
    default: undefined,
  },
  width: {
    type: [String, Number] as PropType<string | number>,
    default: 520,
  },
  closable: {
    type: Boolean,
    default: true,
  },
  fullscreenable: {
    type: Boolean,
    default: true,
  },
  draggable: {
    type: Boolean,
    default: true,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
  maskClosable: {
    type: Boolean,
    default: true,
  },
  destroyOnClose: {
    type: Boolean,
    default: false,
  },
  contentStyle: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
} as const;

export const Dialog = defineComponent({
  name: 'LeDialog',
  inheritAttrs: false,
  props: dialogProps,
  emits: [
    'update:visible',
    'close',
    'fullscreenChange',
    'afterEnter',
    'afterLeave',
    'esc',
    'maskClick',
  ],
  setup(props, { slots, emit, attrs }) {
    const isFullscreen = ref(false);

    // 拖拽功能
    const { position, isDragging, resetPosition, handleDragStart } = useDraggable({
      boundary: true,
      boundaryPadding: 20,
    });

    const internalVisible = computed({
      get: () => props.visible,
      set: (val: boolean) => {
        emit('update:visible', val);
      },
    });

    watch(
      () => props.visible,
      val => {
        if (!val) {
          isFullscreen.value = false;
          // 关闭时重置拖拽位置
          resetPosition();
        }
      }
    );

    const handleClose = () => {
      internalVisible.value = false;
      emit('close');
    };

    const toggleFullscreen = () => {
      isFullscreen.value = !isFullscreen.value;
      emit('fullscreenChange', isFullscreen.value);
    };

    const widthValue = computed(() => {
      if (isFullscreen.value) {
        return 'calc(100vw - 32px)';
      }
      return typeof props.width === 'number' ? `${props.width}px` : props.width;
    });

    const dialogClassNames = computed(() => {
      const classes = ['le-dialog'];
      if (isFullscreen.value) {
        classes.push('le-dialog--fullscreen');
      }
      if (props.draggable) {
        classes.push('le-dialog--draggable');
      }
      if (isDragging.value) {
        classes.push('le-dialog--dragging');
      }
      if (props.class) {
        classes.push(props.class);
      }
      return classes.join(' ');
    });

    const contentStyles = computed<CSSProperties>(() => {
      const styles: CSSProperties = {
        width: widthValue.value,
        ...props.contentStyle,
      };

      // 拖拽位置（全屏时不应用）
      if (
        props.draggable &&
        !isFullscreen.value &&
        (position.value.x !== 0 || position.value.y !== 0)
      ) {
        styles.transform = `translate(${position.value.x}px, ${position.value.y}px)`;
      }

      return styles;
    });

    // Header 拖拽事件处理
    const onHeaderMouseDown = (e: MouseEvent) => {
      // 不在全屏模式下拖拽
      if (!props.draggable || isFullscreen.value) return;
      // 不在按钮上触发拖拽
      const target = e.target as HTMLElement;
      if (target.closest('.le-dialog__action-btn')) return;
      handleDragStart(e);
    };

    const renderHeader = () => {
      if (slots.header) {
        return (
          <div class="le-dialog__header" onMousedown={onHeaderMouseDown}>
            <div class="le-dialog__header-content">{slots.header()}</div>
            <div class="le-dialog__header-actions">
              {props.fullscreenable && (
                <span
                  class="le-dialog__action-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen.value ? '退出全屏' : '全屏'}
                >
                  <NIcon size={18}>
                    {isFullscreen.value ? <ContractOutline /> : <ExpandOutline />}
                  </NIcon>
                </span>
              )}
              {props.closable && (
                <span
                  class="le-dialog__action-btn le-dialog__close-btn"
                  onClick={handleClose}
                  title="关闭"
                >
                  <NIcon size={18}>
                    <CloseOutline />
                  </NIcon>
                </span>
              )}
            </div>
          </div>
        );
      }

      if (props.title) {
        return (
          <div class="le-dialog__header" onMousedown={onHeaderMouseDown}>
            <div class="le-dialog__title">{props.title}</div>
            <div class="le-dialog__header-actions">
              {props.fullscreenable && (
                <span
                  class="le-dialog__action-btn"
                  onClick={toggleFullscreen}
                  title={isFullscreen.value ? '退出全屏' : '全屏'}
                >
                  <NIcon size={18}>
                    {isFullscreen.value ? <ContractOutline /> : <ExpandOutline />}
                  </NIcon>
                </span>
              )}
              {props.closable && (
                <span
                  class="le-dialog__action-btn le-dialog__close-btn"
                  onClick={handleClose}
                  title="关闭"
                >
                  <NIcon size={18}>
                    <CloseOutline />
                  </NIcon>
                </span>
              )}
            </div>
          </div>
        );
      }

      return null;
    };

    const renderFooter = () => {
      if (slots.footer) {
        return <div class="le-dialog__footer">{slots.footer()}</div>;
      }
      return null;
    };

    return () => (
      <NModal
        show={internalVisible.value}
        onUpdateShow={(val: boolean) => {
          internalVisible.value = val;
        }}
        onAfterEnter={() => emit('afterEnter')}
        onAfterLeave={() => emit('afterLeave')}
        onEsc={() => emit('esc')}
        onMaskClick={() => emit('maskClick')}
        class={dialogClassNames.value}
        style={props.style}
        maskClosable={props.maskClosable}
        closeOnEsc={props.closable}
        transformOrigin="center"
        {...attrs}
      >
        <div
          class={['le-dialog__content', { 'le-dialog__content--fullscreen': isFullscreen.value }]}
          style={contentStyles.value}
        >
          {renderHeader()}
          <div class="le-dialog__body">
            {props.destroyOnClose ? (props.visible ? slots.default?.() : null) : slots.default?.()}
          </div>
          {renderFooter()}
        </div>
      </NModal>
    );
  },
});

export default Dialog;
