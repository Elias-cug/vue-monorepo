export const palette = {
  primary: {
    50: '#e6f4ff',
    100: '#cfeafe',
    200: '#9fd8ff',
    300: '#66b8ff',
    400: '#4098fc',
    500: '#1f77f2',
    600: '#145bc4',
  },
  success: {
    100: '#e6fff1',
    400: '#18a058',
  },
  warning: {
    100: '#fff8e6',
    400: '#f0a020',
  },
  error: {
    100: '#ffecee',
    400: '#d03050',
  },
} as const;

export type Palette = typeof palette;
