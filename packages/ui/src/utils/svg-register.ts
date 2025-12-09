/**
 * @Description: SVG 图标注册
 * 导入虚拟模块，让 vite-plugin-svg-icons 自动注册所有 SVG 图标
 */

import 'virtual:svg-icons-register';

/**
 * 获取所有 SVG 图标名称列表
 */
export function getAllSvgIconNames(): string[] {
  const icons: string[] = [];
  const symbols = document.querySelectorAll('svg defs symbol');

  symbols.forEach(symbol => {
    const id = symbol.id;
    if (id && id.startsWith('le-icon-')) {
      icons.push(id.replace('le-icon-', ''));
    }
  });

  return icons;
}

/**
 * 检查图标是否存在
 */
export function hasSvgIcon(name: string): boolean {
  return !!document.querySelector(`#le-icon-${name}`);
}

// 导出常用图标名称（用于类型提示）
export type IconName = 'home' | 'user' | 'settings' | 'search' | 'close' | 'menu';

// 也可以使用字符串类型，支持自定义图标
export type SvgIconName = IconName | (string & {});
