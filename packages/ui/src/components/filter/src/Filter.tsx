import { defineComponent, reactive, ref, watch, h } from 'vue';
import type { PropType } from 'vue';
import { NInput, NSelect, NDatePicker, NButton, NSpace } from 'naive-ui';
import type { SelectOption } from 'naive-ui';
import './styles/index.scss';

/** 过滤项类型 */
export type FilterItemType = 'input' | 'select' | 'date' | 'daterange';

/** 选项配置 */
export type FilterOption = SelectOption;

/** 过滤项配置 */
export interface FilterItem {
  /** 字段名 */
  field: string;
  /** 标签 */
  label: string;
  /** 类型 */
  type: FilterItemType;
  /** 占位符 */
  placeholder?: string;
  /** select 选项 */
  options?: FilterOption[];
  /** 宽度 */
  width?: number | string;
}

/** 过滤值类型 */
export type FilterValues = Record<string, any>;

/** Filter 组件 Props */
export interface FilterProps {
  /** 过滤项配置 */
  items: FilterItem[];
  /** v-model 绑定值 */
  modelValue?: FilterValues;
  /** 默认值（初始化和重置时使用） */
  defaultValue?: FilterValues;
  /** 组件尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 查询按钮文字 */
  searchText?: string;
  /** 重置按钮文字 */
  resetText?: string;
  /** 是否显示重置按钮 */
  showReset?: boolean;
}

const filterProps = {
  items: {
    type: Array as PropType<FilterItem[]>,
    default: () => [],
  },
  modelValue: {
    type: Object as PropType<FilterValues>,
    default: undefined,
  },
  defaultValue: {
    type: Object as PropType<FilterValues>,
    default: () => ({}),
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
  },
  searchText: {
    type: String,
    default: '查询',
  },
  resetText: {
    type: String,
    default: '重置',
  },
  showReset: {
    type: Boolean,
    default: true,
  },
} as const;

export const Filter = defineComponent({
  name: 'LeFilter',
  props: filterProps,
  emits: ['search', 'reset', 'update:modelValue'],
  setup(props, { emit }) {
    // 表单值
    const formValues = reactive<FilterValues>({});
    // 用于强制重新渲染
    const resetKey = ref(0);

    // 初始化默认值
    const initFormValues = () => {
      props.items.forEach(item => {
        // 优先使用 modelValue，其次 defaultValue
        if (props.modelValue && props.modelValue[item.field] !== undefined) {
          formValues[item.field] = props.modelValue[item.field];
        } else if (props.defaultValue && props.defaultValue[item.field] !== undefined) {
          formValues[item.field] = props.defaultValue[item.field];
        } else {
          formValues[item.field] = item.type === 'daterange' ? null : undefined;
        }
      });
    };

    // 初始化
    initFormValues();

    // 监听 modelValue 变化
    watch(
      () => props.modelValue,
      newVal => {
        if (newVal) {
          props.items.forEach(item => {
            formValues[item.field] =
              newVal[item.field] ?? (item.type === 'daterange' ? null : undefined);
          });
          resetKey.value++;
        }
      },
      { deep: true }
    );

    // 获取当前过滤值
    const getFilterValues = () => {
      const result: FilterValues = {};
      props.items.forEach(item => {
        const value = formValues[item.field];
        if (value !== undefined && value !== null && value !== '') {
          result[item.field] = value;
        }
      });
      return result;
    };

    // 查询
    const handleSearch = () => {
      const values = getFilterValues();
      emit('update:modelValue', values);
      emit('search', values);
    };

    // 重置
    const handleReset = () => {
      props.items.forEach(item => {
        if (props.defaultValue && props.defaultValue[item.field] !== undefined) {
          formValues[item.field] = props.defaultValue[item.field];
        } else {
          formValues[item.field] = item.type === 'daterange' ? null : undefined;
        }
      });
      resetKey.value++;
      const resetValues = { ...props.defaultValue };
      emit('update:modelValue', resetValues);
      emit('reset', resetValues);
    };

    // 渲染过滤项
    const renderFilterItem = (item: FilterItem) => {
      const width = item.width || 240;
      const style = { width: typeof width === 'number' ? `${width}px` : width };

      switch (item.type) {
        case 'input':
          return h(NInput, {
            value: formValues[item.field],
            placeholder: item.placeholder || `请输入${item.label}`,
            clearable: true,
            size: props.size,
            style,
            'onUpdate:value': (val: string) => {
              formValues[item.field] = val;
            },
          });

        case 'select':
          return h(NSelect, {
            value: formValues[item.field],
            placeholder: item.placeholder || `请选择${item.label}`,
            options: item.options || [],
            clearable: true,
            size: props.size,
            style,
            'onUpdate:value': (val: string | number) => {
              formValues[item.field] = val;
            },
          });

        case 'date':
          return h(NDatePicker, {
            value: formValues[item.field],
            placeholder: item.placeholder || `请选择${item.label}`,
            type: 'date',
            clearable: true,
            size: props.size,
            style,
            'onUpdate:value': (val: number | null) => {
              formValues[item.field] = val;
            },
          });

        case 'daterange':
          return h(NDatePicker, {
            value: formValues[item.field],
            startPlaceholder: '开始日期',
            endPlaceholder: '结束日期',
            type: 'daterange',
            clearable: true,
            size: props.size,
            style,
            'onUpdate:value': (val: [number, number] | null) => {
              formValues[item.field] = val;
            },
          });

        default:
          return null;
      }
    };

    return () => (
      <div class="le-filter">
        <div class="le-filter__items" key={resetKey.value}>
          {props.items.map(item => (
            <div class="le-filter__item" key={item.field}>
              {renderFilterItem(item)}
            </div>
          ))}
        </div>
        <div class="le-filter__actions">
          <NSpace>
            <NButton type="primary" size={props.size} onClick={handleSearch}>
              {props.searchText}
            </NButton>
            {props.showReset && (
              <NButton size={props.size} onClick={handleReset}>
                {props.resetText}
              </NButton>
            )}
          </NSpace>
        </div>
      </div>
    );
  },
});

export default Filter;
