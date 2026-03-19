# mikeneko UI

**[melta UI](https://github.com/tsubotax/melta-ui) をフォークし、shadcn/ui で実装したデザインシステム。React (Vite) / Next.js 対応。**

---

## melta UI からの変更点

mikeneko UI は [melta UI](https://github.com/tsubotax/melta-ui) のフォークである。melta UI の設計思想（AI 可読性・段階的読み込み・セマンティックトークン）を継承しつつ、以下を追加した。

| 変更 | 内容 |
|------|------|
| **shadcn/ui 統合** | 45 コンポーネントを `app/src/components/ui/` に実装 |
| **リファレンス実装** | `app/` に Next.js 16 ベースの動作するアプリケーション |
| **Storybook** | 全 45 コンポーネントのストーリーを収録（a11y アドオン付き） |
| **CLI** | `npx mikeneko-ui` でテーマ・ルールをプロジェクトに注入（npm publish 済み） |
| **フォント統一** | Noto Sans JP に一本化（Inter / Hiragino / Geist を廃止） |
| **設計原則追加** | 6 番目の原則「State-Complete」を追加 |
| **テーマ定義** | oklch ベースの CSS 変数を `app/src/app/globals.css` に定義 |

---

## Design Principles

1. **Layered** — Background → Surface → Text/Object の 3 層で UI を構成する
2. **Contrast** — テキストは背景に対して WCAG 2.1 準拠（4.5:1 以上）
3. **Semantic** — 色は用途で指定する（`bg-primary` ≠ 生の `bg-blue-500`）
4. **Minimal** — 1 つの View に使う色は 3 色まで（背景・アクセント・テキスト）
5. **Grid** — スペーシングは 4 の倍数を基本、8 の倍数を推奨
6. **State-Complete** — 新規コンポーネントは全状態（default / hover / focus / active / disabled / error / loading 等）を網羅する

> 詳細は `foundations/design_philosophy.md` を参照。

---

## Quick Start

### CLI（推奨）

```bash
npx mikeneko-ui
```

対話形式で React (Vite) / Next.js プロジェクトにテーマと shadcn/ui 設定を注入する。

### Claude Code

1. このリポジトリをプロジェクトルートに配置
2. Claude Code が `CLAUDE.md` を自動で読み込む
3. UI を指示するだけで DS 準拠のコードが生成される

```
「ユーザー一覧のテーブルを作って」
→ Table + Pagination + Badge を参照し、shadcn/ui ベースのコードを生成
```

#### 同梱スキル — `/design-review`

```
/design-review examples/ec-home.html
→ DS 準拠チェック → 違反検出・重大度分類 → 修正提案を出力
```

### MCP サーバー

```bash
cd ai/mcp && npm install && npm run build
claude mcp add mikeneko-ui node ./ai/mcp/dist/index.js
```

| ツール | 説明 |
|--------|------|
| `get_token` | デザイントークン取得 |
| `get_component` | コンポーネント仕様取得 |
| `get_foundation` | ファウンデーション MD 取得 |
| `get_prohibited` | 禁止パターン取得 |
| `get_quick_reference` | CLAUDE.md を返す |

### Cursor

`.cursor/rules/` に 3 つのルールファイルを同梱。

### Storybook

```bash
cd app && npm run storybook
```

全 45 コンポーネントのストーリーを `app/src/components/ui/*.stories.tsx` に収録。variants・sizes・状態（disabled, error 等）を網羅。a11y アドオンで WCAG 準拠をチェックできる。

### Pencil

`docs/Melta-UI.pen` に 32 コンポーネントを収録。

---

## Components（shadcn/ui ベース・45 種）

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

## Directory

```
mikeneko-ui/
├── CLAUDE.md                    # AI 向けエントリーポイント
├── app/                         # Next.js 16 + shadcn/ui 実装
│   ├── .storybook/              #   Storybook 設定
│   ├── src/app/globals.css      #   テーマ（oklch CSS 変数）
│   └── src/components/ui/       #   コンポーネント（45 個）+ ストーリー（45 個）
├── cli/                         # mikeneko-ui CLI（npm publish 済み）
├── ai/mcp/                      # MCP サーバー（TypeScript）
├── tokens/tokens.json           # デザイントークン SSOT
├── metadata/components.json     # コンポーネントメタデータ
├── foundations/                  # 基盤定義（13 ファイル）
├── components/                  # コンポーネント仕様 MD
├── patterns/                    # パターン MD（5 ファイル）
├── docs/                        # ドキュメントサイト + Pencil ファイル
├── examples/                    # サンプルページ
├── skills/                      # Claude Code スキル
└── .cursor/rules/               # Cursor 用ルール
```

---

## License

MIT License — [LICENSE](./LICENSE)

同梱アイコンのライセンスは [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) を参照。

### Acknowledgments

- [melta UI](https://github.com/tsubotax/melta-ui) — フォーク元のデザインシステム
- [shadcn/ui](https://ui.shadcn.com/) — コンポーネント実装基盤
- [Charcoal Icons](https://github.com/pixiv/charcoal)（pixiv Inc.）— Apache License 2.0
- [Lucide Icons](https://github.com/lucide-icons/lucide) — ISC License
- [Tailwind CSS](https://tailwindcss.com/)
