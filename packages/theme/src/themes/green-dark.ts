import { createTheme } from '../core/createTheme';

export const greenDark = createTheme(
  'green',
  '绿色',
  false,
  {
    // 背景颜色 - 自然的绿色调
    '--bg': '#f0fdf4',
    '--bg-soft': '#dcfce7',
    '--bg-muted': '#bbf7d0',

    // 文本颜色
    '--text': '#052e16',
    '--text-soft': '#14532d',
    '--text-muted': '#166534',

    // 功能色 - 绿色系为主
    '--primary': '#22c55e',
    '--primary-hover': '#16a34a',
    '--primary-active': '#4ade80',
    '--success': '#10b981',
    '--warning': '#fbbf24',
    '--error': '#f87171',
    '--info': '#06b6d4',

    // 边框
    '--border': '#86efac',
    '--border-soft': '#bbf7d0',

    // 阴影 - 绿色调阴影
    '--shadow-sm': '0 1px 2px 0 rgba(34, 197, 94, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(34, 197, 94, 0.1), 0 2px 4px -1px rgba(34, 197, 94, 0.06)',
    '--shadow-lg':
      '0 10px 15px -3px rgba(34, 197, 94, 0.1), 0 4px 6px -2px rgba(34, 197, 94, 0.05)',
  },
  '清新自然的绿色主题，给人舒适、环保、健康的感觉'
);

// 导出主题的展示颜色
export const greenDisplayColor = '#22c55e';
