# Theme 包主题色列表

## 12 套主题预设

每套主题都包含 `light` 和 `dark` 两种模式，共 24 种主题组合。

| 主题名       | 主色值    | 色值预览                                                        | 描述         |
| ------------ | --------- | --------------------------------------------------------------- | ------------ |
| **blue**     | `#1677FF` | ![#1677FF](https://via.placeholder.com/15/1677FF/000000?text=+) | 专业蓝色主题 |
| **red**      | `#F5222D` | ![#F5222D](https://via.placeholder.com/15/F5222D/000000?text=+) | 热情红色主题 |
| **orange**   | `#FA8C16` | ![#FA8C16](https://via.placeholder.com/15/FA8C16/000000?text=+) | 活力橙色主题 |
| **green**    | `#52C41A` | ![#52C41A](https://via.placeholder.com/15/52C41A/000000?text=+) | 自然绿色主题 |
| **purple**   | `#722ED1` | ![#722ED1](https://via.placeholder.com/15/722ED1/000000?text=+) | 神秘紫色主题 |
| **magenta**  | `#EB2F96` | ![#EB2F96](https://via.placeholder.com/15/EB2F96/000000?text=+) | 品红色主题   |
| **cyan**     | `#13C2C2` | ![#13C2C2](https://via.placeholder.com/15/13C2C2/000000?text=+) | 青色主题     |
| **geekblue** | `#2F54EB` | ![#2F54EB](https://via.placeholder.com/15/2F54EB/000000?text=+) | 极客蓝主题   |
| **volcano**  | `#FA541C` | ![#FA541C](https://via.placeholder.com/15/FA541C/000000?text=+) | 火山橙主题   |
| **gold**     | `#FAAD14` | ![#FAAD14](https://via.placeholder.com/15/FAAD14/000000?text=+) | 金色主题     |
| **yellow**   | `#FADB14` | ![#FADB14](https://via.placeholder.com/15/FADB14/000000?text=+) | 明黄色主题   |
| **lime**     | `#A0D911` | ![#A0D911](https://via.placeholder.com/15/A0D911/000000?text=+) | 青柠主题     |

## 使用示例

```typescript
import { themePresets } from '@lee/theme';

// 获取某个主题的主色
const bluePrimary = themePresets.blue.primaryColor; // '#1677FF'

// 遍历所有主题
Object.values(themePresets).forEach(preset => {
  console.log(`${preset.name}: ${preset.primaryColor}`);
});
```

## 在代码中访问

```typescript
import { useTheme } from '@lee/theme';
import { themePresets } from '@lee/theme';

const { theme } = useTheme();

// 获取当前主题的主色
const currentPreset = themePresets[theme.value];
const primaryColor = currentPreset?.primaryColor;
```

## 色值来源

所有主色值均来自 Ant Design 官方色板，确保了专业的视觉效果和良好的可访问性。
