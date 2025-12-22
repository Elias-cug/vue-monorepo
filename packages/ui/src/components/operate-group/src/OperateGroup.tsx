import { defineComponent } from 'vue';
import { NButton } from 'naive-ui';
import type { PropType } from 'vue';
import './styles/index.scss';

export interface OperateGroupProps {
  /** 展示形式是字，或按钮 */
  type?: 'text' | 'button';
  /** 额外数据，点击时带出 */
  data?: any;
  /** 项配置 */
  options: Array<{
    /** key */
    value: string | number;
    /** label */
    label: string;
    /** 对应 NButton 类型 */
    type: 'primary' | 'success' | 'warning' | 'error' | undefined;
    /** 是否禁用 */
    disabled: boolean;
    /** 是否 loading 中 */
    loading: boolean;
    /** 是否展示在更多 */
    more?: boolean;
    /** 是否下拉，只在type 是button时生效 */
    dropdown?: boolean;
    /** 下拉配置 */
    dropdownProps?: {};
    /** 点击 */
    onClick: (params: { value: string | number; label: string; data?: any }) => void;
  }>;
}

const operateGroupProps = {
  type: {
    type: String as PropType<'text' | 'button'>,
    default: 'text',
  },
  data: {
    type: null as any,
    default: undefined,
  },
  options: {
    type: Array as PropType<OperateGroupProps['options']>,
    required: true,
  },
};

export const OperateGroup = defineComponent({
  name: 'LeOperateGroup',
  props: operateGroupProps,
  setup(props) {
    return (
      <div class="le-operate-group">
        {props.options?.map(option => (
          <NButton
            key={option.value}
            quaternary={props.type === 'text'}
            type={option.type ?? 'primary'}
            disabled={option.disabled}
            onClick={() =>
              option.onClick({ value: option.value, label: option.label, data: props.data })
            }
          >
            {option.label}
          </NButton>
        ))}
      </div>
    );
  },
});
