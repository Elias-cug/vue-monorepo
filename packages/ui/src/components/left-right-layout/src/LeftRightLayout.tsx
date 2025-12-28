import { defineComponent, ref, computed, h } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NIcon } from 'naive-ui';
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5';
import './styles/index.scss';

export interface LeftRightLayoutProps {
  /** 左侧宽度，默认 240px */
  leftWidth?: string | number;
  /** 左右间隔，默认 16px */
  gap?: string | number;
  /** 左侧是否默认收起 */
  defaultCollapsed?: boolean;
  /** 收起按钮 tooltip */
  collapseTooltip?: string;
  /** 展开按钮 tooltip */
  expandTooltip?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
}

const leftRightLayoutProps = {
  leftWidth: {
    type: [String, Number] as PropType<string | number>,
    default: 240,
  },
  gap: {
    type: [String, Number] as PropType<string | number>,
    default: 16,
  },
  defaultCollapsed: {
    type: Boolean,
    default: false,
  },
  collapseTooltip: {
    type: String,
    default: '收起左侧',
  },
  expandTooltip: {
    type: String,
    default: '展开左侧',
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
} as const;

export const LeftRightLayout = defineComponent({
  name: 'LeLeftRightLayout',
  props: leftRightLayoutProps,
  emits: ['update:collapsed', 'collapse', 'expand'],
  setup(props, { slots, emit }) {
    // 收起状态
    const collapsed = ref(props.defaultCollapsed);

    // 处理宽度值
    const leftWidthValue = computed(() => {
      return typeof props.leftWidth === 'number' ? `${props.leftWidth}px` : props.leftWidth;
    });

    // 处理间隔值
    const gapValue = computed(() => {
      return typeof props.gap === 'number' ? `${props.gap}px` : props.gap;
    });

    // 切换收起状态
    const toggleCollapse = () => {
      collapsed.value = !collapsed.value;
      emit('update:collapsed', collapsed.value);
      if (collapsed.value) {
        emit('collapse');
      } else {
        emit('expand');
      }
    };

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-left-right-layout'];

      if (collapsed.value) {
        classes.push('le-left-right-layout--collapsed');
      }

      if (props.class) {
        classes.push(props.class);
      }

      return classes;
    };

    return () => (
      <div
        class={getClassNames()}
        style={{
          ...props.style,
          '--le-lrl-left-width': leftWidthValue.value,
          '--le-lrl-gap': gapValue.value,
        }}
      >
        {/* 左侧区域 */}
        <div class="le-left-right-layout__left">
          <div class="le-left-right-layout__left-content">{slots.left?.()}</div>
        </div>

        {/* 间隔区域（含收起/展开按钮） */}
        <div class="le-left-right-layout__divider">
          <button
            class="le-left-right-layout__toggle-btn"
            onClick={toggleCollapse}
            title={collapsed.value ? props.expandTooltip : props.collapseTooltip}
          >
            {h(
              NIcon,
              { size: 14 },
              { default: () => h(collapsed.value ? ChevronForwardOutline : ChevronBackOutline) }
            )}
          </button>
        </div>

        {/* 右侧区域 */}
        <div class="le-left-right-layout__right">
          <div class="le-left-right-layout__right-content">
            {slots.right?.() || slots.default?.()}
          </div>
        </div>
      </div>
    );
  },
});

export default LeftRightLayout;
