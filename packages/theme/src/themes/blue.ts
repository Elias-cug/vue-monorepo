import { createTheme } from '../core/createTheme';
import { palette } from '../palette';

export const blue = createTheme(
  'blue',
  '蓝色',
  false,
  {
    // 背景颜色
    '--bg': '#eef6ff',
    '--bg-soft': '#e6f0ff',
    '--bg-muted': '#d9e7ff',

    // 文本颜色
    '--text': '#032b4b',
    '--text-soft': '#1a3e5c',
    '--text-muted': '#4b5563',

    // 功能色
    '--primary': palette.primary[500],
    '--primary-hover': palette.primary[600],
    '--primary-active': palette.primary[400],

    // 边框
    '--border': '#bfd9ff',
    '--border-soft': '#d9e7ff',

    // 阴影 - 蓝色调
    '--shadow-sm': '0 1px 2px 0 rgba(64, 152, 252, 0.05)',
    '--shadow-md':
      '0 4px 6px -1px rgba(64, 152, 252, 0.1), 0 2px 4px -1px rgba(64, 152, 252, 0.06)',
    '--shadow-lg':
      '0 10px 15px -3px rgba(64, 152, 252, 0.1), 0 4px 6px -2px rgba(64, 152, 252, 0.05)',
  },
  '清新的蓝色主题，给人专业、可信的感觉'
);

// 导出主题的展示颜色
export const blueDisplayColor = '#4098fc';
