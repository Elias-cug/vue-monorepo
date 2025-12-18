import { defineComponent, ref, computed, watch } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NDataTable, NPagination, NSpin } from 'naive-ui';
import type { DataTableColumns, DataTableRowKey } from 'naive-ui';
import './styles/index.scss';

export interface TablePagination {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
}

export interface TableProps {
  /** 表格列配置 */
  columns?: DataTableColumns<any>;
  /** 表格数据 */
  data?: any[];
  /** 是否加载中 */
  loading?: boolean;
  /** 分页配置 */
  pagination?: TablePagination | false;
  /** 是否远程数据模式 */
  remote?: boolean;
  /** 行键 */
  rowKey?: (row: any) => DataTableRowKey;
  /** 是否显示边框 */
  bordered?: boolean;
  /** 是否单行省略 */
  singleLine?: boolean;
  /** 表格最大高度 */
  maxHeight?: number | string;
  /** 表格最小高度 */
  minHeight?: number | string;
  /** 是否开启条纹 */
  striped?: boolean;
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large';
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
  /** 分页位置 */
  paginationPosition?: 'left' | 'center' | 'right';
  /** 每页条数选项 */
  pageSizes?: number[];
  /** 是否显示每页条数选择器 */
  showSizePicker?: boolean;
  /** 是否显示快速跳转 */
  showQuickJumper?: boolean;
  /** 空状态描述 */
  emptyDescription?: string;
  /** 滚动配置 */
  scrollX?: number | string;
}

const tableProps = {
  columns: {
    type: Array as PropType<DataTableColumns<any>>,
    default: () => [],
  },
  data: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: [Object, Boolean] as PropType<TablePagination | false>,
    default: () => ({ page: 1, pageSize: 10, total: 0 }),
  },
  remote: {
    type: Boolean,
    default: false,
  },
  rowKey: {
    type: Function as PropType<(row: any) => DataTableRowKey>,
    default: (row: any) => row.id,
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  singleLine: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  minHeight: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
  striped: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'medium',
  },
  style: {
    type: Object as PropType<CSSProperties>,
    default: undefined,
  },
  class: {
    type: String,
    default: '',
  },
  paginationPosition: {
    type: String as PropType<'left' | 'center' | 'right'>,
    default: 'right',
  },
  pageSizes: {
    type: Array as PropType<number[]>,
    default: () => [10, 20, 30, 50, 100],
  },
  showSizePicker: {
    type: Boolean,
    default: true,
  },
  showQuickJumper: {
    type: Boolean,
    default: true,
  },
  emptyDescription: {
    type: String,
    default: '暂无数据',
  },
  scrollX: {
    type: [Number, String] as PropType<number | string>,
    default: undefined,
  },
} as const;

export const Table = defineComponent({
  name: 'LeTable',
  props: tableProps,
  emits: [
    'update:page',
    'update:pageSize',
    'update:sorter',
    'update:filters',
    'page-change',
    'page-size-change',
    'sorter-change',
    'filters-change',
  ],
  setup(props, { slots, emit }) {
    // 内部分页状态（非远程模式时使用）
    const internalPage = ref(1);
    const internalPageSize = ref(10);

    // 当前分页状态
    const currentPage = computed(() => {
      if (props.pagination === false) return 1;
      return props.remote ? props.pagination.page : internalPage.value;
    });

    const currentPageSize = computed(() => {
      if (props.pagination === false) return 10;
      return props.remote ? props.pagination.pageSize : internalPageSize.value;
    });

    const total = computed(() => {
      if (props.pagination === false) return 0;
      return props.remote ? props.pagination.total : props.data.length;
    });

    // 当前页数据（非远程模式时需要切片）
    const displayData = computed(() => {
      if (props.remote || props.pagination === false) {
        return props.data;
      }
      const start = (internalPage.value - 1) * internalPageSize.value;
      const end = start + internalPageSize.value;
      return props.data.slice(start, end);
    });

    // 监听 pagination 变化，同步内部状态
    watch(
      () => props.pagination,
      newPagination => {
        if (newPagination !== false && newPagination) {
          internalPage.value = newPagination.page;
          internalPageSize.value = newPagination.pageSize;
        }
      },
      { immediate: true, deep: true }
    );

    // 页码变化处理
    const handlePageChange = (page: number) => {
      if (props.remote) {
        emit('update:page', page);
        emit('page-change', page);
      } else {
        internalPage.value = page;
        emit('page-change', page);
      }
    };

    // 每页条数变化处理
    const handlePageSizeChange = (pageSize: number) => {
      if (props.remote) {
        emit('update:pageSize', pageSize);
        emit('page-size-change', pageSize);
      } else {
        internalPageSize.value = pageSize;
        internalPage.value = 1; // 重置到第一页
        emit('page-size-change', pageSize);
      }
    };

    // 排序变化处理
    const handleSorterChange = (sorter: any) => {
      emit('update:sorter', sorter);
      emit('sorter-change', sorter);
    };

    // 筛选变化处理
    const handleFiltersChange = (filters: any) => {
      emit('update:filters', filters);
      emit('filters-change', filters);
    };

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-table'];

      if (props.striped) {
        classes.push('le-table--striped');
      }

      if (props.class) {
        classes.push(props.class);
      }

      return classes;
    };

    // 分页对齐样式
    const getPaginationStyle = () => {
      const justifyMap = {
        left: 'flex-start',
        center: 'center',
        right: 'flex-end',
      };
      return {
        justifyContent: justifyMap[props.paginationPosition],
      };
    };

    return () => (
      <div class={getClassNames()} style={props.style}>
        {/* 表格主体 */}
        <div class="le-table__body">
          <NSpin show={props.loading}>
            <NDataTable
              columns={props.columns}
              data={displayData.value}
              remote={props.remote}
              rowKey={props.rowKey}
              bordered={props.bordered}
              singleLine={props.singleLine}
              maxHeight={props.maxHeight}
              minHeight={props.minHeight}
              striped={props.striped}
              size={props.size}
              scrollX={props.scrollX}
              pagination={false}
              onUpdate:sorter={handleSorterChange}
              onUpdate:filters={handleFiltersChange}
            >
              {{
                empty: slots.empty
                  ? () => slots.empty?.()
                  : () => <div class="le-table__empty">{props.emptyDescription}</div>,
              }}
            </NDataTable>
          </NSpin>
        </div>

        {/* 分页器 */}
        {props.pagination !== false && (
          <div class="le-table__pagination" style={getPaginationStyle()}>
            <NPagination
              page={currentPage.value}
              pageSize={currentPageSize.value}
              itemCount={total.value}
              pageSizes={props.pageSizes}
              showSizePicker={props.showSizePicker}
              showQuickJumper={props.showQuickJumper}
              onUpdate:page={handlePageChange}
              onUpdate:pageSize={handlePageSizeChange}
            />
          </div>
        )}
      </div>
    );
  },
});

export default Table;
