import {
  BookmarkIcon,
  BulletedListIcon,
  CheckBoxIcon,
  CodeBlockIcon,
  DividerIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ImageIcon,
  NumberedListIcon,
  QuoteIcon,
  TextIcon,
} from '../../../_common/icons/index.js';

export const TRANSITION_DELAY = 200;
export const BOTTOM_OFFSET = 70;
export const RIGHT_OFFSET = 24;
export const TOP_DISTANCE = 24;

export type BlockHubItem = {
  flavour: string;
  type: string | null;
  name: string;
  description: string;
  icon: unknown;
  tooltip: string;
};

export const BLOCKHUB_TEXT_ITEMS: BlockHubItem[] = [
  {
    flavour: 'affine:paragraph',
    type: 'text',
    name: '文本',
    description: '开始输入纯文本。',
    icon: TextIcon,
    tooltip: '拖动/单击以插入文本块',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h1',
    name: '一级标题',
    description: '采用最大字体的标题。',
    icon: Heading1Icon,
    tooltip: '拖动/单击插入一级标题',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h2',
    name: '二级标题',
    description: 'Headings in the 2nd font size.',
    icon: Heading2Icon,
    tooltip: '拖动/单击插入二级标题',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h3',
    name: '三级标题',
    description: 'Headings in the 3rd font size.',
    icon: Heading3Icon,
    tooltip: '拖动/单击插入三级标题',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h4',
    name: '四级标题',
    description: 'Heading in the 4th font size.',
    icon: Heading4Icon,
    tooltip: '拖动/单击插入四级标题',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h5',
    name: '五级标题',
    description: 'Heading in the 5th font size.',
    icon: Heading5Icon,
    tooltip: '拖动/单击插入五级标题',
  },
  {
    flavour: 'affine:paragraph',
    type: 'h6',
    name: '六级标题',
    description: 'Heading in the 6th font size.',
    icon: Heading6Icon,
    tooltip: '拖动/单击插入六级标题',
  },
  {
    flavour: 'affine:code',
    type: 'code',
    name: '代码块',
    description: 'Capture a code snippet.',
    icon: CodeBlockIcon,
    tooltip: '拖动/单击插入代码块',
  },
  {
    flavour: 'affine:paragraph',
    type: 'quote',
    name: '引用',
    description: 'Capture a quote.',
    icon: QuoteIcon,
    tooltip: '拖动/单击插入引用',
  },
  {
    flavour: 'affine:divider',
    type: null,
    name: '分割线',
    description: 'A visual divider.',
    icon: DividerIcon,
    tooltip: '拖动/单击插入分割线',
  },
];

export const BLOCKHUB_LIST_ITEMS: BlockHubItem[] = [
  {
    flavour: 'affine:list',
    type: 'bulleted',
    name: 'Bulleted List',
    description: 'A simple bulleted list.',
    icon: BulletedListIcon,
    tooltip: '拖动/单击插入无序列表',
  },
  {
    flavour: 'affine:list',
    type: 'numbered',
    name: '有序列表',
    description: 'A list with numbering.',
    icon: NumberedListIcon,
    tooltip: '拖动/单击插入有序列表',
  },
  {
    flavour: 'affine:list',
    type: 'todo',
    name: '任务列表',
    description: 'Track tasks with a to-do list.',
    icon: CheckBoxIcon,
    tooltip: '拖动/单击插入任务列表',
  },
];

export const BLOCKHUB_FILE_ITEMS: BlockHubItem[] = [
  {
    flavour: 'affine:image',
    type: 'image',
    name: '图片',
    description: 'Upload images.',
    icon: ImageIcon,
    tooltip: '拖动/单击插入图片',
  },
  {
    flavour: 'affine:bookmark',
    type: 'bookmark',
    name: '书签',
    description: 'Insert a link in card view.',
    icon: BookmarkIcon,
    tooltip: '拖动/单击插入书签',
  },
];
