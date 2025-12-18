/**
 * Naive UI 主题适配器
 * 将主题配置转换为 Naive UI 的 themeOverrides
 */
import type { GlobalThemeOverrides } from 'naive-ui';
import type { ThemeConfig } from '../types/theme';

/**
 * 生成 Naive UI 主题配置
 * @param config 主题配置
 */
export function createNaiveTheme(config: ThemeConfig): GlobalThemeOverrides {
  const { colors } = config;

  return {
    common: {
      // 主色
      primaryColor: colors.primary,
      primaryColorHover: colors.primaryHover,
      primaryColorPressed: colors.primaryActive,
      primaryColorSuppl: colors.primarySuppl,

      // 功能色
      infoColor: colors.info,
      infoColorHover: colors.infoHover,
      infoColorPressed: colors.infoActive,
      infoColorSuppl: colors.infoSuppl,

      successColor: colors.success,
      successColorHover: colors.successHover,
      successColorPressed: colors.successActive,
      successColorSuppl: colors.successSuppl,

      warningColor: colors.warning,
      warningColorHover: colors.warningHover,
      warningColorPressed: colors.warningActive,
      warningColorSuppl: colors.warningSuppl,

      errorColor: colors.error,
      errorColorHover: colors.errorHover,
      errorColorPressed: colors.errorActive,
      errorColorSuppl: colors.errorSuppl,

      // 文本色
      textColorBase: colors.text.primary,
      textColor1: colors.text.primary,
      textColor2: colors.text.secondary,
      textColor3: colors.text.tertiary,
      textColorDisabled: colors.text.disabled,

      // 背景色
      baseColor: colors.neutral.base,
      bodyColor: colors.neutral.body,
      cardColor: colors.neutral.card,
      modalColor: colors.neutral.modal,
      popoverColor: colors.neutral.popover,

      // 边框色
      borderColor: colors.border.base,
      dividerColor: colors.divider,

      // 透明度
      opacityDisabled: String(colors.opacity.disabled),

      // 圆角
      borderRadius: config.tokens.radius.md,
      borderRadiusSmall: config.tokens.radius.sm,

      // 字体
      fontSize: config.tokens.fontSize.md,
      fontSizeMini: config.tokens.fontSize.xs,
      fontSizeTiny: config.tokens.fontSize.xs,
      fontSizeSmall: config.tokens.fontSize.sm,
      fontSizeMedium: config.tokens.fontSize.md,
      fontSizeLarge: config.tokens.fontSize.lg,
      fontSizeHuge: config.tokens.fontSize.xl,

      // 间距
      heightMini: '28px',
      heightTiny: '34px',
      heightSmall: '34px',
      heightMedium: '40px',
      heightLarge: '40px',
      heightHuge: '46px',
    },

    // 注意：Menu 组件配置请使用专门的函数
    // - createSidebarMenuTheme(): 侧边栏菜单（白色文字）
    // - createDefaultMenuTheme(): 普通菜单（自适应明暗模式）

    // Button 组件
    Button: {
      textColor: colors.text.primary,
      color: colors.bg.base,
      colorHover: colors.bg.hover,
      colorPressed: colors.bg.active,
      borderColor: colors.border.base,
      borderColorHover: colors.border.dark,
      borderColorPressed: colors.border.dark,
    },

    // Input 组件
    Input: {
      color: colors.bg.base,
      colorFocus: colors.bg.base,
      textColor: colors.text.primary,
      textColorDisabled: colors.text.disabled,
      placeholderColor: colors.text.tertiary,
      placeholderColorDisabled: colors.text.disabled,
      borderColor: colors.border.base,
      borderColorHover: colors.primaryHover,
      borderColorFocus: colors.primary,
      borderColorDisabled: colors.border.light,
      backgroundColor: colors.bg.base,
      backgroundColorDisabled: colors.bg.disabled,
    },

    // Card 组件
    Card: {
      color: colors.neutral.card,
      textColor: colors.text.primary,
      borderColor: colors.border.base,
      titleTextColor: colors.text.primary,
    },

    // DataTable 组件
    DataTable: {
      // 表头样式
      thColor: colors.bg.section,
      thTextColor: colors.text.primary,
      thFontWeight: '600',
      thButtonColorHover: colors.bg.hover,
      thColorHover: colors.bg.section,

      // 单元格样式
      tdColor: colors.neutral.card,
      tdTextColor: colors.text.primary,
      tdColorHover: colors.bg.hover,
      tdColorStriped: colors.bg.section,

      // 边框颜色
      borderColor: colors.divider,
      thBorderColor: colors.divider,
      tdBorderColor: colors.divider,

      // 排序图标
      sorterColor: colors.text.tertiary,
      sorterColorHover: colors.text.secondary,

      // 过滤图标
      filterColor: colors.text.tertiary,
      filterColorHover: colors.text.secondary,
    },

    // Pagination 组件
    Pagination: {
      // 分页项文字颜色
      itemTextColor: colors.text.primary,
      itemTextColorHover: colors.text.primary,
      itemTextColorActive: '#fff',
      itemTextColorDisabled: colors.text.disabled,
      itemTextColorPressed: '#fff',

      // 分页项背景颜色
      itemColor: 'transparent',
      itemColorHover: colors.bg.hover,
      itemColorActive: colors.primary,
      itemColorActiveHover: colors.primaryActive,
      itemColorDisabled: 'transparent',
      itemColorPressed: colors.primaryActive,

      // 分页项边框
      itemBorder: `1px solid ${colors.border.base}`,
      itemBorderHover: `1px solid ${colors.border.base}`,
      itemBorderActive: `1px solid ${colors.primary}`,
      itemBorderDisabled: `1px solid ${colors.border.light}`,
      itemBorderPressed: `1px solid ${colors.primaryActive}`,

      // 按钮样式
      buttonColor: 'transparent',
      buttonColorHover: colors.bg.hover,
      buttonColorPressed: colors.bg.active,
      buttonBorder: `1px solid ${colors.border.base}`,
      buttonBorderHover: `1px solid ${colors.border.base}`,
      buttonBorderPressed: `1px solid ${colors.border.dark}`,
      buttonIconColor: colors.text.secondary,
      buttonIconColorHover: colors.text.primary,
      buttonIconColorPressed: colors.text.primary,

      // 输入框样式（快速跳转）
      inputColor: colors.bg.base,
      inputColorDisabled: colors.bg.disabled,
      inputBorder: `1px solid ${colors.border.base}`,
      inputBorderHover: `1px solid ${colors.primaryHover}`,
      inputBorderFocus: `1px solid ${colors.primary}`,

      // 选择器样式（每页条数）
      selectColor: colors.bg.base,
      selectColorDisabled: colors.bg.disabled,
    },

    // Dialog 组件
    Dialog: {
      color: colors.neutral.modal,
      textColor: colors.text.primary,
      iconColor: colors.text.secondary,
      titleTextColor: colors.text.primary,
    },

    // Message 组件
    Message: {
      color: colors.neutral.popover,
      textColor: colors.text.primary,
    },

    // Notification 组件
    Notification: {
      color: colors.neutral.popover,
      textColor: colors.text.primary,
      headerTextColor: colors.text.primary,
      descriptionTextColor: colors.text.secondary,
    },

    // Popover 组件
    Popover: {
      color: colors.neutral.popover,
      textColor: colors.text.primary,
    },

    // Select 组件
    Select: {
      peers: {
        InternalSelection: {
          textColor: colors.text.primary,
          textColorDisabled: colors.text.disabled,
          placeholderColor: colors.text.tertiary,
          placeholderColorDisabled: colors.text.disabled,
          color: colors.bg.base,
          colorDisabled: colors.bg.disabled,
          colorActive: colors.bg.base,
          border: `1px solid ${colors.border.base}`,
          borderHover: `1px solid ${colors.primaryHover}`,
          borderActive: `1px solid ${colors.primary}`,
          borderFocus: `1px solid ${colors.primary}`,
        },
        InternalSelectMenu: {
          color: colors.neutral.popover,
          optionTextColor: colors.text.primary,
          optionTextColorActive: colors.primary,
          optionTextColorDisabled: colors.text.disabled,
          optionColorActive: colors.bg.hover,
        },
      },
    },

    // DatePicker 组件
    DatePicker: {
      itemTextColor: colors.text.primary,
      itemTextColorDisabled: colors.text.disabled,
      itemTextColorActive: colors.primary,
      itemTextColorCurrent: colors.primary,
      itemColorActive: colors.bg.hover,
      itemColorHover: colors.bg.hover,
      itemColorDisabled: colors.bg.disabled,
      panelColor: colors.neutral.popover,
      panelTextColor: colors.text.primary,
      arrowColor: colors.text.secondary,
    },
  };
}

/**
 * 创建 Naive UI 深色主题覆盖
 * @param config 主题配置
 * @description 专门为深色模式优化，配合 darkTheme 使用
 */
export function createNaiveDarkTheme(config: ThemeConfig): GlobalThemeOverrides {
  if (config.mode !== 'dark') {
    console.warn('createNaiveDarkTheme called with non-dark theme config');
  }

  const baseOverrides = createNaiveTheme(config);

  // 深色模式特殊处理
  return {
    ...baseOverrides,
    common: {
      ...baseOverrides.common,
      // 深色模式下可能需要调整的颜色
      // Naive UI 的 darkTheme 已经处理了大部分，这里只需要处理主题色
    },
    // 深色模式下某些组件可能需要特殊处理
    Card: {
      ...baseOverrides.Card,
      // 深色模式下卡片样式
    },
    Table: {
      ...baseOverrides.Table,
      // 深色模式下表格已在 createNaiveTheme 中处理
    },
  };
}

/**
 * 创建 Naive UI 浅色主题覆盖
 * @param config 主题配置
 * @description 专门为浅色模式优化，配合默认主题使用
 */
export function createNaiveLightTheme(config: ThemeConfig): GlobalThemeOverrides {
  if (config.mode !== 'light') {
    console.warn('createNaiveLightTheme called with non-light theme config');
  }

  // 浅色模式直接使用基础配置
  return createNaiveTheme(config);
}
