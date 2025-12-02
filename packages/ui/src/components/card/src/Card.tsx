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

    return () => (
      <div
        class={[
          'le-card',
          props.class,
          { 'le-card--collapsible': props.collapsible, 'le-card--collapsed': collapsed.value },
        ]}
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
