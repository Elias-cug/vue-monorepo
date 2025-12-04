import type { ThemeDefinition } from '../themes';

export function applyCssVars(theme: ThemeDefinition) {
  const root = document.documentElement;
  Object.entries(theme.vars).forEach(([k, v]) => {
    root.style.setProperty(k, v as string);
  });
}

export function createCssText(theme: ThemeDefinition) {
  return Object.entries(theme.vars)
    .map(([k, v]) => `${k}: ${v};`)
    .join('\n');
}
