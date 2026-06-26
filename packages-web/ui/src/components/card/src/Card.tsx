import { defineComponent, ref, Transition, h } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NIcon } from 'naive-ui';
import { ChevronDownOutline } from '@vicons/ionicons5';
import './styles/index.scss';

export interface CardProps {
  /** 卡片标题 */
  title?: string;
  /** 内边距 */
  padding?: string | number;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
  /** 是否可折叠 */
  collapsible?: boolean;
  /** 默认是否折叠 */
  defaultCollapsed?: boolean;
  /** 主题变体 */
  theme?: 'default' | 'primary' | 'gradient' | 'borderless' | 'float' | 'selected';
  /** 是否选中（简写属性） */
  selected?: boolean;
  /** 是否无边框（简写属性） */
  borderless?: boolean;
}

const cardProps = {
  title: {
    type: String,
    default: undefined,
  },
  padding: {
    type: [String, Number] as PropType<string | number>,
    default: '16px',
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
  collapsible: {
    type: Boolean,
    default: false,
  },
  defaultCollapsed: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String as PropType<
      'default' | 'primary' | 'gradient' | 'borderless' | 'float' | 'selected'
    >,
    default: 'default',
  },
  selected: {
    type: Boolean,
    default: false,
  },
  borderless: {
    type: Boolean,
    default: false,
  },
} as const;

export const Card = defineComponent({
  name: 'LeCard',
  props: cardProps,
  setup(props, { slots }) {
    // 处理 padding 值
    const paddingValue = typeof props.padding === 'number' ? `${props.padding}px` : props.padding;

    // 折叠状态
    const collapsed = ref(props.defaultCollapsed);

    // 切换折叠状态
    const toggleCollapse = () => {
      collapsed.value = !collapsed.value;
    };

    // 是否显示 header
    const showHeader = props.title || slots['header-extra'] || props.collapsible;

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-card'];

      // 添加主题类名
      if (props.theme && props.theme !== 'default') {
        classes.push(`le-card--${props.theme}`);
      }

      // 简写属性优先级更高
      if (props.selected) {
        classes.push('le-card--selected');
      }
      if (props.borderless) {
        classes.push('le-card--borderless');
      }

      // 功能类名
      if (props.collapsible) {
        classes.push('le-card--collapsible');
      }
      if (collapsed.value) {
        classes.push('le-card--collapsed');
      }

      // 自定义类名
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
          '--le-card-padding': paddingValue,
        }}
      >
        {/* Header */}
        {showHeader && (
          <div class="le-card__header" onClick={props.collapsible ? toggleCollapse : undefined}>
            {props.title && <div class="le-card__title">{props.title}</div>}
            <div class="le-card__header-extra">
              {slots['header-extra'] && slots['header-extra']()}
              {props.collapsible &&
                h(
                  NIcon,
                  { size: 18, class: 'le-card__collapse-icon' },
                  { default: () => h(ChevronDownOutline) }
                )}
            </div>
          </div>
        )}

        {/* Content */}
        <Transition name="le-card-collapse">
          {!collapsed.value && <div class="le-card__content">{slots.default?.()}</div>}
        </Transition>
      </div>
    );
  },
});

export default Card;
