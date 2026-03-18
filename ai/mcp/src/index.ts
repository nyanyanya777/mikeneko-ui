#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "../../..");

function loadJSON(relativePath: string) {
  const fullPath = resolve(ROOT, relativePath);
  return JSON.parse(readFileSync(fullPath, "utf-8"));
}

function loadMarkdown(relativePath: string) {
  const fullPath = resolve(ROOT, relativePath);
  return readFileSync(fullPath, "utf-8");
}

const server = new Server(
  { name: "melta-ui-mcp", version: "1.0.0" },
  { capabilities: { tools: {}, resources: {} } }
);

// --- Tools ---

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: [
    {
      name: "get_token",
      description:
        "デザイントークンを取得する。category: color, typography, spacing, elevation, radius, motion, zIndex, wireframe",
      inputSchema: {
        type: "object" as const,
        properties: {
          category: {
            type: "string",
            description: "トークンカテゴリ",
            enum: [
              "color",
              "typography",
              "spacing",
              "elevation",
              "radius",
              "motion",
              "zIndex",
              "wireframe",
            ],
          },
        },
        required: ["category"],
      },
    },
    {
      name: "get_component",
      description:
        "コンポーネント仕様を取得する。nameでコンポーネント名を指定。省略で全一覧。",
      inputSchema: {
        type: "object" as const,
        properties: {
          name: {
            type: "string",
            description: "コンポーネント名 (例: Button, Card, Dialog)",
          },
        },
      },
    },
    {
      name: "get_foundation",
      description:
        "ファウンデーションドキュメントを取得する。topic: color, typography, spacing, elevation, motion, radius, icons, accessibility, emotional-feedback, design_philosophy, prohibited",
      inputSchema: {
        type: "object" as const,
        properties: {
          topic: {
            type: "string",
            description: "トピック名",
            enum: [
              "color",
              "typography",
              "spacing",
              "elevation",
              "motion",
              "radius",
              "icons",
              "accessibility",
              "emotional-feedback",
              "design_philosophy",
              "prohibited",
            ],
          },
        },
        required: ["topic"],
      },
    },
    {
      name: "get_prohibited",
      description:
        "禁止パターンを取得する。全量または特定セクション。",
      inputSchema: {
        type: "object" as const,
        properties: {
          section: {
            type: "string",
            description: "特定セクションのみ取得（省略で全量）",
          },
        },
      },
    },
    {
      name: "get_quick_reference",
      description: "CLAUDE.md (AI Quick Reference) の内容を返す",
      inputSchema: {
        type: "object" as const,
        properties: {},
      },
    },
  ],
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  switch (name) {
    case "get_token": {
      const tokens = loadJSON("tokens/tokens.json");
      const category = (args as Record<string, string>).category;
      const result = tokens[category];
      if (!result) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Unknown category: ${category}. Available: color, typography, spacing, elevation, radius, motion, zIndex, wireframe`,
            },
          ],
        };
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(result, null, 2) },
        ],
      };
    }

    case "get_component": {
      const data = loadJSON("metadata/components.json");
      const componentName = (args as Record<string, string>).name;
      if (!componentName) {
        const list = data.components.map(
          (c: { name: string; category: string }) =>
            `${c.name} (${c.category})`
        );
        return {
          content: [
            {
              type: "text" as const,
              text: `Available components (${list.length}):\n${list.join("\n")}`,
            },
          ],
        };
      }
      const component = data.components.find(
        (c: { name: string }) =>
          c.name.toLowerCase() === componentName.toLowerCase()
      );
      if (!component) {
        return {
          content: [
            {
              type: "text" as const,
              text: `Component not found: ${componentName}`,
            },
          ],
        };
      }
      return {
        content: [
          { type: "text" as const, text: JSON.stringify(component, null, 2) },
        ],
      };
    }

    case "get_foundation": {
      const topic = (args as Record<string, string>).topic;
      try {
        const content = loadMarkdown(`foundations/${topic}.md`);
        return { content: [{ type: "text" as const, text: content }] };
      } catch {
        return {
          content: [
            {
              type: "text" as const,
              text: `Foundation not found: ${topic}. Available: color, typography, spacing, elevation, motion, radius, icons, accessibility, emotional-feedback, design_philosophy, prohibited`,
            },
          ],
        };
      }
    }

    case "get_prohibited": {
      const content = loadMarkdown("foundations/prohibited.md");
      const section = (args as Record<string, string>).section;
      if (!section) {
        return { content: [{ type: "text" as const, text: content }] };
      }
      const regex = new RegExp(
        `(##+ .*${section}[\\s\\S]*?)(?=\\n##[^#]|\\n---\\n|$)`,
        "i"
      );
      const match = content.match(regex);
      return {
        content: [
          {
            type: "text" as const,
            text: match ? match[1].trim() : `Section "${section}" not found in prohibited.md`,
          },
        ],
      };
    }

    case "get_quick_reference": {
      const content = loadMarkdown("CLAUDE.md");
      return { content: [{ type: "text" as const, text: content }] };
    }

    default:
      return {
        content: [
          { type: "text" as const, text: `Unknown tool: ${name}` },
        ],
      };
  }
});

// --- Resources ---

server.setRequestHandler(ListResourcesRequestSchema, async () => ({
  resources: [
    {
      uri: "melta://tokens",
      name: "Design Tokens",
      description: "全デザイントークン (JSON)",
      mimeType: "application/json",
    },
    {
      uri: "melta://components",
      name: "Components",
      description: "全コンポーネント仕様 (JSON)",
      mimeType: "application/json",
    },
    {
      uri: "melta://quick-reference",
      name: "Quick Reference",
      description: "CLAUDE.md AI Quick Reference",
      mimeType: "text/markdown",
    },
  ],
}));

server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
  const { uri } = request.params;

  switch (uri) {
    case "melta://tokens":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(loadJSON("tokens/tokens.json"), null, 2),
          },
        ],
      };
    case "melta://components":
      return {
        contents: [
          {
            uri,
            mimeType: "application/json",
            text: JSON.stringify(
              loadJSON("metadata/components.json"),
              null,
              2
            ),
          },
        ],
      };
    case "melta://quick-reference":
      return {
        contents: [
          {
            uri,
            mimeType: "text/markdown",
            text: loadMarkdown("CLAUDE.md"),
          },
        ],
      };
    default:
      throw new Error(`Unknown resource: ${uri}`);
  }
});

// --- Start ---

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("melta UI MCP Server running on stdio");
}

main().catch(console.error);
