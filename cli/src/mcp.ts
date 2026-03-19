import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

// Lazy-load MCP SDK only when mcp subcommand is used
export async function startMcp() {
  const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
  const { StdioServerTransport } = await import(
    "@modelcontextprotocol/sdk/server/stdio.js"
  );
  const {
    CallToolRequestSchema,
    ListToolsRequestSchema,
  } = await import("@modelcontextprotocol/sdk/types.js");

  const CWD = process.cwd();

  function loadFile(path: string): string | null {
    const full = resolve(CWD, path);
    if (!existsSync(full)) return null;
    return readFileSync(full, "utf-8");
  }

  function loadJSON(path: string) {
    const content = loadFile(path);
    return content ? JSON.parse(content) : null;
  }

  // Try to find templates dir (installed via npm or local dev)
  const { dirname } = await import("path");
  const { fileURLToPath } = await import("url");
  const __dirname = dirname(fileURLToPath(import.meta.url));
  const TEMPLATES = resolve(__dirname, "../templates");

  function loadTemplate(name: string): string | null {
    const full = resolve(TEMPLATES, name);
    if (!existsSync(full)) return null;
    return readFileSync(full, "utf-8");
  }

  /**
   * Load prohibition rules from rules.json (SSoT) and flatten into patterns.
   * Falls back to bundled template.
   */
  function loadProhibitionRules(): { pattern: string; reason: string; alternative: string }[] {
    const rulesData = loadJSON("metadata/rules.json") ?? loadJSON(resolve(TEMPLATES, "rules.json"));
    if (!rulesData) return [];

    const flat: { pattern: string; reason: string; alternative: string }[] = [];
    for (const rule of rulesData.rules) {
      const patterns = rule.patterns ?? (rule.pattern ? [rule.pattern] : []);
      for (const p of patterns) {
        flat.push({ pattern: p, reason: rule.reason, alternative: rule.alternative });
      }
    }
    return flat;
  }

  const server = new Server(
    { name: "mikeneko-ui-cli-mcp", version: "2.0.0" },
    { capabilities: { tools: {} } }
  );

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_token",
        description:
          "mikeneko UI デザイントークンを取得。category: color, typography, spacing, elevation, radius, motion, zIndex, wireframe",
        inputSchema: {
          type: "object" as const,
          properties: {
            category: {
              type: "string",
              description: "トークンカテゴリ",
              enum: ["color", "typography", "spacing", "elevation", "radius", "motion", "zIndex", "wireframe"],
            },
          },
          required: ["category"],
        },
      },
      {
        name: "get_component",
        description:
          "shadcn/ui コンポーネント仕様を取得。name省略で全一覧。",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: { type: "string", description: "コンポーネント名 (例: Button, Card)" },
          },
        },
      },
      {
        name: "get_prohibited",
        description: "mikeneko UI 禁止パターンを取得（rules.json SSoT対応）。",
        inputSchema: {
          type: "object" as const,
          properties: {
            section: { type: "string", description: "特定セクションのみ（省略で全量）" },
          },
        },
      },
      {
        name: "check_rule",
        description:
          "Tailwind クラスを禁止ルールに照合。違反があれば理由と代替を返す。",
        inputSchema: {
          type: "object" as const,
          properties: {
            classes: {
              type: "string",
              description: "スペース区切りの Tailwind クラス (例: 'text-black shadow-lg')",
            },
          },
          required: ["classes"],
        },
      },
      {
        name: "get_quick_reference",
        description: "CLAUDE.md (AI Quick Reference) を返す。",
        inputSchema: {
          type: "object" as const,
          properties: {},
        },
      },
      {
        name: "search",
        description:
          "トークンとコンポーネントをキーワード横断検索。",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description: "検索キーワード",
            },
          },
          required: ["query"],
        },
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const a = args as Record<string, string>;

    const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

    switch (name) {
      case "get_token": {
        const tokens = loadJSON("tokens/tokens.json") ?? loadJSON(resolve(TEMPLATES, "tokens.json"));
        if (!tokens) return text("tokens.json not found");
        const result = tokens[a.category];
        return result ? text(JSON.stringify(result, null, 2)) : text(`Unknown category: ${a.category}`);
      }

      case "get_component": {
        const data = loadJSON("metadata/components.json") ?? loadJSON(resolve(TEMPLATES, "components.json"));
        if (!data) return text("components.json not found");
        if (!a.name) {
          const list = data.components.map((c: { name: string; category: string }) => `${c.name} (${c.category})`);
          return text(`Available (${list.length}):\n${list.join("\n")}`);
        }
        const comp = data.components.find((c: { name: string }) => c.name.toLowerCase() === a.name.toLowerCase());
        return comp ? text(JSON.stringify(comp, null, 2)) : text(`Not found: ${a.name}`);
      }

      case "get_prohibited": {
        // Try rules.json first (SSoT), fall back to prohibited.md
        const rulesData = loadJSON("metadata/rules.json") ?? loadJSON(resolve(TEMPLATES, "rules.json"));
        if (rulesData) {
          if (!a.section) return text(JSON.stringify(rulesData, null, 2));
          const filtered = rulesData.rules.filter(
            (r: { category: string }) => r.category.toLowerCase().includes(a.section.toLowerCase())
          );
          return text(JSON.stringify(filtered, null, 2));
        }
        // Fallback to prohibited.md
        const content = loadFile("foundations/prohibited.md") ?? loadTemplate("prohibited.md");
        if (!content) return text("prohibited.md not found");
        if (!a.section) return text(content);
        const regex = new RegExp(`(##+ .*${a.section}[\\s\\S]*?)(?=\\n##[^#]|\\n---\\n|$)`, "i");
        const match = content.match(regex);
        return text(match ? match[1].trim() : `Section "${a.section}" not found`);
      }

      case "check_rule": {
        const rules = loadProhibitionRules();
        const classList = a.classes.split(/\s+/).filter(Boolean);
        const violations: { class: string; reason: string; alternative: string }[] = [];

        for (const cls of classList) {
          for (const rule of rules) {
            if (cls.includes(rule.pattern)) {
              violations.push({ class: cls, reason: rule.reason, alternative: rule.alternative });
            }
          }
        }

        return violations.length === 0
          ? text("✅ No violations found.")
          : text(JSON.stringify({ violationCount: violations.length, violations }, null, 2));
      }

      case "get_quick_reference": {
        const content = loadFile("CLAUDE.md") ?? loadTemplate("CLAUDE.md");
        return text(content ?? "CLAUDE.md not found");
      }

      case "search": {
        const tokens = loadJSON("tokens/tokens.json") ?? loadJSON(resolve(TEMPLATES, "tokens.json"));
        const components = loadJSON("metadata/components.json") ?? loadJSON(resolve(TEMPLATES, "components.json"));
        const q = a.query.toLowerCase();
        const results: unknown[] = [];

        // Search components
        if (components) {
          for (const comp of components.components) {
            const searchable = [comp.id, comp.name, comp.description, comp.category].join(" ").toLowerCase();
            if (searchable.includes(q)) {
              results.push({ type: "component", id: comp.id, name: comp.name, data: comp });
            }
          }
        }

        return text(JSON.stringify(results, null, 2));
      }

      default:
        return text(`Unknown tool: ${name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mikeneko UI CLI MCP Server v2.0.0 running on stdio");
}
