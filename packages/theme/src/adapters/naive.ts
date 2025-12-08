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
  const isDark = config.mode === 'dark';

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

    // Menu 组件配置（使用主题色）
    Menu: {
      itemTextColor: colors.text.primary,
      itemIconColor: colors.text.secondary,
      itemTextColorHover: colors.primary,
      itemIconColorHover: colors.primary,
      itemTextColorActive: colors.primary,
      itemIconColorActive: colors.primary,
      itemTextColorChildActive: colors.primary,
      itemIconColorChildActive: colors.primary,
      itemColorHover: isDark ? `${colors.primary}1a` : `${colors.primary}0d`, // 10% / 5% 不透明度
      itemColorActive: isDark ? `${colors.primary}26` : `${colors.primary}1a`, // 15% / 10% 不透明度
      itemColorActiveHover: isDark ? `${colors.primary}33` : `${colors.primary}26`, // 20% / 15% 不透明度
      itemTextColorHorizontal: colors.text.primary,
      itemIconColorHorizontal: colors.text.secondary,
      itemTextColorHoverHorizontal: colors.primary,
      itemIconColorHoverHorizontal: colors.primary,
      itemTextColorActiveHorizontal: colors.primary,
      itemIconColorActiveHorizontal: colors.primary,
      itemTextColorChildActiveHorizontal: colors.primary,
      itemIconColorChildActiveHorizontal: colors.primary,
      // 添加更多样式使菜单更美观
      borderColor: 'transparent',
      borderColorHorizontal: 'transparent',
      color: 'transparent', // 菜单背景透明
      colorHorizontal: 'transparent',
    },

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

    // Table 组件
    Table: isDark
      ? {
          tdColor: colors.neutral.card,
          thColor: colors.neutral.modal,
          thTextColor: colors.text.primary,
          tdTextColor: colors.text.primary,
          borderColor: colors.border.base,
          // 深色模式下的表格特殊处理
        }
      : {
          // 浅色模式保持默认或轻微调整
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
