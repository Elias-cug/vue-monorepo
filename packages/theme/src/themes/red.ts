import { createTheme } from '../core/createTheme';

export const red = createTheme(
  'red',
  '红色系主题',
  false,
  {
    // 背景颜色 - 温暖的红色调
    '--bg': '#fff5f5',
    '--bg-soft': '#ffe4e4',
    '--bg-muted': '#ffd4d4',

    // 文本颜色
    '--text': '#3d0a0a',
    '--text-soft': '#5a1616',
    '--text-muted': '#7a2e2e',

    // 功能色 - 红色系为主
    '--primary': '#ef4444',
    '--primary-hover': '#dc2626',
    '--primary-active': '#f87171',
    '--success': '#22c55e',
    '--warning': '#f59e0b',
    '--error': '#b91c1c',
    '--info': '#ec4899',

    // 边框
    '--border': '#fca5a5',
    '--border-soft': '#fecaca',

    // 阴影 - 红色调阴影
    '--shadow-sm': '0 1px 2px 0 rgba(239, 68, 68, 0.05)',
    '--shadow-md': '0 4px 6px -1px rgba(239, 68, 68, 0.1), 0 2px 4px -1px rgba(239, 68, 68, 0.06)',
    '--shadow-lg':
      '0 10px 15px -3px rgba(239, 68, 68, 0.1), 0 4px 6px -2px rgba(239, 68, 68, 0.05)',

    // 特殊效果
    '--transition-fast': 'all 0.15s ease',
    '--transition-base': 'all 0.25s ease',
    '--transition-slow': 'all 0.35s ease',
  },
  '充满活力的红色主题，适合需要强调和吸引注意力的场景'
);
