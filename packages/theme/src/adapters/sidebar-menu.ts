/**
 * 侧边栏菜单专用主题配置
 * 由于侧边栏通常使用深色背景（主题色），需要白色文字
 */

import type { MenuThemeVars } from 'naive-ui/es/menu/styles';

/**
 * 创建侧边栏菜单主题
 * 无论是浅色还是深色模式，都使用白色文字以保证在深色背景上的可读性
 */
export function createSidebarMenuTheme(): Partial<MenuThemeVars> {
  return {
    // 文字和图标颜色（白色系）
    itemTextColor: 'rgba(255, 255, 255, 0.82)', // 普通状态：白色带透明度
    itemIconColor: 'rgba(255, 255, 255, 0.82)',
    itemTextColorHover: '#ffffff', // 悬停时：纯白色
    itemIconColorHover: '#ffffff',
    itemTextColorActive: '#ffffff', // 激活时：纯白色
    itemIconColorActive: '#ffffff',
    itemTextColorActiveHover: '#ffffff', // 激活+悬停时：纯白色
    itemIconColorActiveHover: '#ffffff', // 激活+悬停图标：纯白色
    itemTextColorChildActive: '#ffffff', // 子项激活：纯白色
    itemIconColorChildActive: '#ffffff',
    itemTextColorChildActiveHover: '#ffffff', // 子项激活+悬停：纯白色
    itemIconColorChildActiveHover: '#ffffff', // 子项激活+悬停图标：纯白色
    itemIconColorCollapsed: 'rgba(255, 255, 255)', // 收缩状态背景
    itemColorActiveCollapsed: 'rgba(255, 255, 255, 0.15)', // 收缩状态激活背景
    itemColorActiveCollapsedInverted: 'rgba(255, 255, 255, 0.15)', // 收缩状态激活背景（反色）

    // 背景色（白色半透明）
    itemColorHover: 'rgba(255, 255, 255, 0.1)', // 悬停背景
    itemColorActive: 'rgba(255, 255, 255, 0.15)', // 激活背景
    itemColorActiveHover: 'rgba(255, 255, 255, 0.2)', // 激活+悬停背景

    // 箭头颜色
    arrowColor: 'rgba(255, 255, 255, 0.6)',
    arrowColorHover: 'rgba(255, 255, 255, 0.9)',
    arrowColorActive: '#ffffff',
    arrowColorActiveHover: '#ffffff', // 箭头激活+悬停：纯白色
    arrowColorChildActive: '#ffffff',
    arrowColorChildActiveHover: '#ffffff', // 子项箭头激活+悬停：纯白色

    // 横向菜单（如果有）
    itemTextColorHorizontal: 'rgba(255, 255, 255, 0.82)',
    itemIconColorHorizontal: 'rgba(255, 255, 255, 0.82)',
    itemTextColorHoverHorizontal: '#ffffff', // 横向悬停文字：纯白色
    itemIconColorHoverHorizontal: '#ffffff', // 横向悬停图标：纯白色
    itemTextColorActiveHorizontal: '#ffffff',
    itemIconColorActiveHorizontal: '#ffffff',
    itemTextColorActiveHoverHorizontal: '#ffffff', // 横向激活+悬停：纯白色
    itemIconColorActiveHoverHorizontal: '#ffffff', // 横向激活+悬停图标：纯白色
    itemTextColorChildActiveHorizontal: '#ffffff',
    itemIconColorChildActiveHorizontal: '#ffffff',
    itemTextColorChildActiveHoverHorizontal: '#ffffff', // 横向子项激活+悬停：纯白色
    itemIconColorChildActiveHoverHorizontal: '#ffffff', // 横向子项激活+悬停图标：纯白色

    // 分组标题
    groupTextColor: 'rgba(255, 255, 255, 0.5)',
  };
}

/**
 * 创建普通菜单主题（用于非侧边栏场景）
 * 这个函数保留原有的根据明暗模式自适应的逻辑
 */
export function createDefaultMenuTheme(colors: any, isDark: boolean): Partial<MenuThemeVars> {
  return {
    itemTextColor: colors.text.primary,
    itemIconColor: colors.text.secondary,
    itemTextColorHover: colors.primary,
    itemIconColorHover: colors.primary,
    itemTextColorActive: colors.primary,
    itemIconColorActive: colors.primary,
    itemTextColorChildActive: colors.primary,
    itemIconColorChildActive: colors.primary,
    itemColorHover: isDark ? `${colors.primary}1a` : `${colors.primary}0d`,
    itemColorActive: isDark ? `${colors.primary}26` : `${colors.primary}1a`,
    itemColorActiveHover: isDark ? `${colors.primary}33` : `${colors.primary}26`,
    itemTextColorHorizontal: colors.text.primary,
    itemIconColorHorizontal: colors.text.secondary,
    itemTextColorHoverHorizontal: colors.primary,
    itemIconColorHoverHorizontal: colors.primary,
    itemTextColorActiveHorizontal: colors.primary,
    itemIconColorActiveHorizontal: colors.primary,
    itemTextColorChildActiveHorizontal: colors.primary,
    itemIconColorChildActiveHorizontal: colors.primary,
  };
}
