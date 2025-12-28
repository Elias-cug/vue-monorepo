import { defineComponent, ref, computed, watch, h } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NIcon } from 'naive-ui';
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5';
import { Container } from '../../container';
import './styles/index.scss';

export interface LeftRightLayoutProps {
  /** 左侧宽度，默认 240px */
  leftWidth?: string | number;
  /** 左右间隔，默认 16px */
  gap?: string | number;
  /** 内边距，默认 16px */
  padding?: string | number;
  /** 左侧是否收起（v-model:collapsed） */
  collapsed?: boolean;
  /** 左侧是否默认收起（非受控模式） */
  defaultCollapsed?: boolean;
  /** 收起按钮 tooltip */
  collapseTooltip?: string;
  /** 展开按钮 tooltip */
  expandTooltip?: string;
  /** 右侧面板是否透明 */
  rightTransparent?: boolean;
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
  padding: {
    type: [String, Number] as PropType<string | number>,
    default: '16px',
  },
  collapsed: {
    type: Boolean,
    default: undefined,
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
  rightTransparent: {
    type: Boolean,
    default: false,
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
    // 内部收起状态（非受控模式使用）
    const internalCollapsed = ref(props.defaultCollapsed);

    // 判断是否为受控模式
    const isControlled = computed(() => props.collapsed !== undefined);

    // 实际的收起状态
    const isCollapsed = computed(() => 
      isControlled.value ? props.collapsed : internalCollapsed.value
    );

    // 监听外部 collapsed 变化（受控模式）
    watch(() => props.collapsed, (val) => {
      if (val !== undefined) {
        internalCollapsed.value = val;
      }
    });

    // 处理宽度值
    const leftWidthValue = computed(() => {
      return typeof props.leftWidth === 'number' ? `${props.leftWidth}px` : props.leftWidth;
    });

    // 处理间隔值
    const gapValue = computed(() => {
      return typeof props.gap === 'number' ? `${props.gap}px` : props.gap;
    });

    // 处理 padding 值
    const paddingValue = computed(() => {
      return typeof props.padding === 'number' ? `${props.padding}px` : props.padding;
    });

    // 切换收起状态
    const toggleCollapse = () => {
      const newValue = !isCollapsed.value;
      
      // 非受控模式：更新内部状态
      if (!isControlled.value) {
        internalCollapsed.value = newValue;
      }
      
      // 触发事件
      emit('update:collapsed', newValue);
      if (newValue) {
        emit('collapse');
      } else {
        emit('expand');
      }
    };

    // 构建内容区类名
    const getContentClassNames = computed(() => {
      const classes = ['le-left-right-layout'];

      if (isCollapsed.value) {
        classes.push('le-left-right-layout--collapsed');
      }

      if (props.rightTransparent) {
        classes.push('le-left-right-layout--right-transparent');
      }

      if (props.class) {
        classes.push(props.class);
      }

      return classes.join(' ');
    });

    return () => (
      <Container
        padding={0}
        contentClass={getContentClassNames.value}
        style={{
          ...props.style,
          '--le-lrl-left-width': leftWidthValue.value,
          '--le-lrl-gap': gapValue.value,
          '--le-lrl-padding': paddingValue.value,
        }}
      >
        {/* 收起状态的展开按钮 - 放在左侧 padding 区域 */}
        <div class="le-left-right-layout__toggle-area">
          <button
            class="le-left-right-layout__toggle-btn"
            onClick={toggleCollapse}
            title={props.expandTooltip}
          >
            {h(NIcon, { size: 14 }, { default: () => h(ChevronForwardOutline) })}
          </button>
        </div>

        {/* 左侧区域 */}
        <div class="le-left-right-layout__left">
          <div class="le-left-right-layout__left-content">{slots.left?.()}</div>
        </div>

        {/* 间隔区域（含展开状态的收起按钮） */}
        <div class="le-left-right-layout__divider">
          <button
            class="le-left-right-layout__toggle-btn"
            onClick={toggleCollapse}
            title={props.collapseTooltip}
          >
            {h(NIcon, { size: 14 }, { default: () => h(ChevronBackOutline) })}
          </button>
        </div>

        {/* 右侧区域 */}
        <div class="le-left-right-layout__right">
          <div class="le-left-right-layout__right-content">
            {slots.right?.() || slots.default?.()}
          </div>
        </div>
      </Container>
    );
  },
});

export default LeftRightLayout;
