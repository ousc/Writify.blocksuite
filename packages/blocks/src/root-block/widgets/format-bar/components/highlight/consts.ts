interface HighlightConfig {
  name: string;
  color: string | null;
  hotkey: string | null;
}

const colors = [
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'grey',
];

const colorNames = [
  '红色',
  '橙色',
  '黄色',
  '绿色',
  '青色',
  '蓝色',
  '紫色',
  '灰色',
];

export const backgroundConfig: HighlightConfig[] = [
  {
    name: '默认背景',
    color: null,
    hotkey: null,
  },
  ...colors.map((color, index) => ({
    name: `${colorNames[index]}背景`,
    color: `var(--affine-text-highlight-${color})`,
    hotkey: null,
  })),
];

export const foregroundConfig: HighlightConfig[] = [
  {
    name: '默认颜色',
    color: null,
    hotkey: null,
  },
  ...colors.map((color, index) => ({
    name: `${colorNames[index]}`,
    color: `var(--affine-text-highlight-foreground-${color})`,
    hotkey: null,
  })),
];
