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
  /** 主题变体 */
  theme?: 'default' | 'bordered' | 'accent' | 'primary' | 'card' | 'gradient';
  /** 是否显示边框（简写属性） */
  bordered?: boolean;
  /** 是否显示顶部装饰线（简写属性） */
  accent?: boolean;
  /** 溢出处理方式，auto 时启用滚动条 */
  overflow?: 'hidden' | 'auto';
  /** 内容区域自定义类名 */
  contentClass?: string;
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
  theme: {
    type: String as PropType<'default' | 'bordered' | 'accent' | 'primary' | 'card' | 'gradient'>,
    default: 'default',
  },
  bordered: {
    type: Boolean,
    default: false,
  },
  accent: {
    type: Boolean,
    default: false,
  },
  overflow: {
    type: String as PropType<'hidden' | 'auto'>,
    default: 'hidden',
  },
  contentClass: {
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

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-container'];

      // 添加主题类名
      if (props.theme && props.theme !== 'default') {
        classes.push(`le-container--${props.theme}`);
      }

      // 简写属性优先级更高
      if (props.bordered) {
        classes.push('le-container--bordered');
      }
      if (props.accent) {
        classes.push('le-container--accent');
      }

      // 添加自定义类名
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
          '--le-container-padding': paddingValue,
        }}
      >
        {props.overflow === 'auto' ? (
          <NScrollbar class="le-container__scrollbar">
            <div class={['le-container__content', props.contentClass]}>{slots.default?.()}</div>
          </NScrollbar>
        ) : (
          <div class={['le-container__content', props.contentClass]}>{slots.default?.()}</div>
        )}
      </div>
    );
  },
});

export default Container;
