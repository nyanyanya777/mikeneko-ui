// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";
import melta from "eslint-plugin-melta";

import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  ...storybook.configs["flat/recommended"],
  // melta UI: 素のHTML要素の使用を禁止（components/ui/ は除外）
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/components/ui/**"],
    plugins: { melta },
    rules: {
      "melta/no-raw-html-elements": "error",
      "melta/no-prohibited-classes": "error",
      "melta/no-button-left-align": "error",
    },
  },
  // Storybook-First: components/ui/ のコンポーネントには .stories.tsx を必須化
  {
    files: ["src/components/ui/*.tsx"],
    ignores: ["src/components/ui/*.stories.tsx"],
    plugins: { melta },
    rules: {
      "melta/require-component-story": "error",
    },
  },
]);

export default eslintConfig;
