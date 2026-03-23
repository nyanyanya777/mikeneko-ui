"use strict";

/**
 * Button コンポーネントの右寄せ配置を禁止するルール。
 *
 * 検出パターン:
 * 1. Button 自身に ml-auto / self-end / float-right が付いている
 * 2. 親要素に justify-end / text-right が付いており、子に Button がある
 */

// Button 自身に付けてはいけないクラス
const BUTTON_SELF_CLASSES = new Set([
  "ml-auto",
  "ms-auto",
  "self-end",
  "float-right",
]);

// 親要素に付いている場合、子 Button が右寄せになるクラス
const PARENT_CLASSES = new Set([
  "justify-end",
  "text-right",
]);

const ALTERNATIVE =
  "ボタンは左寄せ（デフォルト）または中央寄せで配置する。フォーム送信ボタンは w-full またはコンテンツ左寄せ";

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
      // {condition && <Button />} のようなパターン
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
      // {condition ? <Button /> : null}
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
        "Button コンポーネントの右寄せ配置（ml-auto / justify-end / text-right 等）を禁止する",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      buttonSelfRightAlign:
        'Button に右寄せクラス "{{ className }}" が使用されています。代替: ' +
        ALTERNATIVE,
      parentRightAlign:
        '子に Button を含む要素に右寄せクラス "{{ className }}" が使用されています。代替: ' +
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

        const classes = getClassNamesFromElement(opening);

        // パターン1: Button 自身に右寄せクラスが付いている
        if (elementName === "Button") {
          for (const cls of classes) {
            if (BUTTON_SELF_CLASSES.has(cls)) {
              context.report({
                node: opening,
                messageId: "buttonSelfRightAlign",
                data: { className: cls },
              });
            }
          }
        }

        // パターン2: 親要素に右寄せクラスがあり、子に Button がある
        if (elementName !== "Button") {
          const rightAlignClasses = classes.filter((cls) =>
            PARENT_CLASSES.has(cls)
          );
          if (rightAlignClasses.length > 0 && containsButton(node)) {
            for (const cls of rightAlignClasses) {
              context.report({
                node: opening,
                messageId: "parentRightAlign",
                data: { className: cls },
              });
            }
          }
        }
      },
    };
  },
};
