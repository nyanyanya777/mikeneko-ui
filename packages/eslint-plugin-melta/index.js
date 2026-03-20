"use strict";

const noRawHtmlElements = require("./rules/no-raw-html-elements");

const plugin = {
  meta: {
    name: "eslint-plugin-melta",
    version: "1.0.0",
  },
  rules: {
    "no-raw-html-elements": noRawHtmlElements,
  },
  configs: {},
};

// ESLint 9 flat config — recommended preset
// self-reference を使って plugin オブジェクトを含める
plugin.configs.recommended = {
  plugins: {
    melta: plugin,
  },
  rules: {
    "melta/no-raw-html-elements": "error",
  },
  files: ["**/*.tsx"],
};

module.exports = plugin;
