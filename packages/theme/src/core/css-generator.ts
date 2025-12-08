/**
 * CSS 变量生成器
 * 将主题配置转换为 CSS 变量并挂载到 DOM
 */
import type { ColorSystem, CssVariables } from '../types/theme';
import type { DesignTokens } from '../tokens/design';

/**
 * CSS 变量前缀
 */
const CSS_VAR_PREFIX = 'le';

/**
 * 生成 CSS 变量名
 * @param name 变量名
 * @param prefix 前缀
 */
function generateCssVarName(name: string, prefix = CSS_VAR_PREFIX): string {
  return `--${prefix}-${name}`;
}

/**
 * 将颜色系统转换为 CSS 变量
 * @param colors 颜色系统
 * @param prefix 前缀
 */
export function generateColorCssVars(
  colors: ColorSystem,
  prefix = CSS_VAR_PREFIX
): Record<string, string> {
  const cssVars: Record<string, string> = {};

  // 主色
  cssVars[generateCssVarName('primary', prefix)] = colors.primary;
  cssVars[generateCssVarName('primary-hover', prefix)] = colors.primaryHover;
  cssVars[generateCssVarName('primary-active', prefix)] = colors.primaryActive;
  cssVars[generateCssVarName('primary-suppl', prefix)] = colors.primarySuppl;

  // 功能色
  cssVars[generateCssVarName('info', prefix)] = colors.info;
  cssVars[generateCssVarName('info-hover', prefix)] = colors.infoHover;
  cssVars[generateCssVarName('info-active', prefix)] = colors.infoActive;
  cssVars[generateCssVarName('info-suppl', prefix)] = colors.infoSuppl;

  cssVars[generateCssVarName('success', prefix)] = colors.success;
  cssVars[generateCssVarName('success-hover', prefix)] = colors.successHover;
  cssVars[generateCssVarName('success-active', prefix)] = colors.successActive;
  cssVars[generateCssVarName('success-suppl', prefix)] = colors.successSuppl;

  cssVars[generateCssVarName('warning', prefix)] = colors.warning;
  cssVars[generateCssVarName('warning-hover', prefix)] = colors.warningHover;
  cssVars[generateCssVarName('warning-active', prefix)] = colors.warningActive;
  cssVars[generateCssVarName('warning-suppl', prefix)] = colors.warningSuppl;

  cssVars[generateCssVarName('error', prefix)] = colors.error;
  cssVars[generateCssVarName('error-hover', prefix)] = colors.errorHover;
  cssVars[generateCssVarName('error-active', prefix)] = colors.errorActive;
  cssVars[generateCssVarName('error-suppl', prefix)] = colors.errorSuppl;

  // 中性色
  cssVars[generateCssVarName('neutral-base', prefix)] = colors.neutral.base;
  cssVars[generateCssVarName('neutral-invert-base', prefix)] = colors.neutral.invertBase;
  cssVars[generateCssVarName('neutral-text-base', prefix)] = colors.neutral.textBase;
  cssVars[generateCssVarName('neutral-popover', prefix)] = colors.neutral.popover;
  cssVars[generateCssVarName('neutral-card', prefix)] = colors.neutral.card;
  cssVars[generateCssVarName('neutral-modal', prefix)] = colors.neutral.modal;
  cssVars[generateCssVarName('neutral-body', prefix)] = colors.neutral.body;

  // 文本色
  cssVars[generateCssVarName('text-base', prefix)] = colors.text.base;
  cssVars[generateCssVarName('text-primary', prefix)] = colors.text.primary;
  cssVars[generateCssVarName('text-secondary', prefix)] = colors.text.secondary;
  cssVars[generateCssVarName('text-tertiary', prefix)] = colors.text.tertiary;
  cssVars[generateCssVarName('text-disabled', prefix)] = colors.text.disabled;
  cssVars[generateCssVarName('text-inverse', prefix)] = colors.text.inverse;

  // 文本色别名（为了兼容性和易用性）
  cssVars[generateCssVarName('text-1', prefix)] = colors.text.base; // 主要文本
  cssVars[generateCssVarName('text-2', prefix)] = colors.text.secondary; // 次要文本
  cssVars[generateCssVarName('text-3', prefix)] = colors.text.tertiary; // 辅助文本
  cssVars[generateCssVarName('text-invert', prefix)] = colors.text.inverse; // 反色文本

  // 边框色
  cssVars[generateCssVarName('border-base', prefix)] = colors.border.base;
  cssVars[generateCssVarName('border-light', prefix)] = colors.border.light;
  cssVars[generateCssVarName('border-dark', prefix)] = colors.border.dark;

  // 边框色别名
  cssVars[generateCssVarName('border', prefix)] = colors.border.base; // 默认边框

  // 背景色
  cssVars[generateCssVarName('bg-base', prefix)] = colors.bg.base;
  cssVars[generateCssVarName('bg-container', prefix)] = colors.bg.container;
  cssVars[generateCssVarName('bg-elevated', prefix)] = colors.bg.elevated;
  cssVars[generateCssVarName('bg-section', prefix)] = colors.bg.section;
  cssVars[generateCssVarName('bg-hover', prefix)] = colors.bg.hover;
  cssVars[generateCssVarName('bg-active', prefix)] = colors.bg.active;
  cssVars[generateCssVarName('bg-disabled', prefix)] = colors.bg.disabled;

  // 背景色别名（常用的交互状态）
  cssVars[generateCssVarName('hover', prefix)] = colors.bg.hover; // 悬停背景
  cssVars[generateCssVarName('pressed', prefix)] = colors.bg.active; // 按下背景
  cssVars[generateCssVarName('card', prefix)] = colors.neutral.card; // 卡片背景（重复定义以便使用）
  cssVars[generateCssVarName('popover', prefix)] = colors.neutral.popover; // 气泡背景
  cssVars[generateCssVarName('modal', prefix)] = colors.neutral.modal; // 弹窗背景
  cssVars[generateCssVarName('body', prefix)] = colors.neutral.body; // 页面背景

  // 其他
  cssVars[generateCssVarName('divider', prefix)] = colors.divider;
  cssVars[generateCssVarName('mask', prefix)] = colors.mask;
  cssVars[generateCssVarName('code', prefix)] = colors.code;

  // 透明度
  cssVars[generateCssVarName('opacity-disabled', prefix)] = String(colors.opacity.disabled);
  cssVars[generateCssVarName('opacity-hover', prefix)] = String(colors.opacity.hover);
  cssVars[generateCssVarName('opacity-active', prefix)] = String(colors.opacity.active);

  return cssVars;
}

/**
 * 将设计 token 转换为 CSS 变量
 * @param tokens 设计 token
 * @param prefix 前缀
 */
export function generateTokenCssVars(
  tokens: DesignTokens,
  prefix = CSS_VAR_PREFIX
): Record<string, string | number> {
  const cssVars: Record<string, string | number> = {};

  // 间距
  Object.entries(tokens.spacing).forEach(([key, value]) => {
    cssVars[generateCssVarName(`spacing-${key}`, prefix)] = value;
  });

  // 圆角
  Object.entries(tokens.radius).forEach(([key, value]) => {
    cssVars[generateCssVarName(`radius-${key}`, prefix)] = value;
  });

  // 字体大小
  Object.entries(tokens.fontSize).forEach(([key, value]) => {
    cssVars[generateCssVarName(`font-size-${key}`, prefix)] = value;
  });

  // 字体粗细
  Object.entries(tokens.fontWeight).forEach(([key, value]) => {
    cssVars[generateCssVarName(`font-weight-${key}`, prefix)] = value;
  });

  // 行高
  Object.entries(tokens.lineHeight).forEach(([key, value]) => {
    cssVars[generateCssVarName(`line-height-${key}`, prefix)] = value;
  });

  // 阴影
  Object.entries(tokens.shadow).forEach(([key, value]) => {
    cssVars[generateCssVarName(`shadow-${key}`, prefix)] = value;
  });

  // 动画时长
  Object.entries(tokens.duration).forEach(([key, value]) => {
    cssVars[generateCssVarName(`duration-${key}`, prefix)] = value;
  });

  // 动画缓动函数
  Object.entries(tokens.easing).forEach(([key, value]) => {
    cssVars[generateCssVarName(`easing-${key}`, prefix)] = value;
  });

  // 层级
  Object.entries(tokens.zIndex).forEach(([key, value]) => {
    cssVars[generateCssVarName(`z-index-${key}`, prefix)] = value;
  });

  return cssVars;
}

/**
 * 生成完整的 CSS 变量
 * @param colors 颜色系统
 * @param tokens 设计 token
 * @param prefix 前缀
 */
export function generateCssVariables(
  colors: ColorSystem,
  tokens: DesignTokens,
  prefix = CSS_VAR_PREFIX
): CssVariables {
  return {
    colors: generateColorCssVars(colors, prefix),
    tokens: generateTokenCssVars(tokens, prefix),
  };
}

/**
 * 将 CSS 变量应用到元素
 * @param variables CSS 变量
 * @param element 目标元素，默认为 document.documentElement
 */
export function applyCssVariables(
  variables: CssVariables,
  element: HTMLElement = document.documentElement
): void {
  // 应用颜色变量
  Object.entries(variables.colors).forEach(([key, value]) => {
    element.style.setProperty(key, value);
  });

  // 应用 token 变量
  Object.entries(variables.tokens).forEach(([key, value]) => {
    element.style.setProperty(key, String(value));
  });
}

/**
 * 获取当前应用的 CSS 变量
 * @param element 目标元素，默认为 document.documentElement
 * @param prefix 前缀
 */
export function getCssVariables(
  element: HTMLElement = document.documentElement,
  prefix = CSS_VAR_PREFIX
): Record<string, string> {
  const computedStyle = getComputedStyle(element);
  const cssVars: Record<string, string> = {};

  // 获取所有 CSS 变量
  for (const prop of Array.from(computedStyle)) {
    if (prop.startsWith(`--${prefix}-`)) {
      cssVars[prop] = computedStyle.getPropertyValue(prop).trim();
    }
  }

  return cssVars;
}

/**
 * 移除 CSS 变量
 * @param element 目标元素，默认为 document.documentElement
 * @param prefix 前缀
 */
export function removeCssVariables(
  element: HTMLElement = document.documentElement,
  prefix = CSS_VAR_PREFIX
): void {
  const style = element.style;
  const props = [];

  // 收集所有需要移除的属性
  for (let i = 0; i < style.length; i++) {
    const prop = style[i];
    if (prop && prop.startsWith(`--${prefix}-`)) {
      props.push(prop);
    }
  }

  // 移除属性
  props.forEach(prop => {
    style.removeProperty(prop);
  });
}
