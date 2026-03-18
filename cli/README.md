# mikeneko-ui

**shadcn/ui ベースの AI-ready デザインシステム CLI。**

React (Vite) / Next.js プロジェクトに、デザイントークン・ルール・MCP サーバーをワンコマンドで注入する。

---

## Based on melta UI

mikeneko-ui は [melta UI](https://github.com/tsubotax/melta-ui) デザインシステムを基盤としている。

melta UI は「人間にも、AIにも、読めるデザインシステム」として設計された、AI-ready なデザインシステム。Markdown ドキュメント・JSON トークン・MCP サーバーの3層構造で、人間の可読性と AI の可読性を両立する。

mikeneko-ui は、melta UI のデザイントークン・禁止パターン・設計原則を [shadcn/ui](https://ui.shadcn.com/) コンポーネントライブラリと組み合わせ、CLI として配布可能にしたもの。

---

## Quick Start

```bash
# 1. shadcn/ui を先に初期化（まだの場合）
npx shadcn@latest init

# 2. mikeneko-ui を注入
npx mikeneko-ui
```

これだけ。

---

## CLI がやること

```
$ npx mikeneko-ui

  mikeneko UI — AI-ready design system

  ✔ Detected: React (Vite)
  ✔ shadcn/ui detected

  ✔ Injected mikeneko-ui theme into src/index.css
  ✔ Created CLAUDE.md
  ✔ Created foundations/prohibited.md
  ✔ Added mikeneko-ui to .mcp.json

  🎨 Done! Your project now uses mikeneko-ui design tokens.
```

| ステップ | 内容 |
|---------|------|
| **フレームワーク自動検出** | `package.json` から React / Next.js を判定。見つからなければ選択式 |
| **テーマ注入** | `globals.css` / `index.css` の `:root` を mikeneko-ui カラー (oklch) で上書き |
| **CLAUDE.md 作成** | AI 向けクイックリファレンス。Claude Code / Cursor が自動で読む |
| **禁止パターンコピー** | `foundations/prohibited.md` — 76項目の「やってはいけないこと」 |
| **MCP 設定** | `.mcp.json` に MCP サーバーを追加。AI が `get_token` 等を呼べる |

### React (Vite) vs Next.js

| | React (Vite) | Next.js |
|---|---|---|
| CSS 注入先 | `src/index.css` | `src/app/globals.css` |
| その他 | 全く同じ | 全く同じ |

---

## MCP サーバー

CLI には MCP サーバーが内蔵されている。`.mcp.json` が自動設定されるので、追加のインストールは不要。

AI ツール（Claude Code, Cursor 等）が以下のツールを使える:

| ツール | 説明 |
|--------|------|
| `get_token` | デザイントークン取得 (color, typography, spacing, elevation, radius, motion, zIndex) |
| `get_component` | shadcn/ui コンポーネント仕様取得 (45コンポーネント) |
| `get_prohibited` | 禁止パターン取得 (76項目) |
| `get_quick_reference` | CLAUDE.md の内容を返す |

```json
// .mcp.json（自動生成される）
{
  "mcpServers": {
    "mikeneko-ui": {
      "command": "npx",
      "args": ["-y", "mikeneko-ui", "mcp"]
    }
  }
}
```

---

## Design Tokens

### Primary: #2b70ef

```
50: #f0f5ff  100: #dde8ff  200: #c0d4ff  300: #95b6ff  400: #6492ff
500: #2b70ef  600: #2250df  700: #1a40b5  800: #13318d  900: #0e266a  950: #07194e
```

### Typography

```
Font: Inter, Hiragino Sans, Hiragino Kaku Gothic ProN, Noto Sans JP, sans-serif
Body: 18px / line-height 2.0 / letter-spacing 0.02em
Heading: line-height 1.4 / letter-spacing 0.01em
```

### CSS Variables (oklch)

```css
:root {
  --primary: oklch(0.5765 0.2038 261.31);       /* #2b70ef */
  --background: oklch(0.9846 0.0017 247.84);    /* #f9fafb */
  --foreground: oklch(0.2077 0.0398 265.75);    /* #0f172a */
  --destructive: oklch(0.6368 0.2078 25.33);    /* #ef4444 */
  --border: oklch(0.9288 0.0126 255.51);        /* #e2e8f0 */
  --radius: 0.75rem;
}
```

---

## Components (45 — shadcn/ui ベース)

| カテゴリ | コンポーネント |
|---------|--------------|
| **Action** | Button |
| **Input** | Input, Textarea, Select, Checkbox, RadioGroup, Switch, Slider, Calendar, InputOTP, Toggle, ToggleGroup, Label, Command |
| **Data Display** | Badge, Avatar, Table, Card, Carousel, Chart |
| **Navigation** | Breadcrumb, Tabs, Pagination, NavigationMenu, Menubar, Sidebar |
| **Feedback** | Alert, Sonner, Progress, Skeleton |
| **Overlay** | Dialog, AlertDialog, Sheet, Drawer, DropdownMenu, ContextMenu, HoverCard, Popover, Tooltip |
| **Disclosure** | Accordion, Collapsible |
| **Layout** | AspectRatio, Separator, ScrollArea |

---

## 設計原則

1. **Layered** — Background → Surface → Text の3層
2. **Contrast** — WCAG 2.1 AA (4.5:1以上)
3. **Semantic** — `bg-primary` ≠ `bg-blue-500`
4. **Minimal** — 1 View に3色まで
5. **Grid** — 4px基本、8px推奨

---

## 禁止パターン（抜粋）

| 禁止 | 代替 |
|------|------|
| `text-black` | `text-foreground` |
| `shadow-lg` / `shadow-2xl` | `shadow-sm` 〜 `shadow-md` |
| `border-t-4` / `border-l-4` | shadcn のデフォルトスタイル |
| `bg-blue-*` ハードコード | `bg-primary` |
| `tracking-tight` | letter-spacing: 0.01em / 0.02em |
| 300ms超のアニメーション | 150〜300ms |

全76項目: `foundations/prohibited.md`

---

## License

MIT

## Acknowledgments

- [melta UI](https://github.com/tsubotax/melta-ui) — 基盤デザインシステム
- [shadcn/ui](https://ui.shadcn.com/) — コンポーネントライブラリ
- [Tailwind CSS](https://tailwindcss.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/) — AI ツール連携
