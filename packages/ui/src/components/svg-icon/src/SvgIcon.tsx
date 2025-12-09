import { defineComponent, computed } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import './styles/index.scss';

export interface SvgIconProps {
  /** 图标名称（不需要带前缀） */
  name: string;
  /** 图标大小，可以是数字或字符串 */
  size?: number | string;
  /** 图标颜色，默认继承父元素 */
  color?: string;
  /** 自定义类名 */
  className?: string;
  /** 是否旋转（loading 动画） */
  spin?: boolean;
  /** 旋转角度 */
  rotate?: number;
  /** 自定义样式 */
  style?: CSSProperties;
}

const svgIconProps = {
  name: {
    type: String,
    required: true,
  },
  size: {
    type: [Number, String] as PropType<number | string>,
    default: '1em',
  },
  color: {
    type: String,
    default: 'currentColor',
  },
  className: {
    type: String,
    default: '',
  },
  spin: {
    type: Boolean,
    default: false,
  },
  rotate: {
    type: Number,
    default: 0,
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
} as const;

export const SvgIcon = defineComponent({
  name: 'LeSvgIcon',
  props: svgIconProps,
  setup(props) {
    // 图标 ID
    const iconName = computed(() => `#le-icon-${props.name}`);

    // 图标样式
    const iconStyle = computed<CSSProperties>(() => {
      const sizeValue = typeof props.size === 'number' ? `${props.size}px` : props.size;

      const style: CSSProperties = {
        width: sizeValue,
        height: sizeValue,
        // 使用 color 属性同时控制 fill 和 stroke
        color: props.color,
      };

      if (props.rotate) {
        style.transform = `rotate(${props.rotate}deg)`;
      }

      if (props.style) {
        Object.assign(style, props.style);
      }

      return style;
    });

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-svg-icon'];

      // 添加自定义类名
      if (props.className) {
        classes.push(props.className);
      }

      // 添加动画类名
      if (props.spin) {
        classes.push('is-spin');
      }

      return classes;
    };

    return () => (
      <svg class={getClassNames()} style={iconStyle.value} aria-hidden="true">
        <use xlinkHref={iconName.value} />
      </svg>
    );
  },
});

export default SvgIcon;
