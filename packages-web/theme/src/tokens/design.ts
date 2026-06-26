/**
 * 设计 tokens - 定义主题系统的基础变量
 * 包含间距、圆角、字体大小、阴影等设计规范
 */

export interface DesignTokens {
  // 间距系统 (spacing)
  spacing: {
    xs: string; // 4px
    sm: string; // 8px
    md: string; // 12px
    lg: string; // 16px
    xl: string; // 20px
    xxl: string; // 24px
    xxxl: string; // 32px
  };

  // 圆角系统 (radius)
  radius: {
    xs: string; // 2px
    sm: string; // 4px
    md: string; // 6px
    lg: string; // 8px
    xl: string; // 12px
    xxl: string; // 16px
    round: string; // 50%
  };

  // 字体大小系统 (fontSize)
  fontSize: {
    xs: string; // 12px
    sm: string; // 14px
    md: string; // 16px
    lg: string; // 18px
    xl: string; // 20px
    xxl: string; // 24px
    xxxl: string; // 32px
    display: string; // 48px
  };

  // 字体粗细 (fontWeight)
  fontWeight: {
    light: number; // 300
    regular: number; // 400
    medium: number; // 500
    semibold: number; // 600
    bold: number; // 700
  };

  // 行高系统 (lineHeight)
  lineHeight: {
    tight: number; // 1.25
    normal: number; // 1.5
    relaxed: number; // 1.75
    loose: number; // 2
  };

  // 阴影系统 (shadow)
  shadow: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    xxl: string;
    inner: string;
  };

  // 动画时长 (duration)
  duration: {
    fast: string; // 150ms
    normal: string; // 300ms
    slow: string; // 500ms
  };

  // 动画缓动函数 (easing)
  easing: {
    linear: string;
    easeIn: string;
    easeOut: string;
    easeInOut: string;
  };

  // 层级系统 (zIndex)
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}

/**
 * 默认设计 tokens
 */
export const defaultDesignTokens: DesignTokens = {
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
  },

  radius: {
    xs: '2px',
    sm: '4px',
    md: '6px',
    lg: '8px',
    xl: '12px',
    xxl: '16px',
    round: '50%',
  },

  fontSize: {
    xs: '12px',
    sm: '14px',
    md: '16px',
    lg: '18px',
    xl: '20px',
    xxl: '24px',
    xxxl: '32px',
    display: '48px',
  },

  fontWeight: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },

  shadow: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    xxl: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  },

  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
  },

  easing: {
    linear: 'linear',
    easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
    easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
    easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
  },

  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};
