import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
  ListResourceTemplatesRequestSchema,
  ListPromptsRequestSchema,
  GetPromptRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import {
  loadTokens,
  loadComponents,
  loadScreens,
  loadRules,
  getProhibitionRulesV2,
  loadFoundation,
  listFoundations,
  loadPattern,
  listPatterns,
  watchFiles,
  clearCache,
} from "./utils/loader.js";
import { getToken } from "./tools/get-token.js";
import { getComponent } from "./tools/get-component.js";
import { checkRule } from "./tools/check-rule.js";
import { checkHtml } from "./tools/check-html.js";
import { search } from "./tools/search.js";
import { getScreen, listScreens } from "./tools/get-screen.js";
import { getPattern } from "./tools/get-pattern.js";
import { getFoundation } from "./tools/get-foundation.js";

export function createServer(): Server {
  const server = new Server(
    { name: "mikeneko-ui", version: "2.0.0" },
    { capabilities: { resources: {}, tools: {}, prompts: {} } }
  );

  // ============================================================
  // Resources
  // ============================================================

  server.setRequestHandler(ListResourcesRequestSchema, async () => ({
    resources: [
      {
        uri: "mikeneko://tokens",
        name: "Design Tokens",
        description: "mikeneko UI design tokens (colors, typography, spacing, etc.)",
        mimeType: "application/json",
      },
      {
        uri: "mikeneko://components",
        name: "Components",
        description: "All component metadata with Tailwind classes",
        mimeType: "application/json",
      },
      {
        uri: "mikeneko://rules",
        name: "Prohibition Rules",
        description: "Structured prohibition patterns with severity, reasons, and alternatives",
        mimeType: "application/json",
      },
      {
        uri: "mikeneko://screens",
        name: "Screens",
        description: "Screen metadata with states, variants, patterns, and component usage",
        mimeType: "application/json",
      },
    ],
  }));

  // Resource Templates for dynamic access
  server.setRequestHandler(ListResourceTemplatesRequestSchema, async () => ({
    resourceTemplates: [
      {
        uriTemplate: "mikeneko://components/{id}",
        name: "Component by ID",
        description: "Get a specific component's metadata",
        mimeType: "application/json",
      },
      {
        uriTemplate: "mikeneko://screens/{id}",
        name: "Screen by ID",
        description: "Get a specific screen's metadata",
        mimeType: "application/json",
      },
      {
        uriTemplate: "mikeneko://tokens/{category}",
        name: "Tokens by Category",
        description: "Get tokens for a specific category (color, typography, spacing, elevation, radius, motion, zIndex)",
        mimeType: "application/json",
      },
      {
        uriTemplate: "mikeneko://foundations/{name}",
        name: "Foundation Document",
        description: "Get a foundation markdown document (color, typography, accessibility, etc.)",
        mimeType: "text/markdown",
      },
      {
        uriTemplate: "mikeneko://patterns/{name}",
        name: "Pattern Document",
        description: "Get a pattern markdown document (form, layout, navigation, responsive, etc.)",
        mimeType: "text/markdown",
      },
    ],
  }));

  server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
    const { uri } = request.params;

    // Dynamic: mikeneko://components/{id}
    const componentMatch = uri.match(/^mikeneko:\/\/components\/(.+)$/);
    if (componentMatch) {
      const id = componentMatch[1];
      const comp = getComponent(id);
      if (!comp) throw new Error(`Component not found: ${id}`);
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(comp, null, 2) }] };
    }

    // Dynamic: mikeneko://screens/{id}
    const screenMatch = uri.match(/^mikeneko:\/\/screens\/(.+)$/);
    if (screenMatch) {
      const id = screenMatch[1];
      const screen = getScreen(id);
      if (!screen || Array.isArray(screen)) throw new Error(`Screen not found: ${id}`);
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(screen, null, 2) }] };
    }

    // Dynamic: mikeneko://tokens/{category}
    const tokenMatch = uri.match(/^mikeneko:\/\/tokens\/(.+)$/);
    if (tokenMatch) {
      const category = tokenMatch[1];
      const tokens = loadTokens();
      const result = (tokens as unknown as Record<string, unknown>)[category];
      if (!result) throw new Error(`Token category not found: ${category}`);
      return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(result, null, 2) }] };
    }

    // Dynamic: mikeneko://foundations/{name}
    const foundationMatch = uri.match(/^mikeneko:\/\/foundations\/(.+)$/);
    if (foundationMatch) {
      const name = foundationMatch[1];
      const content = loadFoundation(name);
      if (!content) throw new Error(`Foundation not found: ${name}. Available: ${listFoundations().join(", ")}`);
      return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
    }

    // Dynamic: mikeneko://patterns/{name}
    const patternMatch = uri.match(/^mikeneko:\/\/patterns\/(.+)$/);
    if (patternMatch) {
      const name = patternMatch[1];
      const content = loadPattern(name);
      if (!content) throw new Error(`Pattern not found: ${name}. Available: ${listPatterns().join(", ")}`);
      return { contents: [{ uri, mimeType: "text/markdown", text: content }] };
    }

    // Static resources
    switch (uri) {
      case "mikeneko://tokens":
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(loadTokens(), null, 2) }] };
      case "mikeneko://components":
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(loadComponents(), null, 2) }] };
      case "mikeneko://rules":
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(loadRules(), null, 2) }] };
      case "mikeneko://screens":
        return { contents: [{ uri, mimeType: "application/json", text: JSON.stringify(loadScreens(), null, 2) }] };
      default:
        throw new Error(`Unknown resource: ${uri}`);
    }
  });

  // ============================================================
  // Tools (8 tools)
  // ============================================================

  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: [
      {
        name: "get_token",
        description:
          "Get a design token by dot-path. Returns the token object with value and tailwind class. Example: 'color.primary.600', 'spacing.4', 'radius.lg'",
        inputSchema: {
          type: "object" as const,
          properties: {
            path: {
              type: "string",
              description: "Dot-separated path to the token (e.g. 'color.primary.600', 'typography.fontSize.base')",
            },
          },
          required: ["path"],
        },
      },
      {
        name: "get_component",
        description:
          "Get component metadata including variants, sizes, accessibility requirements, and HTML sample. Omit 'id' to list all.",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: {
              type: "string",
              description: "Component ID (e.g. 'button', 'card', 'table', 'sidebar'). Omit to list all.",
            },
          },
        },
      },
      {
        name: "get_screen",
        description:
          "Get screen metadata including states, variants, patterns, and used components. Omit 'id' to list all screens with summary.",
        inputSchema: {
          type: "object" as const,
          properties: {
            id: {
              type: "string",
              description: "Screen ID (e.g. 'kintsugi-dashboard'). Omit for summary list.",
            },
          },
        },
      },
      {
        name: "get_pattern",
        description:
          "Get a UI pattern guide (markdown). Available: form, layout, navigation, responsive, interaction-states. Omit 'name' to list available patterns.",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: {
              type: "string",
              description: "Pattern name (e.g. 'form', 'layout'). Omit to list all.",
            },
          },
        },
      },
      {
        name: "get_foundation",
        description:
          "Get a design foundation document (markdown). Available: color, typography, spacing, elevation, radius, motion, icons, accessibility, etc. Omit 'name' to list.",
        inputSchema: {
          type: "object" as const,
          properties: {
            name: {
              type: "string",
              description: "Foundation name (e.g. 'color', 'typography', 'accessibility'). Omit to list all.",
            },
          },
        },
      },
      {
        name: "check_rule",
        description:
          "Check Tailwind classes against mikeneko UI prohibition rules. Returns violations with severity, reasons, and alternatives.",
        inputSchema: {
          type: "object" as const,
          properties: {
            classes: {
              type: "string",
              description: "Space-separated Tailwind classes to check (e.g. 'text-black shadow-2xl bg-green-500')",
            },
          },
          required: ["classes"],
        },
      },
      {
        name: "check_html",
        description:
          "Check an entire HTML string against DS prohibition rules AND structural accessibility best practices. Returns class violations + structural issues with severity summary.",
        inputSchema: {
          type: "object" as const,
          properties: {
            html: {
              type: "string",
              description: "HTML string to check",
            },
          },
          required: ["html"],
        },
      },
      {
        name: "search",
        description:
          "Search across tokens, components, and screens by keyword. Matches against names, values, tailwind classes, and descriptions.",
        inputSchema: {
          type: "object" as const,
          properties: {
            query: {
              type: "string",
              description: "Search keyword (e.g. 'card', 'primary', 'shadow')",
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
    const json = (o: unknown) => text(JSON.stringify(o, null, 2));
    const error = (s: string) => ({ content: [{ type: "text" as const, text: s }], isError: true as const });

    switch (name) {
      case "get_token": {
        const result = getToken(a.path);
        return result === null ? error(`Token not found: ${a.path}`) : json(result);
      }

      case "get_component": {
        if (!a.id) {
          const list = loadComponents().components.map((c) => `${c.id} — ${c.name} (${c.category})`);
          return text(`Available components (${list.length}):\n${list.join("\n")}`);
        }
        const comp = getComponent(a.id);
        return comp ? json(comp) : error(`Component not found: ${a.id}`);
      }

      case "get_screen": {
        if (!a.id) {
          return json(listScreens());
        }
        const screen = getScreen(a.id);
        if (!screen || Array.isArray(screen)) return error(`Screen not found: ${a.id}`);
        return json(screen);
      }

      case "get_pattern": {
        const result = getPattern(a.name);
        if (result === null) return error(`Pattern not found: ${a.name}. Available: ${listPatterns().join(", ")}`);
        if (Array.isArray(result)) return text(`Available patterns:\n${result.join("\n")}`);
        return text(result);
      }

      case "get_foundation": {
        const result = getFoundation(a.name);
        if (result === null) return error(`Foundation not found: ${a.name}. Available: ${listFoundations().join(", ")}`);
        if (Array.isArray(result)) return text(`Available foundations:\n${result.join("\n")}`);
        return text(result);
      }

      case "check_rule": {
        const violations = checkRule(a.classes);
        if (violations.length === 0) return text("✅ No violations found.");
        return json({ violationCount: violations.length, violations });
      }

      case "check_html": {
        const result = checkHtml(a.html);
        return json(result);
      }

      case "search": {
        const results = search(a.query);
        return json(results);
      }

      default:
        throw new Error(`Unknown tool: ${name}`);
    }
  });

  // ============================================================
  // Prompts
  // ============================================================

  server.setRequestHandler(ListPromptsRequestSchema, async () => ({
    prompts: [
      {
        name: "generate_component",
        description:
          "DS準拠のコンポーネントを生成するためのガイド付きプロンプト。トークン・禁止ルール・パターンを自動で参照し、正確なコードを出力する。",
        arguments: [
          {
            name: "description",
            description: "作りたいUIの説明（例: 'ユーザー一覧のテーブル'、'ログインフォーム'）",
            required: true,
          },
          {
            name: "framework",
            description: "フレームワーク: 'react' (default), 'nextjs', 'html'",
            required: false,
          },
        ],
      },
      {
        name: "design_review",
        description:
          "HTML/JSXコードのDS準拠チェックを実行するプロンプト。check_htmlツールを呼び出し、違反レポートと修正提案を出力する。",
        arguments: [
          {
            name: "code",
            description: "チェック対象のHTML/JSXコード",
            required: true,
          },
        ],
      },
      {
        name: "page_scaffold",
        description:
          "画面タイプに応じた最適な構成（使用コンポーネント・パターン・レイアウト）をガイドするプロンプト。",
        arguments: [
          {
            name: "page_type",
            description: "画面タイプ: 'dashboard', 'form', 'table', 'settings', 'landing'",
            required: true,
          },
          {
            name: "features",
            description: "必要な機能の説明（例: 'サイドバー付き、検索・フィルタ・ページネーション'）",
            required: false,
          },
        ],
      },
    ],
  }));

  server.setRequestHandler(GetPromptRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    switch (name) {
      case "generate_component": {
        const description = args?.description ?? "コンポーネント";
        const framework = args?.framework ?? "react";

        return {
          description: `mikeneko UI 準拠の「${description}」を生成`,
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `以下の手順で mikeneko UI デザインシステム準拠の「${description}」を生成してください。

## 手順

1. **get_component** ツールで関連コンポーネントの仕様を取得
2. **get_token** ツールで必要なデザイントークン（色・スペーシング・タイポグラフィ）を取得
3. **get_pattern** ツールで関連パターン（form, layout 等）を参照
4. 上記の情報に基づいて ${framework} コードを生成
5. **check_rule** ツールで生成コードの Tailwind クラスが禁止パターンに抵触しないか検証
6. 違反があれば修正して最終コードを出力

## 制約
- セマンティックカラーを使用（bg-primary, text-foreground 等）
- Noto Sans JP フォント前提
- WCAG 2.1 AA 準拠
- shadcn/ui コンポーネントを使用
- 全状態（default / hover / focus / active / disabled / error / loading）を網羅

## 出力
- 完全なコンポーネントコード
- 使用したトークンとコンポーネントの一覧
- アクセシビリティ対応のチェックリスト`,
              },
            },
          ],
        };
      }

      case "design_review": {
        const code = args?.code ?? "";
        return {
          description: "mikeneko UI DS準拠レビュー",
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `以下のコードを mikeneko UI デザインシステムに照らしてレビューしてください。

## 手順

1. **check_html** ツールで以下のコードを一括チェック
2. 結果を重大度別に分類（Critical → High → Medium → Low）
3. 各違反に対して具体的な修正コードを提示
4. 修正済みの完全なコードを出力

## チェック対象コード

\`\`\`html
${code}
\`\`\`

## 出力フォーマット

### サマリー
- Critical: X件, High: X件, Medium: X件, Low: X件

### 違反詳細
各違反について:
- 該当箇所
- 理由
- 修正前 → 修正後

### 修正済みコード
全修正を適用した完全なコード`,
              },
            },
          ],
        };
      }

      case "page_scaffold": {
        const pageType = args?.page_type ?? "dashboard";
        const features = args?.features ?? "";

        // Determine which patterns and components to recommend
        const patternMap: Record<string, string[]> = {
          dashboard: ["layout", "responsive"],
          form: ["form", "interaction-states"],
          table: ["layout", "responsive"],
          settings: ["form", "navigation"],
          landing: ["layout", "responsive"],
        };

        const componentMap: Record<string, string[]> = {
          dashboard: ["sidebar", "card", "table", "badge", "chart", "progress"],
          form: ["input", "select", "checkbox", "radio-group", "switch", "button", "label"],
          table: ["table", "pagination", "badge", "dropdown-menu", "input"],
          settings: ["tabs", "switch", "select", "radio-group", "button", "sidebar"],
          landing: ["button", "card", "badge", "navigation-menu"],
        };

        const patterns = patternMap[pageType] ?? ["layout"];
        const components = componentMap[pageType] ?? ["card", "button"];

        return {
          description: `mikeneko UI 準拠の ${pageType} 画面を設計`,
          messages: [
            {
              role: "user" as const,
              content: {
                type: "text" as const,
                text: `mikeneko UI デザインシステムに準拠した「${pageType}」画面を設計してください。
${features ? `\n追加要件: ${features}` : ""}

## 手順

1. 以下のパターンを **get_pattern** で取得して参照:
   ${patterns.map((p) => `- ${p}`).join("\n   ")}

2. 以下のコンポーネントを **get_component** で取得:
   ${components.map((c) => `- ${c}`).join("\n   ")}

3. **get_foundation** で layout / spacing / typography のガイドラインを確認

4. 画面構成を設計:
   - レイアウト構造（サイドバー有無、グリッド構成）
   - 使用コンポーネントとその配置
   - レスポンシブ対応方針

5. 実装コードを生成

6. **check_html** で最終チェック

## 出力
- 画面構成図（テキストベース）
- 使用コンポーネント・パターン一覧
- 完全な実装コード
- レスポンシブ対応の説明`,
              },
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown prompt: ${name}`);
    }
  });

  return server;
}

export async function startServer(): Promise<void> {
  const server = createServer();

  // Start file watching for cache invalidation
  const stopWatching = watchFiles(() => {
    console.error("[mikeneko-ui] SSoT files changed — cache invalidated");
  });

  // Graceful shutdown
  process.on("SIGINT", () => {
    stopWatching();
    process.exit(0);
  });
  process.on("SIGTERM", () => {
    stopWatching();
    process.exit(0);
  });

  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("mikeneko UI MCP Server v2.0.0 running on stdio (watch mode enabled)");
}
