# melta UI

> 声を張らずに伝わるUI ── AI-Ready Design System for Tailwind CSS

## melta UI とは

Tailwind CSS 4 のクラス規約と Markdown リファレンスで構成された **AI-Ready デザインシステム** です。
MCP サーバー + 機械可読トークン（`tokens.json`）により、Claude Code / Cursor / Windsurf から統一的にアクセスできます。

## 特徴

- **AI-Ready** — MCP サーバー + `tokens.json` + `.cursor/rules/` でマルチ AI ツール対応
- **AI ファースト設計** — `CLAUDE.md` を起点とした段階的読み込みで、必要な情報だけを効率的に参照
- **Tailwind CSS 4 ネイティブ** — クラス規約 + セマンティックトークンで構築。ビルドステップ不要
- **WCAG 2.1 AA 準拠** — テキストコントラスト比 4.5:1 以上を全コンポーネントで保証
- **27 コンポーネント + 10 ファウンデーション + 5 パターン** — 実用的な SaaS UI を構築可能な規模
- **単一 HTML ショーケース** — `showcase.html` で全コンポーネントをインタラクティブに確認
- **ダークモード対応** — CSS 変数ベースのテーマ切り替え

## クイックスタート

### AI（Claude Code）での利用

1. このリポジトリをプロジェクトルートに配置する
2. Claude Code が `CLAUDE.md` を自動で読み込む
3. UIを指示するだけでデザインシステム準拠のコードが生成される

```
「ユーザー一覧のテーブルを作って」
→ table.md + pagination.md + badge.md を参照し、DS準拠のHTMLを生成
```

### MCP サーバーでの利用（Claude Code / Cursor）

```bash
# 依存インストール + ビルド
npm install && npm run build

# Claude Code に MCP サーバーを登録
claude mcp add melta-ui node ./dist/index.js
```

MCP ツール:

| ツール | 説明 | 入力例 |
|--------|------|--------|
| `get_token` | トークン検索 | `{ "path": "color.primary.600" }` |
| `get_component` | コンポーネント仕様取得 | `{ "id": "button" }` |
| `check_rule` | 禁止パターンチェック | `{ "classes": "text-black shadow-2xl" }` |
| `search` | 全文検索 | `{ "query": "card" }` |

### Cursor での利用

`.cursor/rules/` に 3 つのルールファイルが含まれています:
- `melta-ui.mdc` — DS 全体ルール（カラー・スペーシング・禁止パターン）
- `color-system.mdc` — カラートークン一覧
- `components.mdc` — 27 コンポーネントの Tailwind クラス一覧

### 手動での利用

1. Tailwind CSS 4 をプロジェクトに導入する
2. `theme.md` に記載された CSS 変数をプロジェクトに追加する
3. 各コンポーネントの `.md` ファイルを参照し、クラスを適用する

## ディレクトリ構成

```
design-system/
├── CLAUDE.md                # AI向け指示書（エントリーポイント）
├── tokens/tokens.json       # デザイントークン SSOT（~120トークン）
├── metadata/components.json # 27コンポーネントメタデータ
├── src/                     # MCP サーバー（TypeScript）
├── .mcp.json                # Claude Code MCP 登録
├── .cursor/rules/           # Cursor 用 DS ルール
├── design_philosophy.md     # 設計思想
├── theme.md                 # テーマ・CSS変数・ダークモード
├── foundations/             # 基盤定義（10ファイル）
│   ├── color.md
│   ├── typography.md
│   ├── spacing.md
│   ├── elevation.md
│   ├── radius.md
│   ├── motion.md
│   ├── z-index.md
│   ├── icons.md
│   ├── accessibility.md
│   └── emotional-feedback.md
├── components/              # コンポーネント仕様（27ファイル）
│   ├── button.md
│   ├── card.md
│   ├── ...
│   └── skeleton.md
├── patterns/                # パターン・ガイドライン（5ファイル）
│   ├── layout.md
│   ├── form.md
│   ├── navigation.md
│   ├── interaction-states.md
│   └── responsive.md
├── prohibited.md            # 禁止パターン一覧（71項目）
├── showcase.html            # 全コンポーネントショーケース
├── examples/                # 検証ページ
│   └── *.html
└── assets/icons/            # アイコン（Charcoal 207 + Lucide 15）
```

## 読み込みモード

| モード | 読むファイル | 用途 |
|--------|------------|------|
| クイック | `CLAUDE.md` のみ | 単体UIの生成（ボタン、カード等） |
| 標準 | + `theme.md` + 関連コンポーネント md | ページ単位の生成 |
| フル | 全ファイル | 新規プロジェクト構築・DS変更 |

## 設計原則

1. **Layered** — Background → Surface → Text/Object の3層でUIを構成する
2. **Contrast** — テキストは背景に対して WCAG 2.1 準拠（4.5:1 以上）
3. **Semantic** — 色は用途で指定する（`bg-surface-primary` ≠ 生の `bg-white`）
4. **Minimal** — 1つの View に使う色は3色まで（背景・アクセント・テキスト）
5. **Grid** — スペーシングは4の倍数を基本、8の倍数を推奨

詳細は `design_philosophy.md` を参照。

## コンポーネント一覧

| コンポーネント | 用途 |
|---------------|------|
| Button | CTA・サブアクション・アイコンボタン |
| Card | 情報のグルーピング・サーフェス |
| Checkbox | 複数選択の入力 |
| Modal | 確認ダイアログ・情報表示 |
| Sidebar | ナビゲーション（標準・コンパクト） |
| TextField | テキスト入力・検索 |
| Select | ドロップダウン選択 |
| Dropdown | アクションメニュー |
| Radio | 単一選択の入力 |
| Toggle | オン/オフの切り替え |
| Toast | 一時的な通知フィードバック |
| List | アイテムの一覧表示 |
| Badge | ステータス・カウント表示 |
| Tag | ラベル・カテゴリ表示（削除可能） |
| Table | データの表形式表示 |
| Tooltip | 補足情報のホバー表示 |
| Tabs | コンテンツの切り替え |
| Breadcrumb | 階層ナビゲーション |
| Pagination | ページ送り |
| Avatar | ユーザーアイコン・イニシャル |
| Progress | 進捗バー |
| Alert | 重要な通知・警告 |
| Accordion | 折りたたみコンテンツ |
| Skeleton | ローディング状態 |
| Divider | セクション間の区切り線 |
| Stepper | マルチステップの進捗表示 |
| Date Picker | カレンダーによる日付選択 |

## 検証ページ

| ファイル | 内容 |
|---------|------|
| `examples/taskflow.html` | プロジェクト管理 SaaS |
| `examples/metrica.html` | アナリティクス SaaS |
| `examples/helpdesk.html` | カスタマーサポート SaaS |
| `examples/article.html` | メディア記事ページ |
| `examples/learning-path.html` | 学習プラットフォーム |
| `examples/sidebar-demo.html` | Sidebar コンポーネントデモ |

## ライセンス

MIT License — 詳細は [LICENSE](./LICENSE) を参照。

同梱アイコンのライセンスは [THIRD_PARTY_LICENSES.md](./THIRD_PARTY_LICENSES.md) を参照。

## 謝辞

- [Charcoal Icons](https://github.com/pixiv/charcoal)（pixiv Inc.）— Apache License 2.0
- [Lucide Icons](https://github.com/lucide-icons/lucide) — ISC License
- [Tailwind CSS](https://tailwindcss.com/)
