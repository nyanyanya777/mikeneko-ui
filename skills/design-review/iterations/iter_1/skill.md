---
name: design-review
description: HTMLファイルをmelta UIデザインシステムに照らしてレビューする
---

# デザインレビュー

HTMLファイルを melta UI デザインシステム（CLAUDE.md + foundations/prohibited.md）に照らしてレビューし、違反を検出・分類・修正提案する。

## 手順

### Step 1: 対象のHTMLファイルを読む
レビュー対象の HTML ファイルを全文読み込む。

### Step 2: DSリファレンスを読む
以下を読み込む:
- `CLAUDE.md`（クイックリファレンス・禁止パターン要約）
- `foundations/prohibited.md`（全禁止パターン — SSOT）

### Step 3: チェックリストに沿って違反を検出する
以下のカテゴリ順にHTMLを走査し、違反を検出する。

#### 3-1. カラー
- `text-black` → `text-slate-900`
- `text-gray-400` を本文・ラベルに使用 → `text-body` または `text-slate-500`
- `bg-green-*` → `bg-emerald-*`
- `bg-yellow-*` → `bg-amber-*`
- `bg-rose-*` → `bg-red-*`
- `text-blue-*` for links → `text-primary-600`
- `bg-primary-400` → `bg-primary-600`
- `bg-gray-300` 以上の暗い背景 → `bg-gray-50` 〜 `bg-gray-200`
- サイドバーに暗い背景色（`bg-slate-800` 等）→ `bg-white` + ボーダー

#### 3-2. スペーシング・レイアウト
- `rounded-none` on cards → `rounded-xl`
- `shadow-lg` / `shadow-2xl`（hover含む）→ `shadow-sm` 〜 `shadow-md`
- `p-0` 〜 `p-4` on cards（p-5未満）→ `p-5` 以上
- `py-0.5` on buttons → `py-1.5` 以上
- `gap-0` between sections → `gap-6` 以上
- サイドバー幅 `w-60` 等の非標準値 → `w-64` or `w-16`
- ナビアイテムの `rounded-xl` → `rounded-lg`
- ナビアイコン `w-7 h-7` 以上 → `w-5 h-5`

#### 3-3. タイポグラフィ
- `tracking-tight` → `tracking-normal` 以上
- `text-xs` for body text → `text-base`
- `font-light`（300）→ `font-normal`（400）以上

#### 3-4. モーション
- `duration-500` 以上 → `duration-300` 以下

#### 3-5. ボーダー
- `border-gray-100` → `border-slate-200`

#### 3-6. フォーム
- `<select>` に `appearance-none` なし → `appearance-none` + `pr-10` + カスタムSVGシェブロン（`<div class="relative">` で囲む）
- `<label>` なしの入力欄（プレースホルダーのみ）→ `<label>` を `for` で関連付け。検索欄等で視覚的に非表示にする場合は `sr-only` クラスまたは `aria-label` を使用
- チェックボックス・ラジオのグループに `<fieldset>` / `<legend>` なし → 必ず使用
- `focus:outline-none` で ring なし → `focus:ring-2 focus:ring-primary-500/50`

#### 3-7. アクセシビリティ
- `<nav>` に `aria-label` なし → 特に複数 nav がある場合は必須
- Active ナビアイテムに `aria-current="page"` なし → 必ず付与
- `<th>` に `scope` なし → `scope="col"` or `scope="row"` を付与
- アイコンボタンに `aria-label` なし → 操作内容を `aria-label` で明示
- Drawer にフォーカストラップなし → Tab/Shift+Tab が Drawer 内を循環

### Step 4: 「推奨」と「必須」を区別する
以下は **必須ではなく推奨** であり、違反として報告しない:
- テキストのみボタン（アイコンなし）の `inline-flex items-center justify-center gap-2` — アイコン付きボタンのみ必須
- チェックボックス・ラジオの Tailwind サイズクラス（`w-4 h-4`）— CSS でオーバーライドされている可能性がある

### Step 5: 重大度を判定する
各違反に以下の基準で重大度を割り当てる:

| 重大度 | 基準 | 例 |
|--------|------|-----|
| Critical | スクリーンリーダー・キーボード操作に直接影響するアクセシビリティ違反 | label欠如、focus消失、aria欠如、フォーカストラップなし |
| High | DSカラー体系・セマンティクスの明確な違反 | text-black, text-gray-400, 色名不統一, サイドバー暗背景, select appearance-none |
| Medium | スペーシング・エレベーション・サイズの不統一 | rounded-none, shadow-lg, p-4 on card, py-0.5, primary-400, tracking-tight, duration-500 |
| Low | 境界線・細部の視覚的なずれ | border-gray-100 |

### Step 6: レポートを出力する
以下のフォーマットで出力する。同一の違反クラスが複数箇所にある場合は1件として集約し「（N箇所）」と付記する。

```markdown
# デザインレビューレポート

**対象ファイル**: [ファイル名]
**検出違反数**: N件

## サマリー

| 重大度 | 件数 |
|--------|------|
| Critical | N |
| High | N |
| Medium | N |
| Low | N |

## 違反詳細

### カラー

- [重大度] **`違反クラス`**（N箇所: 行XX, XX）— 理由 → `修正クラス`

### スペーシング・レイアウト
...

### タイポグラフィ
...

### モーション
...

### ボーダー
...

### フォーム
...（複合修正が必要な場合はコードブロックで修正例を提示）

### アクセシビリティ
...

## 適合確認
（正しく実装されている主要な点を箇条書き）
```
