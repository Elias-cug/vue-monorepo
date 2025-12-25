import { defineComponent, ref, computed, watch, h } from 'vue';
import type { PropType, CSSProperties } from 'vue';
import { NDataTable, NPagination, NSpin } from 'naive-ui';
import type { DataTableProps, DataTableColumn } from 'naive-ui';
import { OperateGroup } from '../../operate-group';
import type { OperateOption } from '../../operate-group';
import './styles/index.scss';

export interface TablePagination {
  /** 当前页码 */
  page: number;
  /** 每页条数 */
  pageSize: number;
  /** 总条数 */
  total: number;
}

/** 操作列配置 */
export interface OperateColumnConfig {
  /** 列标题 */
  title?: string;
  /** 列宽度 */
  width?: number;
  /** 固定位置 */
  fixed?: 'left' | 'right';
  /** 操作项生成函数 */
  options: (rowData: any, rowIndex: number) => OperateOption[];
}

/**
 * LeTable 组件属性
 * 注意：大部分属性通过 attrs 透传给 NDataTable 和 NPagination
 * 这里只定义 LeTable 特有的属性
 */
export interface TableProps extends Partial<DataTableProps> {
  /** 列配置 */
  columns?: DataTableColumn[];
  /** 是否显示序号列 */
  showIndex?: boolean;
  /** 序号列标题 */
  indexTitle?: string;
  /** 序号列宽度 */
  indexWidth?: number;
  /** 操作列配置 */
  operateColumn?: OperateColumnConfig;
  /** 是否加载中 */
  loading?: boolean;
  /** 分页配置，false 表示不显示分页 */
  pagination?: TablePagination | false;
  /** 是否远程数据模式 */
  remote?: boolean;
  /** 表格尺寸 */
  size?: 'small' | 'medium' | 'large';
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
  /** 顶部左侧提示文字颜色 */
  tipColor?: string;
  /** 自定义样式 */
  style?: CSSProperties;
  /** 自定义类名 */
  class?: string;
}

/**
 * LeTable 特有的 props
 * 其他属性通过 inheritAttrs: false + useAttrs() 透传
 */
const tableProps = {
  columns: {
    type: Array as PropType<DataTableColumn[]>,
    default: () => [],
  },
  showIndex: {
    type: Boolean,
    default: false,
  },
  indexTitle: {
    type: String,
    default: '序号',
  },
  indexWidth: {
    type: Number,
    default: 60,
  },
  operateColumn: {
    type: Object as PropType<OperateColumnConfig>,
    default: undefined,
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
    default: true,
  },
  size: {
    type: String as PropType<'small' | 'medium' | 'large'>,
    default: 'small',
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
    default: false,
  },
  emptyDescription: {
    type: String,
    default: '暂无数据',
  },
  tipColor: {
    type: String,
    default: undefined,
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

export const Table = defineComponent({
  name: 'LeTable',
  inheritAttrs: false,
  props: tableProps,
  emits: ['update:page', 'update:pageSize', 'page-change', 'page-size-change'],
  setup(props, { slots, emit, attrs }) {
    // 获取透传的 data 属性
    const tableData = computed(() => (attrs.data as any[]) || []);

    // 处理列配置：添加序号列和操作列
    const processedColumns = computed(() => {
      const cols: DataTableColumn[] = [];

      // 添加序号列
      if (props.showIndex) {
        cols.push({
          title: props.indexTitle,
          key: '__index__',
          width: props.indexWidth,
          align: 'center',
          render: (_row, index) => {
            const pageOffset =
              props.remote && props.pagination !== false
                ? (currentPage.value - 1) * currentPageSize.value
                : 0;
            return pageOffset + index + 1;
          },
        });
      }

      // 添加用户定义的列
      cols.push(...props.columns);

      // 添加操作列
      if (props.operateColumn) {
        const { title = '操作', width = 150, fixed = 'right', options } = props.operateColumn;
        cols.push({
          title,
          key: '__operate__',
          width,
          fixed,
          render: (rowData, rowIndex) => {
            const operateOptions = options(rowData, rowIndex);
            return h(OperateGroup, {
              options: operateOptions,
              data: rowData,
            });
          },
        });
      }

      return cols;
    });

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
      return props.remote ? props.pagination.total : tableData.value.length;
    });

    // 当前页数据（非远程模式时需要切片）
    const displayData = computed(() => {
      if (props.remote || props.pagination === false) {
        return tableData.value;
      }
      const start = (internalPage.value - 1) * internalPageSize.value;
      const end = start + internalPageSize.value;
      return tableData.value.slice(start, end);
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

    // 页码变化处理（LeTable 特有逻辑：处理内部分页）
    const handlePageChange = (page: number) => {
      if (props.remote) {
        emit('update:page', page);
        emit('page-change', page);
      } else {
        internalPage.value = page;
        emit('page-change', page);
      }
    };

    // 每页条数变化处理（LeTable 特有逻辑：处理内部分页）
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

    // 构建类名
    const getClassNames = () => {
      const classes = ['le-table'];

      if (props.class) {
        classes.push(props.class);
      }

      return classes;
    };

    // 分离 DataTable 和 Pagination 的 attrs 和 events
    const dataTableAttrs = computed(() => {
      const {
        pageSizes,
        showSizePicker,
        showQuickJumper,
        size: _size,
        'onUpdate:page': _onUpdatePage,
        'onUpdate:pageSize': _onUpdatePageSize,
        'onPage-change': _onPageChange,
        'onPage-size-change': _onPageSizeChange,
        ...rest
      } = attrs;
      return rest;
    });

    // Pagination 属性：优先使用 props，其次使用 attrs
    const paginationAttrs = computed(() => {
      const attrsPageSizes = attrs.pageSizes as number[] | undefined;
      const attrsShowSizePicker = attrs.showSizePicker as boolean | undefined;
      const attrsShowQuickJumper = attrs.showQuickJumper as boolean | undefined;

      return {
        pageSizes: props.pageSizes ?? attrsPageSizes,
        showSizePicker: props.showSizePicker ?? attrsShowSizePicker,
        showQuickJumper: props.showQuickJumper ?? attrsShowQuickJumper,
      };
    });

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
        {/* 顶部工具栏 */}
        {(slots.headerLeft || slots.headerRight) && (
          <div class="le-table__header">
            <div
              class="le-table__header-left"
              style={{ color: props.tipColor || 'var(--le-warning, #faad14)' }}
            >
              {slots.headerLeft?.()}
            </div>
            <div class="le-table__header-right">{slots.headerRight?.()}</div>
          </div>
        )}

        {/* 表格主体 */}
        <div class="le-table__body">
          <NSpin show={props.loading}>
            <NDataTable
              {...dataTableAttrs.value}
              columns={processedColumns.value}
              data={displayData.value}
              remote={props.remote}
              size={props.size}
              pagination={false}
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
          <div class="le-table__pagination">
            <div class="le-table__pagination-total">总数: {total.value}</div>
            <div class="le-table__pagination-wrapper" style={getPaginationStyle()}>
              <NPagination
                {...paginationAttrs.value}
                page={currentPage.value}
                pageSize={currentPageSize.value}
                itemCount={total.value}
                onUpdate:page={handlePageChange}
                onUpdate:pageSize={handlePageSizeChange}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
});

export default Table;
