import type { GlobalThemeOverrides } from 'naive-ui';
import type { ThemeDefinition } from '../types';
import { withOpacity } from '../utils/color';

/**
 * 创建 Naive UI 主题覆盖配置
 */
export function createNaiveOverrides(theme: ThemeDefinition): GlobalThemeOverrides {
  const vars = theme.vars;

  return {
    common: {
      // 主色
      primaryColor: vars['--primary'],
      primaryColorHover: vars['--primary-hover'],
      primaryColorPressed: vars['--primary-active'],
      primaryColorSuppl: vars['--primary'],

      // 功能色
      successColor: vars['--success'],
      warningColor: vars['--warning'],
      errorColor: vars['--error'],
      infoColor: vars['--info'],

      // 背景色
      bodyColor: vars['--bg'],
      cardColor: vars['--bg-soft'],
      modalColor: vars['--bg-soft'],
      popoverColor: vars['--bg-soft'],

      // 文本色
      textColor1: vars['--text'],
      textColor2: vars['--text-soft'],
      textColor3: vars['--text-muted'],

      // 边框
      borderColor: vars['--border'],
      dividerColor: vars['--border-soft'],

      // 圆角
      borderRadius: vars['--radius-md'],
      borderRadiusSmall: vars['--radius-sm'],

      // 字体
      fontSize: vars['--font-size-base'],
      fontSizeSmall: vars['--font-size-sm'],
      fontSizeLarge: vars['--font-size-lg'],
      fontFamily: vars['--font-family'],
    },

    Button: {
      borderRadiusSmall: vars['--radius-sm'],
      borderRadiusMedium: vars['--radius-md'],
      borderRadiusLarge: vars['--radius-lg'],
      heightSmall: '28px',
      heightMedium: '32px',
      heightLarge: '36px',
      paddingSmall: '0 12px',
      paddingMedium: '0 16px',
      paddingLarge: '0 20px',
    },

    Input: {
      borderRadius: vars['--radius-md'],
      heightSmall: '28px',
      heightMedium: '32px',
      heightLarge: '36px',
      color: vars['--bg-soft'],
      colorFocus: vars['--bg-soft'],
      borderHover: `1px solid ${withOpacity(vars['--primary'], 0.4)}`,
      borderFocus: `1px solid ${vars['--primary']}`,
    },

    Card: {
      borderRadius: vars['--radius-lg'],
      paddingSmall: vars['--spacing-sm'],
      paddingMedium: vars['--spacing-md'],
      paddingLarge: vars['--spacing-lg'],
      boxShadowSmall: vars['--shadow-sm'],
      boxShadowMedium: vars['--shadow-md'],
      boxShadowLarge: vars['--shadow-lg'],
    },

    Dialog: {
      borderRadius: vars['--radius-lg'],
    },

    Message: {
      borderRadius: vars['--radius-md'],
    },

    Notification: {
      borderRadius: vars['--radius-md'],
    },
  } as GlobalThemeOverrides;
}

/**
 * 创建暗色主题判断函数
 */
export function createNaiveThemeHelper(theme: ThemeDefinition) {
  return {
    isDark: theme.isDark,
    theme: theme.isDark ? 'dark' : 'light',
    overrides: createNaiveOverrides(theme),
  };
}
