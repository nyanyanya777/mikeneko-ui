"use strict";

const noRawHtmlElements = require("./rules/no-raw-html-elements");
const noProhibitedClasses = require("./rules/no-prohibited-classes");
const noButtonLeftAlign = require("./rules/no-button-left-align");
const requireComponentStory = require("./rules/require-component-story");

const plugin = {
  meta: {
    name: "eslint-plugin-melta",
    version: "1.2.0",
  },
  rules: {
    "no-raw-html-elements": noRawHtmlElements,
    "no-prohibited-classes": noProhibitedClasses,
    "no-button-left-align": noButtonLeftAlign,
    "require-component-story": requireComponentStory,
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
    "melta/no-button-left-align": "error",
    "melta/require-component-story": "error",
  },
  files: ["**/*.tsx"],
};

module.exports = plugin;
