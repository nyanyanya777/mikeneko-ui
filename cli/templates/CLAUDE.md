# melta UI — AI Quick Reference

> ShadCN/ui ベースのデザインシステム。Primary: Blue (#2b70ef)、日本語ファーストのタイポグラフィ。

## Design Tokens (抜粋)

### Colors
```
Primary:  #2b70ef (500), #f0f5ff (50), #07194e (950)
Text:     #0f172a (foreground/heading), #3d4b5f (body), #64748b (muted)
Border:   #e2e8f0
Ring:     #2b70ef (primary)
Success:  #059669
Warning:  #d97706
Danger:   #ef4444
```

### Typography
```
Font: Noto Sans JP, sans-serif
H1: 32px/1.4 bold (text-3xl)
H2: 26px/1.4 bold (text-2xl)
H3: 22px/1.4 semibold (text-xl)
Body: 18px/2.0 normal (text-base) letter-spacing: 0.02em
Small: 15px/1.7 (text-sm)
XS: 13px/1.4 (text-xs)
```

### Spacing
4px grid (Tailwind default). Prefer multiples of 8.

### Elevation
none → sm → md → overlay (shadow-xl max)

### Radius
sm(4px), md(8px), lg(12px), full — globals.css: `--radius: 0.75rem`

### Motion
Fast: 150ms, Normal: 200ms, Slow: 300ms (max)
Easing: ease-in-out (default)

---

## 設計原則（6つ）

1. **Layered** — Background → Surface → Text/Object の3層でUIを構成する
2. **Contrast** — テキストは背景に対してWCAG 2.1準拠（4.5:1以上）
3. **Semantic** — 色は用途で指定する（`bg-primary` ≠ 生の `bg-blue-500`）
4. **Minimal** — 1つのViewに使う色は3色まで（背景・アクセント・テキスト）
5. **Grid** — スペーシングは4の倍数を基本、8の倍数を推奨する
6. **State-Complete** — 新規コンポーネントは全状態（default / hover / focus / active / disabled / error / loading 等）を網羅して作る

---

## Components (45種 — shadcn/ui ベース)

### Action
- **Button**: default / destructive / outline / secondary / ghost / link × sm / default / lg / icon

### Input
- **Input**: default / disabled / error
- **Textarea**: default / disabled
- **Select**: SelectTrigger + SelectContent + SelectItem
- **Checkbox**: unchecked / checked / indeterminate / disabled
- **RadioGroup**: RadioGroupItem で構成
- **Switch**: on / off / disabled（旧 Toggle switch）
- **Slider**: single / range
- **Calendar**: single / range date selection
- **InputOTP**: verification code input
- **Toggle** / **ToggleGroup**: pressed state buttons
- **Label**: フォームラベル
- **Command**: 検索可能なコマンドパレット

### Data Display
- **Badge**: default / secondary / destructive / outline
- **Avatar**: AvatarImage / AvatarFallback
- **Table**: TableHeader + TableBody + TableRow + TableHead + TableCell
- **Card**: CardHeader + CardTitle + CardDescription + CardContent + CardFooter
- **Carousel**: horizontal / vertical
- **Chart**: area / bar / line / pie / radar / radial (Recharts)

### Navigation
- **Breadcrumb**: BreadcrumbList + BreadcrumbItem + BreadcrumbLink + BreadcrumbPage
- **Tabs**: TabsList + TabsTrigger + TabsContent
- **Pagination**: PaginationContent + PaginationItem + PaginationLink
- **NavigationMenu**: horizontal nav
- **Menubar**: application menubar
- **Sidebar**: SidebarProvider ベース、collapsible 対応

### Feedback
- **Alert**: default / destructive
- **Sonner**: toast() で呼び出し（旧 Toast）
- **Progress**: determinate / indeterminate
- **Skeleton**: loading placeholder

### Overlay
- **Dialog**: modal dialog（旧 Modal）
- **AlertDialog**: confirmation dialog
- **Sheet**: slide-in panel (top/right/bottom/left)
- **Drawer**: bottom drawer
- **DropdownMenu**: action menu（旧 Dropdown）
- **ContextMenu**: right-click menu
- **HoverCard**: hover popover
- **Popover**: generic popover
- **Tooltip**: TooltipProvider でラップ必須

### Disclosure
- **Accordion**: single / multiple collapsible sections
- **Collapsible**: toggle content visibility

### Layout
- **AspectRatio**: 1:1 / 16:9 / 4:3 / 3:2
- **Separator**: horizontal / vertical（旧 Divider）
- **ScrollArea**: custom scrollbar

---

## Tailwind CSS テーマ適用

```css
/* app/src/app/globals.css — Primary: #2b70ef (oklch) */
:root {
  --primary: oklch(0.5765 0.2038 261.31);       /* #2b70ef */
  --primary-foreground: oklch(1.0000 0 0);
  --background: oklch(0.9846 0.0017 247.84);    /* #f9fafb */
  --foreground: oklch(0.2077 0.0398 265.75);    /* #0f172a */
  --muted-foreground: oklch(0.5544 0.0407 257.42); /* #64748b */
  --border: oklch(0.9288 0.0126 255.51);        /* #e2e8f0 */
  --ring: oklch(0.5765 0.2038 261.31);
  --destructive: oklch(0.6368 0.2078 25.33);    /* #ef4444 */
  --radius: 0.75rem;
}
```

---

## 禁止パターン要約

| 禁止 | 代替 |
|------|------|
| `text-black` | `text-foreground` / `text-slate-900` |
| `bg-gray-300`以上の背景 | `bg-muted` / `bg-gray-50` 〜 `bg-gray-200` |
| `rounded-none` on cards | Card コンポーネントのデフォルト radius |
| `shadow-lg` / `shadow-2xl` | `shadow-sm` 〜 `shadow-md`（オーバーレイ: `shadow-xl`） |
| `border-gray-100` | `border-border` / `border-slate-200` |
| `text-gray-400` for body | `text-muted-foreground` |
| カード/Alert の `border-t-4` / `border-l-4` | shadcn Alert/Card のデフォルトスタイル |
| `bg-indigo-*` / `bg-blue-*` ハードコード | `bg-primary` / CSS変数を使用 |
| `tracking-tight` | 見出し 0.01em、本文 0.02em |
| 色だけで情報伝達 | アイコン/テキストを併用 |
| 300ms超のアニメーション | 150〜300ms に制限 |
| `<th>` の `scope` 省略 | Table コンポーネント使用 |
| **Button** の右寄せ（`ml-auto` / `justify-end` / `text-right` 等）※ Button 以外の要素には適用しない。カードヘッダーの `justify-between` 等は許可 | 左寄せ（デフォルト）または中央寄せ |
| アイコンをテキストの **後** に配置（シェブロン・外部リンク等の Trailing 許可リスト以外） | アイコンはテキストの **前（Leading）** に配置する |
| `flex-row-reverse` でアイコン位置制御 | DOM順 = 視覚順にする |
| 定義外アイコンサイズ（`w-3 h-3` / `w-7 h-7` 等） | 4段階のみ: 16/20/24/32px |

> 全禁止パターン: `foundations/prohibited.md` 参照
> アイコン配置ルール詳細: `foundations/icons.md` 参照

---

## HTML要素 → コンポーネント マッピング（必須）

> 素のHTML要素を使わず、必ず対応する shadcn/ui コンポーネントを使用すること。
> `components/ui/` 内のコンポーネント実装は例外。
> ESLint: `eslint-plugin-melta` の `melta/no-raw-html-elements` ルールで自動検出。

| HTML要素 | melta UI コンポーネント | インポート元 |
|----------|----------------------|-------------|
| `<button>` | `<Button>` | `@/components/ui/button` |
| `<input>` | `<Input>` | `@/components/ui/input` |
| `<input type="checkbox">` | `<Checkbox>` | `@/components/ui/checkbox` |
| `<input type="radio">` | `<RadioGroupItem>` | `@/components/ui/radio-group` |
| `<textarea>` | `<Textarea>` | `@/components/ui/textarea` |
| `<select>` | `<Select>` + `<SelectTrigger>` + `<SelectContent>` | `@/components/ui/select` |
| `<option>` | `<SelectItem>` | `@/components/ui/select` |
| `<label>` | `<Label>` | `@/components/ui/label` |
| `<table>` | `<Table>` | `@/components/ui/table` |
| `<thead>` | `<TableHeader>` | `@/components/ui/table` |
| `<tbody>` | `<TableBody>` | `@/components/ui/table` |
| `<tr>` | `<TableRow>` | `@/components/ui/table` |
| `<th>` | `<TableHead>` | `@/components/ui/table` |
| `<td>` | `<TableCell>` | `@/components/ui/table` |
| `<dialog>` | `<Dialog>` | `@/components/ui/dialog` |
| `<progress>` | `<Progress>` | `@/components/ui/progress` |
| `<hr>` | `<Separator>` | `@/components/ui/separator` |

---

## ファイル構成

```
melta-ui/
├── CLAUDE.md              ← このファイル (AI Quick Reference)
├── tokens/
│   └── tokens.json        ← デザイントークン (SSOT)
├── metadata/
│   └── components.json    ← コンポーネント仕様 (shadcn/ui ベース)
├── foundations/            ← デザイン基盤ドキュメント (10ファイル)
│   ├── color.md
│   ├── typography.md
│   ├── spacing.md
│   ├── elevation.md
│   ├── motion.md
│   ├── radius.md
│   ├── icons.md
│   ├── accessibility.md
│   ├── emotional-feedback.md
│   ├── design_philosophy.md
│   └── prohibited.md     ← 禁止パターン (76項目)
├── components/            ← コンポーネント詳細ドキュメント
├── patterns/              ← パターンドキュメント (5ファイル)
├── ai/
│   └── mcp/               ← MCP Server
│       ├── src/index.ts
│       └── dist/index.js
├── packages/
│   └── eslint-plugin-melta/   ← 素のHTML要素検出 ESLint プラグイン
├── app/                   ← Next.js + shadcn/ui 実装
│   ├── src/
│   │   ├── app/globals.css    ← テーマ (CSS変数)
│   │   ├── components/ui/     ← shadcn/ui コンポーネント (45個)
│   │   └── lib/utils.ts       ← cn() ユーティリティ
│   └── components.json        ← shadcn/ui 設定
└── docs/                  ← ドキュメントサイト
```

---

## MCP Server

5つのツールを提供:

| ツール | 説明 |
|--------|------|
| `get_token` | デザイントークン取得 (color, typography, spacing, etc.) |
| `get_component` | コンポーネント仕様取得 (shadcn/ui ベース) |
| `get_foundation` | ファウンデーション MD 取得 |
| `get_prohibited` | 禁止パターン取得 |
| `get_quick_reference` | この CLAUDE.md を返す |

```json
{
  "mcpServers": {
    "melta-ui": {
      "command": "node",
      "args": ["./ai/mcp/dist/index.js"]
    }
  }
}
```

---

## タスクベース読み込みガイド

| タスク | 読み込むファイル（順序） |
|--------|------------------------|
| 単体コンポーネント生成 | CLAUDE.md のみ |
| ページ生成 | + foundations/theme.md → patterns/layout.md → 関連 component md |
| ダークモード対応 | + foundations/theme.md → foundations/color.md |
| フォーム画面 | + patterns/form.md → Input / Select / Checkbox / Button |
| データ一覧 | + Table → Pagination → Badge |
| ダッシュボード | + **patterns/dashboard.md** → Card / Table / Progress / Chart / Badge |
| 設定画面 | + Tabs → Switch / Select / RadioGroup |
| モーダル / 確認 | + Dialog / AlertDialog → Button |
| Loading / 空状態 | + Skeleton → interaction-states.md |
| 通知フィードバック | + Sonner → Alert → interaction-states.md |
| サイドバー付きページ | + Sidebar → layout.md |
| ナビゲーション | + navigation.md → Sidebar → Tabs / Breadcrumb |
| レスポンシブ対応 | + patterns/responsive.md → layout.md |
| アクセシビリティ確認 | + foundations/accessibility.md |
| テーマカスタマイズ | foundations/theme.md + app/src/app/globals.css |

---

## テーマ・カラー変数・ダークモード

> テーマ設定・CSS変数定義: `app/src/app/globals.css` を参照。

| 設定 | 値 |
|------|-----|
| **ダークモード** | `OFF` |

- `OFF`: ライトモードのみで設計・生成する（デフォルト）
- `ON`: ダークモード対応を含めて設計・生成する（`.dark` セクション参照）

---

## Design Context

### Users
- **対象**: B2B / B2C 両方の汎用デザインシステム
- **エンドユーザー**: 業務SaaSを使うビジネスパーソンから、ECサイト・予約サービスの一般消費者まで
- **利用コンテキスト**: ダッシュボード、管理画面、EC、予約、学習、医療、行政など幅広いドメイン
- **DSの消費者**: 人間の開発者・デザイナー、および Claude Code / Cursor 等の AI コード生成エージェント

### Brand Personality
- **3語で表すと**: 静謐・精緻・温もり（Quiet · Precise · Warm）
- **声のトーン**: 「声を張らずに伝わる」— 主張しすぎない、でも確かに伝わる
- **コアメタファー**: 「機能的な黒子であり、たまに微笑む」
- **感情目標**: 心地よい集中 → 洗練された効率 → 穏やかな親しみ（この順で優先）

### Aesthetic Direction
- **ビジュアルトーン**: ミニマルだが冷たくない。フラットな基盤に Background → Surface → Text の3層で奥行きを出す
- **参考プロダクト**: Linear / Notion / Stripe / Vercel
- **アンチリファレンス**: 派手なグラデーション・ネオンカラー、Bootstrap 的な没個性テンプレート

### Design Principles
1. **Content First** — UIは黒子。コンテンツが主役であり、装飾ではなく構造で伝える
2. **Calm Confidence** — 信頼感を静かに醸成する。過剰な演出より、正確なスペーシングとコントラストで品質を示す
3. **Inclusive by Default** — WCAG 2.1 AA準拠はオプションではなくデフォルト
4. **Systematic Warmth** — 4px グリッド・セマンティックカラー・制限されたシャドウで一貫性を保ちつつ、人間味を添える
5. **Machine-Readable** — トークン・メタデータ・セマンティック命名により、AIエージェントが正確にUIを生成できる

---

## 参照先

- **トークン全量**: `tokens/tokens.json`
- **コンポーネント全量**: `metadata/components.json`
- **禁止パターン全量**: `foundations/prohibited.md`
- **ShadCN/ui docs**: `https://ui.shadcn.com/docs`

---

## デプロイ

| 項目 | 値 |
|------|-----|
| ホスティング | Netlify（手動デプロイ） |
| 本番URL | https://melta.tsubotax.com |
| publish ディレクトリ | `.`（リポジトリルート）— `netlify.toml` で設定済み |

```bash
# ドキュメントサイトデプロイ
netlify deploy --prod

# Next.js アプリ (別途)
cd app && npm run build
```
