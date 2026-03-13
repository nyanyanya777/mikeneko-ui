# Case 03: 期待されるレビュー結果

## 検出すべき違反（4件）

### エレベーション（1件）

1. **`hover:shadow-2xl`（3箇所）** — 影が強すぎてノイズになる → `hover:shadow-md`（オーバーレイでない通常カードは `shadow-md` まで）

### カラー（1件）

2. **`text-blue-600`（3箇所）** — リンク色は primaryで統一 → `text-primary-600`

### スペーシング（1件）

3. **`p-0` on お問い合わせカード** — コンテンツが窮屈になる → `p-5` 以上（現在 `p-0` でテキストが枠に張り付いている）

### フォーム（1件）

4. **検索 `<input>` に `<label>` なし** — プレースホルダーのみ → visually-hidden な `<label>` を使用するか `aria-label` を付与

### 良い実装（検出してはいけない偽陽性）

以下は正しい実装であり、違反として報告してはいけない：
- `text-slate-900` が見出しに使われている ✓
- `text-body` が本文に使われている ✓
- `border-slate-200` が使われている ✓
- `rounded-xl` on cards ✓
- `shadow-sm` がデフォルト影 ✓
- カードグリッドが `grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6` ✓
- アコーディオンの構造が正しい（`details/summary` + `list-none`）✓
- ボタンが適切なパディング `px-4 py-2` ✓
- `transition-colors` が使われている ✓
- `leading-relaxed` が本文に使われている ✓

## 重大度分類

| 重大度 | 件数 | 内容 |
|--------|------|------|
| Critical | 1 | 検索入力にラベルなし（アクセシビリティ） |
| High | 1 | text-blue-600（DS色統一違反） |
| Medium | 1 | p-0 on card（スペーシング） |
| Low | 1 | hover:shadow-2xl（エレベーション） |

## 難易度メモ

このケースは全体的にDS準拠度が高い「ほぼ合格」のHTML。
- `hover:shadow-2xl` は hover 時のみなので見落としやすい
- `text-blue-600` は `text-primary-600` と視覚的に近いため見逃しやすい
- `p-0` は要素の外側（border-slate-200 の内側）のパディングであり、内部の `text-center` div にはパディングがないことに注意
- 検索バーの `<label>` 欠如は、検索UIでは見落としやすい典型パターン
