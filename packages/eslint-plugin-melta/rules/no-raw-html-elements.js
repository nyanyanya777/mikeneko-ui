"use strict";

/**
 * 素の HTML 要素の使用を禁止し、shadcn/ui コンポーネントへの置き換えを促すルール。
 */

const ELEMENT_MAP = {
  button:   { component: "Button",        from: "@/components/ui/button" },
  input:    { component: "Input",         from: "@/components/ui/input" },
  textarea: { component: "Textarea",      from: "@/components/ui/textarea" },
  select:   { component: "Select",        from: "@/components/ui/select" },
  option:   { component: "SelectItem",    from: "@/components/ui/select" },
  label:    { component: "Label",         from: "@/components/ui/label" },
  table:    { component: "Table",         from: "@/components/ui/table" },
  thead:    { component: "TableHeader",   from: "@/components/ui/table" },
  tbody:    { component: "TableBody",     from: "@/components/ui/table" },
  tr:       { component: "TableRow",      from: "@/components/ui/table" },
  th:       { component: "TableHead",     from: "@/components/ui/table" },
  td:       { component: "TableCell",     from: "@/components/ui/table" },
  dialog:   { component: "Dialog",        from: "@/components/ui/dialog" },
  progress: { component: "Progress",      from: "@/components/ui/progress" },
  hr:       { component: "Separator",     from: "@/components/ui/separator" },
};

/**
 * <input> 要素の type 属性を見て、適切な代替コンポーネントを返す。
 */
function getInputReplacement(node) {
  const typeAttr = node.attributes.find(
    (attr) =>
      attr.type === "JSXAttribute" &&
      attr.name &&
      attr.name.name === "type" &&
      attr.value
  );

  if (typeAttr && typeAttr.value.type === "Literal") {
    const typeValue = typeAttr.value.value;

    if (typeValue === "checkbox") {
      return {
        component: "Checkbox",
        from: "@/components/ui/checkbox",
      };
    }

    if (typeValue === "radio") {
      return {
        component: "RadioGroupItem",
        from: "@/components/ui/radio-group",
      };
    }
  }

  // デフォルト: Input
  return ELEMENT_MAP.input;
}

module.exports = {
  meta: {
    type: "problem",
    docs: {
      description:
        "素の HTML 要素の代わりに shadcn/ui コンポーネントの使用を強制する",
      recommended: true,
    },
    fixable: null,
    schema: [],
    messages: {
      noRawHtmlElement:
        "素のHTML要素 <{{ element }}> の使用は禁止です。代わりに <{{ component }}> ({{ from }}) を使用してください。",
    },
  },

  create(context) {
    return {
      JSXOpeningElement(node) {
        // JSX 要素名が識別子（小文字始まり = HTML 要素）であることを確認
        if (node.name.type !== "JSXIdentifier") {
          return;
        }

        const elementName = node.name.name;

        if (!Object.prototype.hasOwnProperty.call(ELEMENT_MAP, elementName)) {
          return;
        }

        // <input> は type 属性に応じて代替コンポーネントを変える
        const replacement =
          elementName === "input"
            ? getInputReplacement(node)
            : ELEMENT_MAP[elementName];

        context.report({
          node,
          messageId: "noRawHtmlElement",
          data: {
            element: elementName,
            component: replacement.component,
            from: replacement.from,
          },
        });
      },
    };
  },
};
