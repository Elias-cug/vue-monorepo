import type { ThemeDefinition } from '../themes';

export function applyCssVars(theme: ThemeDefinition) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => {
    // 自动添加 --le 前缀
    const varName = k.startsWith('--le-') ? k : k.replace('--', '--le-');
    root.style.setProperty(varName, v as string);
  });
}

export function createCssText(theme: ThemeDefinition) {
  return Object.entries(theme.vars)
    .map(([k, v]) => {
      // 自动添加 --le 前缀
      const varName = k.startsWith('--le-') ? k : k.replace('--', '--le-');
      return `${varName}: ${v};`;
    })
    .join('\n');
}
