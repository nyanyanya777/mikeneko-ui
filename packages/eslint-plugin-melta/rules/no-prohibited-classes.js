"use strict";

/**
 * prohibited.md で定義された禁止 Tailwind クラスを検出するルール。
 * className 属性内の文字列リテラル・テンプレートリテラルを解析する。
 */

// --- 完全一致で禁止するクラス ---
const EXACT_PROHIBITED = {
  "text-black": "text-foreground または text-slate-900",
  "shadow-lg": "shadow-sm ~ shadow-md（オーバーレイのみ shadow-xl）",
  "shadow-2xl": "shadow-sm ~ shadow-md（オーバーレイのみ shadow-xl）",
  "border-gray-100": "border-border / border-slate-200",
  "tracking-tight": "tracking-normal 以上（本文 0.02em、見出し 0.01em）",
  "font-light": "font-normal（400）以上",
  "rounded-none": "コンポーネントのデフォルト radius を使用",
  "border-t-4": "border border-slate-200 で全周ボーダー",
  "border-l-4": "border border-slate-200 で全周ボーダー",
};

// --- パターン（正規表現）で禁止するクラス ---
const PATTERN_PROHIBITED = [
  {
    pattern: /^bg-gray-([3-9]\d{2}|[3-9]00)$/,
    alternative: "bg-muted / bg-gray-50 ~ bg-gray-200",
    description: "bg-gray-300 以上の暗い背景",
  },
  {
    pattern: /^bg-green-\d+$/,
    alternative: "bg-emerald-* で統一",
    description: "bg-green-*",
  },
  {
    pattern: /^bg-yellow-\d+$/,
    alternative: "bg-amber-* で統一",
    description: "bg-yellow-*",
  },
  {
    pattern: /^bg-rose-\d+$/,
    alternative: "bg-red-* で統一",
    description: "bg-rose-*",
  },
  {
    pattern: /^text-blue-\d+$/,
    alternative: "text-primary",
    description: "text-blue-*",
  },
  {
    pattern: /^bg-indigo-\d+$/,
    alternative: "bg-primary / CSS変数",
    description: "bg-indigo-*",
  },
  {
    pattern: /^bg-blue-\d+$/,
    alternative: "bg-primary / CSS変数",
    description: "bg-blue-*",
  },
  {
    pattern: /^duration-(\d+)$/,
    test: (match) => parseInt(match[1], 10) > 300,
    alternative: "duration-300 以下",
    description: "300ms 超のアニメーション",
  },
  {
    pattern: /^border-slate-(\d+)$/,
    test: (match) => parseInt(match[1], 10) >= 400,
    alternative: "border-slate-200（標準）/ border-slate-300（強調）",
    description: "border-slate-400 以上の区切り線",
  },
];

/**
 * クラス名が禁止パターンに該当するかチェックし、該当すれば情報を返す。
 */
function checkClass(className) {
  // 完全一致
  if (EXACT_PROHIBITED[className]) {
    return {
      prohibited: className,
      alternative: EXACT_PROHIBITED[className],
    };
  }

  // パターン一致
  for (const rule of PATTERN_PROHIBITED) {
    const match = className.match(rule.pattern);
    if (match) {
      // test 関数がある場合は追加条件をチェック
      if (rule.test && !rule.test(match)) {
        continue;
      }
      return {
        prohibited: rule.description || className,
        alternative: rule.alternative,
      };
    }
  }

  return null;
}

/**
 * AST ノードから文字列リテラル値を再帰的に収集する。
 * StringLiteral, TemplateLiteral の quasis, cn()/clsx()/cva() の引数を探索。
 */
function collectStringNodes(node, results) {
  if (!node) return;

  switch (node.type) {
    case "Literal":
      if (typeof node.value === "string") {
        results.push(node);
      }
      break;

    case "TemplateLiteral":
      for (const quasi of node.quasis) {
        if (quasi.value.raw.trim()) {
          results.push(quasi);
        }
      }
      break;

    case "CallExpression":
      // cn(), clsx(), cva() 等のユーティリティ関数の引数を探索
      if (node.arguments) {
        for (const arg of node.arguments) {
          collectStringNodes(arg, results);
        }
      }
      break;

    case "ConditionalExpression":
      collectStringNodes(node.consequent, results);
      collectStringNodes(node.alternate, results);
      break;

    case "LogicalExpression":
      collectStringNodes(node.right, results);
      break;

    case "JSXExpressionContainer":
      collectStringNodes(node.expression, results);
      break;

    case "ArrayExpression":
      for (const element of node.elements) {
        if (element) collectStringNodes(element, results);
      }
      break;
  }
}

/**
 * 文字列ノードからクラス名のリストを返す。
 */
function getClassNames(node) {
  if (node.type === "Literal") {
    return node.value.split(/\s+/).filter(Boolean);
  }
  if (node.type === "TemplateElement") {
    return node.value.raw.split(/\s+/).filter(Boolean);
  }
  return [];
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "prohibited.md で定義された禁止 Tailwind クラスの使用を検出する",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      prohibitedClass:
        '禁止クラス "{{ prohibited }}" が使用されています。代替: {{ alternative }}',
    },
  },

  create(context) {
    return {
      JSXAttribute(node) {
        // className 属性のみ対象
        if (
          !node.name ||
          node.name.name !== "className" ||
          !node.value
        ) {
          return;
        }

        // 文字列ノードを収集
        const stringNodes = [];
        collectStringNodes(node.value, stringNodes);

        for (const strNode of stringNodes) {
          const classNames = getClassNames(strNode);
          for (const cls of classNames) {
            const result = checkClass(cls);
            if (result) {
              context.report({
                node: strNode,
                messageId: "prohibitedClass",
                data: {
                  prohibited: result.prohibited,
                  alternative: result.alternative,
                },
              });
            }
          }
        }
      },
    };
  },
};
