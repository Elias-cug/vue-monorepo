/**
 * 颜色工具函数
 */

/**
 * 将十六进制颜色转换为 RGB
 */
export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result && result[1] && result[2] && result[3]
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null;
}

/**
 * 将 RGB 转换为十六进制颜色
 */
export function rgbToHex(r: number, g: number, b: number): string {
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

/**
 * 调整颜色亮度
 * @param color 十六进制颜色
 * @param amount 调整量 (-100 到 100)
 */
export function adjustBrightness(color: string, amount: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  const adjust = (value: number) => {
    const adjusted = value + amount;
    return Math.max(0, Math.min(255, adjusted));
  };

  return rgbToHex(adjust(rgb.r), adjust(rgb.g), adjust(rgb.b));
}

/**
 * 生成颜色透明度变体
 * @param color 十六进制颜色
 * @param opacity 透明度 (0-1)
 */
export function withOpacity(color: string, opacity: number): string {
  const rgb = hexToRgb(color);
  if (!rgb) return color;

  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${opacity})`;
}

/**
 * 生成颜色色阶
 * @param baseColor 基础颜色
 * @param steps 生成的色阶数量
 */
export function generateColorScale(baseColor: string, steps: number = 9): string[] {
  const scale: string[] = [];
  const rgb = hexToRgb(baseColor);
  if (!rgb) return [baseColor];

  const lighterSteps = Math.floor(steps / 2);
  const darkerSteps = steps - lighterSteps - 1;

  // 生成较亮的颜色
  for (let i = lighterSteps; i > 0; i--) {
    const factor = i * (100 / lighterSteps);
    scale.push(adjustBrightness(baseColor, factor));
  }

  // 添加基础颜色
  scale.push(baseColor);

  // 生成较暗的颜色
  for (let i = 1; i <= darkerSteps; i++) {
    const factor = -i * (100 / darkerSteps);
    scale.push(adjustBrightness(baseColor, factor));
  }

  return scale;
}

/**
 * 判断颜色是否为暗色
 */
export function isDarkColor(color: string): boolean {
  const rgb = hexToRgb(color);
  if (!rgb) return false;

  // 使用相对亮度公式
  const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
  return luminance < 0.5;
}

/**
 * 获取对比色（用于文字颜色自动选择）
 */
export function getContrastColor(bgColor: string): string {
  return isDarkColor(bgColor) ? '#ffffff' : '#000000';
}
