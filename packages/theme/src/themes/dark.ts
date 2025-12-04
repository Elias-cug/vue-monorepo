import { createTheme, createDarkVars } from '../core/createTheme';

export const dark = createTheme(
  'dark',
  '暗色',
  true,
  createDarkVars(),
  '默认的暗色主题，适合晚上或弱光环境使用'
);

// 导出主题的展示颜色
export const darkDisplayColor = '#111827';
