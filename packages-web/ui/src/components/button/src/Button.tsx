import { defineComponent, computed, h } from 'vue';
import { NButton, buttonProps as nButtonProps } from 'naive-ui';
import type { PropType } from 'vue';
import type { ButtonProps as NButtonProps } from 'naive-ui';
import { SvgIcon } from '../../svg-icon';
import './styles/index.scss';

export interface ButtonProps extends Partial<NButtonProps> {
  /** 图标名称，使用 SvgIcon 组件渲染 */
  iconName?: string;
  /** 图标大小 */
  iconSize?: number | string;
  /** 图标颜色 */
  iconColor?: string;
  /** 纯文字风格，无背景色和包围盒 */
  linkStyle?: boolean;
}

const buttonProps = {
  ...nButtonProps,
  iconName: {
    type: String,
    default: undefined,
  },
  iconSize: {
    type: [Number, String] as PropType<number | string>,
    default: '1em',
  },
  iconColor: {
    type: String,
    default: undefined,
  },
  linkStyle: {
    type: Boolean,
    default: false,
  },
} as const;

export const Button = defineComponent({
  name: 'LeButton',
  props: buttonProps,
  setup(props, { slots }) {
    const hasIcon = computed(() => !!props.iconName);

    const buttonClass = computed(() => ({
      'le-button--link': props.linkStyle,
    }));

    return () => {
      const iconSlot =
        props.loading || !hasIcon.value
          ? slots.icon
          : () =>
              h(SvgIcon, {
                name: props.iconName!,
                size: props.iconSize,
                color: props.iconColor,
              });

      return h(
        NButton,
        {
          ...props,
          text: props.linkStyle || props.text,
          class: buttonClass.value,
        },
        {
          default: slots.default,
          icon: iconSlot,
        }
      );
    };
  },
});

export default Button;
