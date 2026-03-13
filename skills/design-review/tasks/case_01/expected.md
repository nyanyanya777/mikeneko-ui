# Case 01: 期待されるレビュー結果

## 検出すべき違反（16件）

### カラー（5件）

1. **`text-black`（6箇所）** — 純黒はコントラストが強すぎる → `text-slate-900`
   - 行: h1, メトリクスカード値×4, テーブルtd
2. **`text-gray-400` を本文/ラベルに使用（5箇所）** — WCAG不適合 → `text-body`（担当者・期限）、`text-slate-500`（メトリクスラベル）
   - 行: p説明文, メトリクスラベル×4, テーブルtd×2
3. **`bg-green-*`（2箇所）** — emeraldで統一 → `bg-emerald-50 text-emerald-700`
4. **`bg-yellow-*`（2箇所）** — amberで統一 → `bg-amber-50 text-amber-700`
5. **`bg-rose-*`（1箇所）** — redで統一 → `bg-red-50 text-red-700`

### サイドバー（4件）

6. **`w-60`** — 非標準幅 → `w-64`
7. **`bg-slate-800`（暗い背景）** — メインとのコントラストが強すぎる → `bg-white` + ボーダー
8. **`rounded-xl` on ナビアイテム** — ボタン等との一貫性を損なう → `rounded-lg`
9. **`w-7 h-7` アイコン（1箇所）** — DS標準からの逸脱 → `w-5 h-5`

### スペーシング・レイアウト（3件）

10. **`rounded-none` on cards（4箇所）** — UIの統一感を損なう → `rounded-xl`
11. **`shadow-lg`（4箇所）** — 影が強すぎる → `shadow-sm`
12. **`p-4` on cards** — コンテンツが窮屈（p-5未満） → `p-5` 以上

### ボタン（2件）

13. **`py-0.5` on button** — タップターゲットが小さすぎる → `py-1.5` 以上
14. **`bg-primary-400`** — CTAとして弱い → `bg-primary-600`

### ボーダー（1件）

15. **`border-gray-100`（4箇所）** — 薄すぎて境界が見えない → `border-slate-200`

### フォーム（1件）

16. **`<select>` に `appearance-none` なし** — ネイティブ矢印がブラウザ間で不安定 → `appearance-none` + `pr-10` + カスタムSVGシェブロン

### アクセシビリティ（5件 — 上記と一部重複）

- **`<label>` なしの入力欄** — プレースホルダーのみ → `<label>` を使用
- **`focus:outline-none` without ring** — フォーカスインジケーター消失 → `focus:ring-2 focus:ring-primary-500/50`
- **`<nav>` に `aria-label` なし** — 複数ナビがある場合に区別不可
- **Active ナビに `aria-current="page"` なし** — スクリーンリーダーが現在ページを識別不可
- **`<th>` に `scope` なし** — ヘッダーとデータの関係が不明確 → `scope="col"`

### カラーセマンティクス（追加観点）

- **サイドバーのナビテキスト `text-gray-400`** — DS非準拠。Default ナビは `text-body`

## 重大度分類

| 重大度 | 件数 | 内容 |
|--------|------|------|
| Critical | 3 | アクセシビリティ違反（label欠如、focus消失、aria欠如） |
| High | 7 | カラー違反（text-black, text-gray-400, 色名不統一）、サイドバー暗背景 |
| Medium | 5 | スペーシング（rounded-none, shadow-lg, p-4）、ボタン（py-0.5, primary-400） |
| Low | 1 | border-gray-100 |
