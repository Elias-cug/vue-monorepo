import { createTheme } from '../core/createTheme';

export const light = createTheme(
  'light',
  '浅色',
  false,
  {
    // 使用默认的浅色配置
  },
  '默认的浅色主题，适合白天使用'
);

// 导出主题的展示颜色
export const lightDisplayColor = '#f7f7f7';
