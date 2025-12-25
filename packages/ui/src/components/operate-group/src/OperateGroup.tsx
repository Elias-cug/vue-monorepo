import { computed, defineComponent } from 'vue';
import { NButtonGroup, NDropdown, NIcon } from 'naive-ui';
import { ChevronDownOutline, EllipsisHorizontal } from '@vicons/ionicons5';
import type { PropType } from 'vue';
import type { DropdownOption } from 'naive-ui';
import { Button } from '../../button';
import './styles/index.scss';

export interface OperateOption {
  /** 唯一标识 */
  value: string | number;
  /** 显示文本 */
  label: string;
  /** 按钮类型 */
  type?: 'primary' | 'success' | 'warning' | 'error';
  /** 图标名称，使用 SvgIcon 渲染 */
  iconName?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 是否收纳到「更多」下拉中 */
  more?: boolean;
  /** 点击回调 */
  onClick: (params: { value: string | number; label: string; data?: any }) => void;
}

export interface OperateGroupProps {
  /** 展示形式是字，或按钮 */
  type?: 'text' | 'button';
  /** 额外数据，点击时带出 */
  data?: any;
  /** 项配置 */
  options: OperateOption[];
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
    type: Array as PropType<OperateOption[]>,
    required: true,
  },
};

export const OperateGroup = defineComponent({
  name: 'LeOperateGroup',
  props: operateGroupProps,
  setup(props) {
    const normalOptions = computed(() => props.options?.filter(opt => !opt.more) || []);
    const moreOptions = computed(() => props.options?.filter(opt => opt.more) || []);

    const dropdownOptions = computed<DropdownOption[]>(() =>
      moreOptions.value.map(opt => ({
        key: opt.value,
        label: opt.label,
        disabled: opt.disabled,
      }))
    );

    function handleMoreSelect(key: string | number) {
      const option = moreOptions.value.find(opt => opt.value === key);
      if (option && !option.disabled) {
        option.onClick({ value: option.value, label: option.label, data: props.data });
      }
    }

    return () => (
      <div class={['le-operate-group', props.type === 'button' && 'le-operate-group--button']}>
        {normalOptions.value.map(option => (
          <Button
            key={option.value}
            linkStyle={props.type === 'text'}
            type={option.type ?? 'primary'}
            iconName={props.type === 'button' ? option.iconName : undefined}
            disabled={option.disabled}
            loading={option.loading}
            onClick={() =>
              option.onClick({ value: option.value, label: option.label, data: props.data })
            }
          >
            {option.label}
          </Button>
        ))}
        {moreOptions.value.length > 0 && props.type === 'text' && (
          <NDropdown trigger="hover" options={dropdownOptions.value} onSelect={handleMoreSelect}>
            <Button linkStyle type="primary" class="le-operate-group__more">
              <NIcon size={16}>
                <EllipsisHorizontal />
              </NIcon>
            </Button>
          </NDropdown>
        )}
        {moreOptions.value.length > 0 && props.type === 'button' && (
          <NDropdown trigger="hover" options={dropdownOptions.value} onSelect={handleMoreSelect}>
            <NButtonGroup>
              <Button type="primary">更多</Button>
              <Button type="primary" style={{ padding: '0 8px' }}>
                <NIcon size={14}>
                  <ChevronDownOutline />
                </NIcon>
              </Button>
            </NButtonGroup>
          </NDropdown>
        )}
      </div>
    );
  },
});

export default OperateGroup;
