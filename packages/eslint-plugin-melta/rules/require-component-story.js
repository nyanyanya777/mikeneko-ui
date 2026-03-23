"use strict";

const fs = require("fs");
const path = require("path");

/**
 * components/ui/ 配下のコンポーネントファイルに対応する .stories.tsx の存在を強制するルール。
 *
 * 対象: components/ui/*.tsx（*.stories.tsx 自体は除外）
 * 検出: button.tsx があるのに button.stories.tsx がない場合にエラー
 */

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "components/ui/ 配下のコンポーネントに対応する .stories.tsx の存在を強制する（Storybook-First）",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      missingStory:
        'コンポーネント "{{ component }}" に対応するストーリー "{{ storyFile }}" が存在しません。Storybook-First: コンポーネントの変更時はストーリーも作成・更新してください。',
    },
  },

  create(context) {
    const filename = context.filename || context.getFilename();

    // components/ui/ 配下の .tsx ファイルのみ対象
    if (!filename.includes("components/ui/")) return {};
    if (!filename.endsWith(".tsx")) return {};

    // .stories.tsx 自体は除外
    if (filename.endsWith(".stories.tsx")) return {};

    // 対応する .stories.tsx のパスを生成
    const dir = path.dirname(filename);
    const base = path.basename(filename, ".tsx");
    const storyFile = path.join(dir, `${base}.stories.tsx`);

    // ファイルの存在チェック
    if (!fs.existsSync(storyFile)) {
      return {
        Program(node) {
          context.report({
            node,
            messageId: "missingStory",
            data: {
              component: `${base}.tsx`,
              storyFile: `${base}.stories.tsx`,
            },
          });
        },
      };
    }

    return {};
  },
};
