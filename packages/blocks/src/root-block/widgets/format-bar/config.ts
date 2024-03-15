import type { Chain, InitCommandCtx } from '@blocksuite/block-std';
import { assertExists } from '@blocksuite/global/utils';
import { html, type TemplateResult } from 'lit';

import { toast } from '../../../_common/components/index.js';
import { createSimplePortal } from '../../../_common/components/portal.js';
import { DATABASE_CONVERT_WHITE_LIST } from '../../../_common/configs/quick-action/database-convert-view.js';
import {
  BoldIcon,
  BulletedListIcon,
  CheckBoxIcon,
  CodeIcon,
  CopyIcon,
  DatabaseTableViewIcon20,
  FontLinkedDocIcon,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Heading4Icon,
  Heading5Icon,
  Heading6Icon,
  ItalicIcon,
  LinkIcon,
  NumberedListIcon,
  QuoteIcon,
  StrikethroughIcon,
  TextIcon,
  UnderlineIcon,
} from '../../../_common/icons/index.js';
import { matchFlavours } from '../../../_common/utils/index.js';
import type { AffineFormatBarWidget } from './format-bar.js';

export type DividerConfigItem = {
  type: 'divider';
};
export type HighlighterDropdownConfigItem = {
  type: 'highlighter-dropdown';
};
export type ParagraphDropdownConfigItem = {
  type: 'paragraph-dropdown';
};
export type InlineActionConfigItem = {
  id: string;
  name: string;
  type: 'inline-action';
  action: (
    chain: Chain<InitCommandCtx>,
    formatBar: AffineFormatBarWidget
  ) => void;
  icon: TemplateResult | (() => HTMLElement);
  isActive: (
    chain: Chain<InitCommandCtx>,
    formatBar: AffineFormatBarWidget
  ) => boolean;
  showWhen: (
    chain: Chain<InitCommandCtx>,
    formatBar: AffineFormatBarWidget
  ) => boolean;
};
export type ParagraphActionConfigItem = {
  id: string;
  type: 'paragraph-action';
  name: string;
  action: (
    chain: Chain<InitCommandCtx>,
    formatBar: AffineFormatBarWidget
  ) => void;
  icon: TemplateResult | (() => HTMLElement);
  flavour: string;
};

export type CustomConfigItem = {
  type: 'custom';
  render: (formatBar: AffineFormatBarWidget) => TemplateResult | null;
};

export type FormatBarConfigItem =
  | DividerConfigItem
  | HighlighterDropdownConfigItem
  | ParagraphDropdownConfigItem
  | ParagraphActionConfigItem
  | InlineActionConfigItem
  | CustomConfigItem;

export function toolbarDefaultConfig(toolbar: AffineFormatBarWidget) {
  toolbar
    .clearConfig()
    .addParagraphDropdown()
    .addDivider()
    .addTextStyleToggle({
      key: 'bold',
      name: '加粗',
      action: chain => chain.toggleBold().run(),
      icon: BoldIcon,
    })
    .addTextStyleToggle({
      key: 'italic',
      name: '斜体',
      action: chain => chain.toggleItalic().run(),
      icon: ItalicIcon,
    })
    .addTextStyleToggle({
      key: 'underline',
      name: '下划线',
      action: chain => chain.toggleUnderline().run(),
      icon: UnderlineIcon,
    })
    .addTextStyleToggle({
      key: 'strike',
      name: '删除线',
      action: chain => chain.toggleStrike().run(),
      icon: StrikethroughIcon,
    })
    .addTextStyleToggle({
      key: 'code',
      name: '代码',
      action: chain => chain.toggleCode().run(),
      icon: CodeIcon,
    })
    .addTextStyleToggle({
      key: 'link',
      name: '链接',
      action: chain => chain.toggleLink().run(),
      icon: LinkIcon,
    })
    .addDivider()
    .addHighlighterDropdown()
    .addDivider()
    .addInlineAction({
      id: 'copy',
      name: '复制',
      icon: CopyIcon,
      isActive: () => false,
      action: chain => {
        chain
          .getSelectedModels()
          .with({
            onCopy: () => {
              toast(toolbar.host, 'Copied to clipboard');
            },
          })
          .copySelectedModels()
          .run();
      },
      showWhen: () => true,
    })
    .addInlineAction({
      id: 'convert-to-database',
      name: '组织为数据库',
      icon: DatabaseTableViewIcon20,
      isActive: () => false,
      action: () => {
        createSimplePortal({
          template: html`<database-convert-view
            .host=${toolbar.host}
          ></database-convert-view>`,
        });
      },
      showWhen: chain => {
        const [_, ctx] = chain
          .getSelectedModels({
            types: ['block', 'text'],
          })
          .run();
        const { selectedModels } = ctx;
        if (!selectedModels || selectedModels.length === 0) return false;

        return selectedModels.every(block =>
          DATABASE_CONVERT_WHITE_LIST.includes(block.flavour)
        );
      },
    })
    .addInlineAction({
      id: 'convert-to-linked-doc',
      name: '创建链接文档',
      icon: FontLinkedDocIcon,
      isActive: () => false,
      action: (chain, formatBar) => {
        const [_, ctx] = chain
          .getSelectedModels({
            types: ['block'],
          })
          .run();
        const { selectedModels } = ctx;
        assertExists(selectedModels);

        const host = formatBar.host;
        host.selection.clear();

        const doc = host.doc;
        const linkedDoc = doc.collection.createDoc({});
        linkedDoc.load(() => {
          const rootId = linkedDoc.addBlock('affine:page', {
            title: new doc.Text(''),
          });
          linkedDoc.addBlock('affine:surface', {}, rootId);
          const noteId = linkedDoc.addBlock('affine:note', {}, rootId);

          const firstBlock = selectedModels[0];
          assertExists(firstBlock);

          doc.addSiblingBlocks(
            firstBlock,
            [
              {
                flavour: 'affine:embed-linked-doc',
                pageId: linkedDoc.id,
              },
            ],
            'before'
          );

          if (
            matchFlavours(firstBlock, ['affine:paragraph']) &&
            firstBlock.type.match(/^h[1-6]$/)
          ) {
            const title = firstBlock.text.toString();
            linkedDoc.collection.setDocMeta(linkedDoc.id, {
              title,
            });

            const linkedDocRootModel = linkedDoc.getBlockById(rootId);
            assertExists(linkedDocRootModel);
            linkedDoc.updateBlock(linkedDocRootModel, {
              title: new doc.Text(title),
            });

            doc.deleteBlock(firstBlock);
            selectedModels.shift();
          }

          selectedModels.forEach(model => {
            const keys = model.keys as (keyof typeof model)[];
            const values = keys.map(key => model[key]);
            const blockProps = Object.fromEntries(
              keys.map((key, i) => [key, values[i]])
            );
            linkedDoc.addBlock(model.flavour as never, blockProps, noteId);
            doc.deleteBlock(model);
          });
        });

        const linkedDocService = host.spec.getService(
          'affine:embed-linked-doc'
        );
        linkedDocService.slots.linkedDocCreated.emit({ docId: linkedDoc.id });
      },
      showWhen: chain => {
        const [_, ctx] = chain
          .getSelectedModels({
            types: ['block'],
          })
          .run();
        const { selectedModels } = ctx;
        return !!selectedModels && selectedModels.length > 0;
      },
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'text',
      name: '正文',
      icon: TextIcon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h1',
      name: '一级标题',
      icon: Heading1Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h2',
      name: '二级标题',
      icon: Heading2Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h3',
      name: '三级标题',
      icon: Heading3Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h4',
      name: '四级标题',
      icon: Heading4Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h5',
      name: '五级标题',
      icon: Heading5Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'h6',
      name: '六级标题',
      icon: Heading6Icon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:list',
      type: 'bulleted',
      name: '无序列表',
      icon: BulletedListIcon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:list',
      type: 'numbered',
      name: '有序列表',
      icon: NumberedListIcon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:list',
      type: 'todo',
      name: '任务列表',
      icon: CheckBoxIcon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:code',
      name: '代码块',
      icon: CodeIcon,
    })
    .addBlockTypeSwitch({
      flavour: 'affine:paragraph',
      type: 'quote',
      name: '引用',
      icon: QuoteIcon,
    });
}
