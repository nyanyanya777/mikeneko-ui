# Border Radius

> 角丸の統一ルール。4段階に制限し、コンポーネントの用途に合わせて使い分ける。

---

## トークン表

| トークン | Tailwind | 値 | 用途 |
|---------|----------|-----|------|
| radius-sm | `rounded` | 0.25rem (4px) | チェックボックス、小さな要素 |
| radius-md | `rounded-lg` | 0.5rem (8px) | ボタン、入力欄、トースト |
| radius-lg | `rounded-xl` | 0.75rem (12px) | カード、モーダル、リストコンテナ |
| radius-full | `rounded-full` | 9999px | バッジ、トグルノブ、アバター |

---

## 用途別ルール

| コンポーネント | トークン | Tailwind | 説明 |
|--------------|---------|----------|------|
| ボタン | radius-md | `rounded-lg` | 全サイズ共通 |
| 入力欄（TextField, Select） | radius-md | `rounded-lg` | 全サイズ共通 |
| カード | radius-lg | `rounded-xl` | 基本カード、メトリクスカード |
| モーダル | radius-lg | `rounded-xl` | ダイアログ本体 |
| トースト | radius-md | `rounded-lg` | 通知バー |
| バッジ | radius-full | `rounded-full` | ステータスバッジ |
| トグル（トラック） | radius-full | `rounded-full` | トラック部分 |
| トグル（ノブ） | radius-full | `rounded-full` | ノブ部分 |
| チェックボックス | radius-sm | `rounded` | ボックス部分 |
| テーブル | radius-lg | `rounded-xl` | テーブルコンテナ |
| リストコンテナ | radius-lg | `rounded-xl` | リスト外枠 |

---

## ルール

- 角丸は **4段階のみ** 使用する。`rounded-md`, `rounded-2xl` 等の中間値は使わない
- 親要素の角丸 > 子要素の角丸 の関係を維持する（カード `rounded-xl` > 内部ボタン `rounded-lg`）
- 同一コンポーネント内で角丸を混在させない

---

## 禁止パターン

| 禁止 | 理由 | 代替 |
|------|------|------|
| `rounded-none` on cards | カードは常に角丸を持つ | `rounded-xl` |
| `rounded-md` | 4段階に含まれない中間値 | `rounded-lg` |
| `rounded-2xl` / `rounded-3xl` | 過剰な角丸 | `rounded-xl` |
| `rounded-sm` | 4段階に含まれない | `rounded` |
