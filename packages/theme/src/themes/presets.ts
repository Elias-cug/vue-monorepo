/**
 * 主题预设配置
 * 基于 presets 中的颜色生成完整的主题配置
 */
import type { ThemePreset, ColorSystem } from '../types/theme';
import type { ColorPalette } from '../presets/types';
import * as colors from '../presets';
import { presetPrimaryColors } from '../presets';

/**
 * 生成颜色系统
 * @param palette 色板
 * @param isDark 是否深色模式
 */
function generateColorSystem(palette: ColorPalette, isDark = false): Partial<ColorSystem> {
  return {
    // 主色系统
    primary: palette[5]!,
    primaryHover: palette[4]!,
    primaryActive: palette[6]!,
    primarySuppl: palette[3]!,

    // 功能色
    info: isDark ? colors.blueDark[5]! : colors.blue[5]!,
    infoHover: isDark ? colors.blueDark[4]! : colors.blue[4]!,
    infoActive: isDark ? colors.blueDark[6]! : colors.blue[6]!,
    infoSuppl: isDark ? colors.blueDark[3]! : colors.blue[3]!,

    success: isDark ? colors.greenDark[5]! : colors.green[5]!,
    successHover: isDark ? colors.greenDark[4]! : colors.green[4]!,
    successActive: isDark ? colors.greenDark[6]! : colors.green[6]!,
    successSuppl: isDark ? colors.greenDark[3]! : colors.green[3]!,

    warning: isDark ? colors.goldDark[5]! : colors.gold[5]!,
    warningHover: isDark ? colors.goldDark[4]! : colors.gold[4]!,
    warningActive: isDark ? colors.goldDark[6]! : colors.gold[6]!,
    warningSuppl: isDark ? colors.goldDark[3]! : colors.gold[3]!,

    error: isDark ? colors.redDark[5]! : colors.red[5]!,
    errorHover: isDark ? colors.redDark[4]! : colors.red[4]!,
    errorActive: isDark ? colors.redDark[6]! : colors.red[6]!,
    errorSuppl: isDark ? colors.redDark[3]! : colors.red[3]!,

    // 中性色
    neutral: {
      base: isDark ? '#000000' : '#ffffff',
      invertBase: isDark ? '#ffffff' : '#000000',
      textBase: isDark ? '#ffffffd1' : '#000000e0',
      popover: isDark ? '#48484e' : '#ffffff',
      card: isDark ? '#1c1c1e' : '#ffffff',
      modal: isDark ? '#2c2c2e' : '#ffffff',
      body: isDark ? '#000000' : '#f5f5f5',
    },

    // 文本色
    text: {
      base: isDark ? '#ffffffd1' : '#000000e0',
      primary: isDark ? '#ffffffd1' : '#000000e0',
      secondary: isDark ? '#ffffffa6' : '#00000073',
      tertiary: isDark ? '#ffffff8a' : '#00000045',
      disabled: isDark ? '#ffffff40' : '#00000040',
      inverse: isDark ? '#000000e0' : '#ffffffd1',
    },

    // 边框色
    border: {
      base: isDark ? '#48484e' : '#e8e8e8',
      light: isDark ? '#3a3a3c' : '#f0f0f0',
      dark: isDark ? '#58585c' : '#d8d8d8',
    },

    // 背景色
    bg: {
      base: isDark ? '#000000' : '#ffffff',
      container: isDark ? '#1c1c1e' : '#f5f5f5',
      elevated: isDark ? '#2c2c2e' : '#ffffff',
      section: isDark ? '#38383a' : '#fafafa',
      hover: isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.04)',
      active: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.08)',
      disabled: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
    },

    // 其他
    divider: isDark ? '#48484e' : '#e8e8e8',
    mask: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.45)',
    code: isDark ? '#2c2c2e' : '#f5f5f5',

    // 透明度
    opacity: {
      disabled: 0.5,
      hover: 0.08,
      active: 0.12,
    },
  };
}

/**
 * 主题预设列表
 */
export const themePresets: Record<string, ThemePreset> = {
  // 蓝色主题
  blue: {
    name: 'blue',
    primaryColor: presetPrimaryColors.blue,
    light: generateColorSystem(colors.blue, false),
    dark: generateColorSystem(colors.blueDark, true),
  },

  // 红色主题
  red: {
    name: 'red',
    primaryColor: presetPrimaryColors.red,
    light: generateColorSystem(colors.red, false),
    dark: generateColorSystem(colors.redDark, true),
  },

  // 橙色主题
  orange: {
    name: 'orange',
    primaryColor: presetPrimaryColors.orange,
    light: generateColorSystem(colors.orange, false),
    dark: generateColorSystem(colors.orangeDark, true),
  },

  // 绿色主题
  green: {
    name: 'green',
    primaryColor: presetPrimaryColors.green,
    light: generateColorSystem(colors.green, false),
    dark: generateColorSystem(colors.greenDark, true),
  },

  // 紫色主题
  purple: {
    name: 'purple',
    primaryColor: presetPrimaryColors.purple,
    light: generateColorSystem(colors.purple, false),
    dark: generateColorSystem(colors.purpleDark, true),
  },

  // 品红主题
  magenta: {
    name: 'magenta',
    primaryColor: presetPrimaryColors.magenta,
    light: generateColorSystem(colors.magenta, false),
    dark: generateColorSystem(colors.magentaDark, true),
  },

  // 青色主题
  cyan: {
    name: 'cyan',
    primaryColor: presetPrimaryColors.cyan,
    light: generateColorSystem(colors.cyan, false),
    dark: generateColorSystem(colors.cyanDark, true),
  },

  // 极客蓝主题
  geekblue: {
    name: 'geekblue',
    primaryColor: presetPrimaryColors.geekblue,
    light: generateColorSystem(colors.geekblue, false),
    dark: generateColorSystem(colors.geekblueDark, true),
  },

  // 火山橙主题
  volcano: {
    name: 'volcano',
    primaryColor: presetPrimaryColors.volcano,
    light: generateColorSystem(colors.volcano, false),
    dark: generateColorSystem(colors.volcanoDark, true),
  },

  // 金色主题
  gold: {
    name: 'gold',
    primaryColor: presetPrimaryColors.gold,
    light: generateColorSystem(colors.gold, false),
    dark: generateColorSystem(colors.goldDark, true),
  },

  // 黄色主题
  yellow: {
    name: 'yellow',
    primaryColor: presetPrimaryColors.yellow,
    light: generateColorSystem(colors.yellow, false),
    dark: generateColorSystem(colors.yellowDark, true),
  },

  // 青柠主题
  lime: {
    name: 'lime',
    primaryColor: presetPrimaryColors.lime,
    light: generateColorSystem(colors.lime, false),
    dark: generateColorSystem(colors.limeDark, true),
  },
};
