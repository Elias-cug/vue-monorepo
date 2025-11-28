import { defineComponent } from 'vue';
import type { PropType, CSSProperties } from 'vue';
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
} as const;

export const Card = defineComponent({
  name: 'LeCard',
  props: cardProps,
  setup(props, { slots }) {
    // 处理 padding 值
    const paddingValue = typeof props.padding === 'number' ? `${props.padding}px` : props.padding;

    // 是否显示 header
    const showHeader = props.title || slots['header-extra'];

    return () => (
      <div
        class={['le-card', props.class]}
        style={{
          ...props.style,
          '--le-card-padding': paddingValue,
        }}
      >
        {/* Header */}
        {showHeader && (
          <div class="le-card__header">
            {props.title && <div class="le-card__title">{props.title}</div>}
            {slots['header-extra'] && (
              <div class="le-card__header-extra">{slots['header-extra']()}</div>
            )}
          </div>
        )}

        {/* Content */}
        <div class="le-card__content">{slots.default?.()}</div>
      </div>
    );
  },
});

export default Card;
