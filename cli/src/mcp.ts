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

  const server = new Server(
    { name: "mikeneko-ui-mcp", version: "1.0.0" },
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
        description: "mikeneko UI 禁止パターンを取得。",
        inputSchema: {
          type: "object" as const,
          properties: {
            section: { type: "string", description: "特定セクションのみ（省略で全量）" },
          },
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
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    const a = args as Record<string, string>;

    const text = (s: string) => ({ content: [{ type: "text" as const, text: s }] });

    switch (name) {
      case "get_token": {
        // Try project-local tokens first, then bundled template
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
        const content = loadFile("foundations/prohibited.md") ?? loadTemplate("prohibited.md");
        if (!content) return text("prohibited.md not found");
        if (!a.section) return text(content);
        const regex = new RegExp(`(##+ .*${a.section}[\\s\\S]*?)(?=\\n##[^#]|\\n---\\n|$)`, "i");
        const match = content.match(regex);
        return text(match ? match[1].trim() : `Section "${a.section}" not found`);
      }

      case "get_quick_reference": {
        const content = loadFile("CLAUDE.md") ?? loadTemplate("CLAUDE.md");
        return text(content ?? "CLAUDE.md not found");
      }

      default:
        return text(`Unknown tool: ${name}`);
    }
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mikeneko UI MCP Server running on stdio");
}
