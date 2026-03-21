"use strict";

const noRawHtmlElements = require("./rules/no-raw-html-elements");
const noProhibitedClasses = require("./rules/no-prohibited-classes");

const plugin = {
  meta: {
    name: "eslint-plugin-melta",
    version: "1.1.0",
  },
  rules: {
    "no-raw-html-elements": noRawHtmlElements,
    "no-prohibited-classes": noProhibitedClasses,
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
    "melta/no-prohibited-classes": "error",
  },
  files: ["**/*.tsx"],
};

module.exports = plugin;
