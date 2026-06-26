/**
 * @Description: SVG 图标组件导出
 */
import type { App } from 'vue';
import { SvgIcon } from './SvgIcon';

export type { SvgIconProps } from './SvgIcon';

// 组件注册
SvgIcon.install = (app: App): void => {
  app.component('LeSvgIcon', SvgIcon);
};

export { SvgIcon, SvgIcon as LeSvgIcon };

export default SvgIcon;
