# Button

> ボタンコンポーネント仕様。
> Tailwind CSS 4

---

## 1. 原則

- **階層構造**: ボタンは3階層のピラミッド構造で運用する。重要度が高いほど視覚的に目立たせ、配置数は少なくする
- **1画面1CTA**: Containedボタン（CTA）は画面内で最小限に。ユーザーの主目的（登録、購入、確認、次へ）にのみ使用
- **色だけで状態を伝えない**: ボーダーやウェイトの変化を併用し、色覚多様性に対応する
- **最小タップ領域 44×44px**: アイコンボタンも含め、パディングでタップ領域を確保する
- **ラベルは操作/遷移先を予測可能にする**: 「送信」「削除する」「詳細を見る」等、押した結果がわかる文言にする

---

## 2. 解剖

```
┌─────────────────────────────────┐
│  [Icon]  Label Text  [Icon]    │  ← Container
└─────────────────────────────────┘
```

| パーツ | 役割 | 必須 |
|--------|------|------|
| Container | ボタンの外枠。クリック/タップ領域を定義する | Yes |
| Label | 操作内容を示すテキスト | Yes（アイコンボタン以外） |
| Leading Icon | ラベルの前に置くアイコン。操作の意味を補強 | No |
| Trailing Icon | ラベルの後に置くアイコン。遷移や展開を示唆 | No |

---

## 3. パターン

### Contained（CTA）
プラットフォームがユーザーに行動を促す最重要ボタン。画面内での出現を最小限に。

### Outlined
Containedの次に強い。強めのセカンダリアクションや状態トグル（フォロー等）に使用。

### Neutral
非主要アクション（詳細を見る、戻る等）。隣接して複数配置可能（唯一の例外）。

### Lighted
状態変化後のアクティブ表示。Neutralとペアで使用し、単独使用禁止。テキスト/アイコンも色と同時に変更する。

### Danger
破壊的操作の最終確認（投稿削除、アカウント解約等）。

### Subtle
Contained/Outlined/Neutralに付随するセカンダリアクション（キャンセル、閉じる等）。

### コンテキストカラーの適用

Containedボタンは、モーダルのコンテキストに応じて背景色を差し替えることができる:

| コンテキスト | 背景色 | hover | 用途 |
|------------|--------|-------|------|
| 標準 | `bg-primary-600` | `hover:bg-primary-700` | 通常の CTA |
| 破壊的操作 | `bg-red-500` | `hover:bg-red-600` | 削除・解約確認 |
| 警告応答 | `bg-amber-600` | `hover:bg-amber-700` | 警告への行動（ページ離脱等） |

### サイズ

| サイズ | 用途 | Tailwindクラス | フォントサイズ |
|--------|------|---------------|---------------|
| Large | ページ内の主要アクション。最も重い | `px-5 py-2.5 text-base` | 18px |
| Medium | カード/ダイアログ内の主要アクション | `px-4 py-2 text-[1rem]` | 16px |
| Small | カードフッター・リスト内など省スペース | `px-3 py-1.5 text-[0.875rem]` | 14px |

> Large は `text-base`（18px）、Medium は `text-[1rem]`（16px）。フォントサイズ + パディング差（`py-2` vs `py-2.5`、`px-4` vs `px-5`）で視覚的階層を区別する。18 → 16 → 14px の等間隔スケール。

---

## 4. 振る舞い

### 状態遷移

```
Enabled → Hover → Active/Pressed → Enabled
                                  ↘ Loading → Enabled
Enabled → Focus（キーボード操作時）
Enabled → Disabled（条件未達時）
```

| 状態 | 視覚変化 | 備考 |
|------|---------|------|
| Enabled | デフォルトの見た目 | 初期表示状態 |
| Hover | 背景色を1段階暗く | `hover:bg-primary-700` 等 |
| Active | さらに1段階暗く | `active:bg-primary-800` 等 |
| Focus | フォーカスリング表示 | `focus:ring-2 focus:ring-primary-500/50` |
| Disabled | 透明度50%、操作不可 | `opacity-50 cursor-not-allowed` |
| Loading | スピナー表示、操作不可 | ラベルを保持しつつスピナー追加 |

### トグルボタン（フォロー等）
- 初期状態は必ずNormal（Neutral）
- 操作後にLightedに変化
- 色の変化だけでなく、テキストとアイコンも変更する

### 配置の組み合わせルール
- 同じスタイルのボタンを並べない（Neutralのみ例外）
- 階層が高いボタンを上/左に配置
- Bottom Button（モバイル固定）とLarge Buttonは共存不可

---

## 5. アクセシビリティ

### 必須事項
- タップ/クリック領域は最低 44×44px を確保する
- テキスト・画像テキストのコントラスト比 4.5:1 以上
- アイコンのコントラスト比 3:1 以上
- テキストの200%拡大時にクリッピングしない（3行以内に収まること）
- アイコンボタンには必ず `aria-label` を付与する
- Disabledボタンはキーボードからも操作不可にする
- 各状態はARIA属性で機械的に読み取り可能にする（`aria-disabled`, `aria-pressed` 等）
- フォーカスインジケーターを視覚的に明示する

### 禁止事項

> `prohibited.md`「ボタン」「カラー」参照

---

## 6. Tailwind サンプル

> primary カラーの具体値は `theme.md` を参照。

### Contained（Primary CTA）

```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 active:bg-primary-800 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
  保存する
</button>
```

### Outlined（Secondary）

```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-primary-600 bg-white border border-primary-600 rounded-lg hover:bg-primary-50 active:bg-primary-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
  フォロー
</button>
```

### Neutral

```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-gray-50 active:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
  戻る
</button>
```

### Danger

```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-white bg-red-500 rounded-lg hover:bg-red-600 active:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-colors">
  削除する
</button>
```

### Subtle

```html
<button class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-body rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
  キャンセル
</button>
```

### アイコンボタン

```html
<button aria-label="閉じる" class="inline-flex items-center justify-center w-10 h-10 text-body rounded-lg hover:bg-gray-100 active:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
  </svg>
</button>
```

### Disabled

```html
<button disabled class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-white bg-primary-600 rounded-lg opacity-50 cursor-not-allowed">
  保存する
</button>
```

### Loading

CSS の `.inline-spinner` クラスを使用する。`currentColor` で親要素のテキスト色を継承するため、Primary / Outlined 両方で自動的に適切な色になる。CSS 定義は `patterns/interaction-states.md` を参照。

```html
<button disabled class="inline-flex items-center justify-center gap-2 px-4 py-2 text-[1rem] font-medium text-white bg-primary-600 rounded-lg opacity-75 cursor-not-allowed">
  <div class="inline-spinner"></div>
  処理中...
</button>
```

### ボタンの組み合わせ（ダイアログフッター）

```html
<div class="flex justify-end gap-3">
  <!-- Subtle → Contained の順（右に重要度が高いボタン） -->
  <button class="px-4 py-2 text-[1rem] font-medium text-body rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
    キャンセル
  </button>
  <button class="px-4 py-2 text-[1rem] font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-colors">
    確認する
  </button>
</div>
```
