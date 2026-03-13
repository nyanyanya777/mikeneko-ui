# Case 02: 期待されるレビュー結果

## 検出すべき違反（5件）

### フォーム（2件）

1. **`<select id="dept">` に `appearance-none` なし** — ネイティブ矢印がブラウザ間で不安定 → `appearance-none` + `pr-10` + カスタムSVGシェブロン（`<div class="relative">` で囲む）
   - 注: `<select id="lang">` は正しく実装されている。差を検出できるかがポイント
2. **チェックボックスグループに `<fieldset>` / `<legend>` なし** — グループの目的がスクリーンリーダーに伝わらない → `<fieldset>` + `<legend>` で囲む

### タイポグラフィ（1件）

3. **`tracking-tight` on textarea** — 日本語の可読性が低下する → `tracking-normal` 以上

### モーション（1件）

4. **`duration-500` on 保存ボタン** — 操作が鈍く感じる → `duration-300` 以下

### 良い実装（検出してはいけない偽陽性）

以下は正しい実装であり、違反として報告してはいけない：
- `<label>` が全入力に付与されている ✓
- `focus:ring-2 focus:ring-primary-500/50` が使われている ✓
- `caret-primary-600` が使われている ✓
- `border-slate-200` が使われている ✓
- `text-slate-900` / `text-body` が正しく使い分けられている ✓
- `bg-emerald-*` / `bg-amber-*` / `bg-red-*` で統一されている（色バッジなし）✓
- `rounded-xl` on cards ✓
- `shadow-sm` ✓
- `select#lang` は `appearance-none` + SVG で正しく実装 ✓

## 重大度分類

| 重大度 | 件数 | 内容 |
|--------|------|------|
| Critical | 1 | fieldset/legend 欠如（アクセシビリティ） |
| High | 1 | select の appearance-none 欠如 |
| Medium | 1 | tracking-tight |
| Low | 1 | duration-500 |

## 難易度メモ

このケースは「ほぼ正しいHTML」に少数の違反が混ざっている。偽陽性（正しいものを違反と誤検出）を出さないことが重要。特に:
- 2つの `<select>` のうち1つだけが違反
- 全体的にDS準拠度が高いので、重箱の隅をつつかないこと
