import { defineComponent } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NScrollbar } from 'naive-ui';
import './styles/index.scss';

export interface ContainerProps {
  /** 内边距 */
  padding?: string | number;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
}

const containerProps = {
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

export const Container = defineComponent({
  name: 'LeContainer',
  props: containerProps,
  setup(props, { slots }) {
    // 处理 padding 值
    const paddingValue = typeof props.padding === 'number' ? `${props.padding}px` : props.padding;

    return () => (
      <div
        class={['le-container', props.class]}
        style={{
          ...props.style,
          '--le-container-padding': paddingValue,
        }}
      >
        <NScrollbar class="le-container__scrollbar">
          <div class="le-container__content">{slots.default?.()}</div>
        </NScrollbar>
      </div>
    );
  },
});

export default Container;
