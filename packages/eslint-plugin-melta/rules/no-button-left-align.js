"use strict";

/**
 * Button コンポーネントの左寄せ配置を禁止するルール。
 *
 * 日本の UI 慣習では、確認・送信ボタンはコンテナの右側に配置する。
 * 左寄せ（デフォルト配置）のままボタンを置くと、ユーザーの期待する位置と異なる。
 *
 * 検出パターン:
 * 1. 親要素に justify-start / text-left が明示的に付いており、子に Button がある
 * 2. Button を含む親要素に flex/grid の水平配置があるが、justify-end / justify-center / justify-between がない
 *    → このケースは誤検出が多いため検出しない（ドキュメントでカバー）
 *
 * ※ このルールは「明示的な左寄せ指定」のみを検出する。
 *   デフォルト配置（何も指定しない）はドキュメント・レビューでカバーする。
 */

// 親要素に付いている場合、子 Button が明示的に左寄せになるクラス
const PARENT_LEFT_CLASSES = new Set([
  "justify-start",
  "text-left",
]);

const ALTERNATIVE =
  "ボタンは右寄せ（justify-end / ml-auto）または中央寄せで配置する。ダイアログ・フォームの確認ボタンは右端に置く";

/**
 * AST ノードから文字列リテラル値を再帰的に収集する。
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

/**
 * JSXOpeningElement の className 属性からクラス名一覧を取得する。
 */
function getClassNamesFromElement(openingElement) {
  const classAttr = openingElement.attributes.find(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name &&
      attr.name.name === "className" &&
      attr.value
  );
  if (!classAttr) return [];

  const stringNodes = [];
  collectStringNodes(classAttr.value, stringNodes);

  const classes = [];
  for (const strNode of stringNodes) {
    classes.push(...getClassNames(strNode));
  }
  return classes;
}

/**
 * JSXElement の子孫に Button コンポーネントが含まれるか判定する。
 */
function containsButton(node) {
  if (!node || !node.children) return false;

  for (const child of node.children) {
    if (child.type === "JSXElement") {
      const name = child.openingElement.name;
      if (name && name.type === "JSXIdentifier" && name.name === "Button") {
        return true;
      }
      if (containsButton(child)) return true;
    }
    if (child.type === "JSXExpressionContainer" && child.expression) {
      if (
        child.expression.type === "LogicalExpression" &&
        child.expression.right &&
        child.expression.right.type === "JSXElement"
      ) {
        const rName = child.expression.right.openingElement.name;
        if (
          rName &&
          rName.type === "JSXIdentifier" &&
          rName.name === "Button"
        ) {
          return true;
        }
      }
      if (child.expression.type === "ConditionalExpression") {
        for (const branch of [
          child.expression.consequent,
          child.expression.alternate,
        ]) {
          if (branch && branch.type === "JSXElement") {
            const bName = branch.openingElement.name;
            if (
              bName &&
              bName.type === "JSXIdentifier" &&
              bName.name === "Button"
            ) {
              return true;
            }
          }
        }
      }
    }
  }
  return false;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Button コンポーネントの明示的な左寄せ配置（justify-start / text-left）を禁止する。ボタンは右寄せまたは中央寄せで配置する",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      parentLeftAlign:
        '子に Button を含む要素に左寄せクラス "{{ className }}" が使用されています。代替: ' +
        ALTERNATIVE,
    },
  },

  create(context) {
    return {
      JSXElement(node) {
        const opening = node.openingElement;
        const name = opening.name;
        if (!name) return;

        const elementName =
          name.type === "JSXIdentifier" ? name.name : null;

        // Button 自身ではなく親要素のみチェック
        if (elementName === "Button") return;

        const classes = getClassNamesFromElement(opening);

        const leftAlignClasses = classes.filter((cls) =>
          PARENT_LEFT_CLASSES.has(cls)
        );
        if (leftAlignClasses.length > 0 && containsButton(node)) {
          for (const cls of leftAlignClasses) {
            context.report({
              node: opening,
              messageId: "parentLeftAlign",
              data: { className: cls },
            });
          }
        }
      },
    };
  },
};
