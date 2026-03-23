# Icon

> デュアルソース・アイコンシステム。Charcoal Icons（プライマリ）+ Lucide Icons（セカンダリ補完）。
> `assets/icons/` 配下のSVGファイルを参照すること。

---

## ソース

### プライマリ: Charcoal Icons 2.0

- **Charcoal Icons 2.0**（pixiv design system）— 207個
- Format: fill ベース（`fill="currentColor"`）、24px 統一
- Figma: [Charcoal Icons 2.0](https://www.figma.com/community/file/1415608153880597802)
- npm: `@charcoal-ui/icons` v5（Web Component が必要な場合）

### セカンダリ: Lucide Icons（補完用）

- **Lucide Icons** — Charcoal に存在しないアイコンのみ使用（15個）
- Format: stroke ベース（`stroke="currentColor"`, `fill="none"`）、24px viewBox
- 公式: [lucide.dev](https://lucide.dev)
- 配置: `assets/icons/lucide/{name}.svg`（kebab-case）

---

## デュアルソースポリシー

1. **Charcoal 優先**: 同じ概念のアイコンが Charcoal にある場合は必ず Charcoal を使う
2. **Lucide 補完**: Charcoal に明確に存在しないアイコンのみ Lucide を使用
3. **混在可**: 1つのページ内で両ソースのアイコンを混在させてよい
4. **属性の違い**: Charcoal は `fill="currentColor"`、Lucide は `stroke="currentColor" fill="none"`

### ソース選択フロー

```
アイコンが必要
  ├── Charcoal に存在する？
  │   ├── YES → Charcoal を使う（fill ベース）
  │   └── NO → Lucide 補完リストに存在する？
  │       ├── YES → Lucide を使う（stroke ベース）
  │       └── NO → Lucide 公式で探し、assets/icons/lucide/ に追加
  └── ※ Charcoal の名前が直感的でない場合は下記マッピング表を参照
```

---

## Charcoal 名前マッピング

Charcoal は pixiv 社が公開しているアイコンセットで、独自の命名規則を持つ。以下は一般的な概念との対応表。

| 一般的な概念 | Charcoal アイコン名 | 備考 |
|------------|-------------------|------|
| ChevronDown | `PullDown` | 太めのV字 |
| ChevronUp | `PullUp` | 太めのV字 |
| ChevronLeft | `Prev` / `Back` | Back は viewBox 16x16（注意） |
| ChevronRight | `Next` | |
| Email/Mail | `Message` | 封筒アイコン |
| Lock | `LockLock` | 南京錠 |
| Unlock | `LockUnlock` | |
| Payment | `Invoice` | 通貨記号付き書類 |
| Calendar | `Calendar` / `Events` | |
| Notification/Bell | `Notification` | |
| Eye/Show | `Show` / `ShowOutline` | |
| Eye-off/Hide | `Hide` | |
| Edit(pencil) | `Pencil` | 24x24。`Edit` は viewBox 32x32 なので注意 |

---

## 実装ルール

- 生の `<svg>` タグをHTMLに直接インライン展開するか、Iconコンポーネント経由で呼び出す
- サイズはTailwindクラスで制御する（後述のサイズ表を参照）
- 色は `text-body` 等のテキストカラーを継承させる
  - Charcoal: `fill="currentColor"` を前提
  - Lucide: `stroke="currentColor"` を前提（`fill="none"`）
- アイコン単体では情報を伝達しない。必ずテキストラベルまたは `aria-label` を併用する

---

## 命名規則

- **Charcoal**: PascalCase（例: `ArrowDown`, `OpenInNew`）→ `assets/icons/{Name}.svg`
- **Lucide**: kebab-case（例: `bar-chart-2`, `trending-up`）→ `assets/icons/lucide/{name}.svg`

```
assets/icons/
├── Add.svg
├── ArrowDown.svg
├── Close.svg
├── Home.svg
├── ...
└── ZoomIn.svg          (Charcoal 207個・24px統一)
└── lucide/
    ├── activity.svg
    ├── bar-chart-2.svg
    ├── clock.svg
    ├── ...
    └── trending-up.svg  (Lucide 補完 15個・24px統一)
```

---

## 表示サイズとTailwindクラス

SVGは全て24px基準。表示サイズはTailwindクラスで制御する。

| 表示サイズ | Tailwindクラス | 主な用途 | テキストペアリング |
|-----------|---------------|---------|-----------------|
| 16px | `w-4 h-4` | テーブル行アクション、バッジ内、テキスト横の補助 | text-xs（13px）〜 text-sm（15px） |
| 20px | `w-5 h-5` | ボタン、ナビゲーション、フォーム（★ 標準） | text-sm（15px）〜 text-base（18px） |
| 24px | `w-6 h-6` | 大きめのアクション、ページヘッダー | text-base（18px）〜 text-xl（22px） |
| 32px | `w-8 h-8` | タブバー、空状態イラスト、オンボーディング | text-xl（22px）以上 |

- アイコンとテキストの間隔: `gap-1`（4px）〜 `gap-2`（8px）
- アイコンボタンの最小タップ領域: `w-10 h-10`（40px）
- **この4段階以外のサイズ（`w-3 h-3` や `w-7 h-7` 等）は使用禁止**。CSSの `transform: scale()` によるサイズ変更も禁止
- 同一行・同一グループ内ではアイコンサイズを統一する

---

## 配置ルール（Leading / Trailing）

> 出典: Material Design 3 / Carbon / Polaris の共通コンセンサス。
> アイコンのDOM順 = 視覚的な表示順。`flex-row-reverse` でのDOM順反転は禁止。

### 基本原則: アイコンはテキストの **前（Leading）** に配置する

```jsx
// ✅ 正しい: アイコン → テキスト（Leading）
<div className="flex items-center gap-2">
  <TrendingUpIcon className="w-5 h-5" />
  <span>売上推移</span>
</div>

// ❌ 間違い: テキスト → アイコン
<div className="flex items-center gap-2">
  <span>売上推移</span>
  <TrendingUpIcon className="w-5 h-5" />
</div>
```

### 配置パターン一覧

| 位置 | 用途 | 例 |
|------|------|-----|
| **Leading（テキストの前）** | ほとんどのケース。ボタン、ナビ、リスト項目、カードヘッダー、見出し | `[🏠] ダッシュボード` |
| **Trailing（テキストの後）** | 展開/折りたたみ（シェブロン）、外部リンク、ソート方向 | `メニュー [▼]`、`詳細 [↗]` |
| **アイコンのみ** | 普遍的に理解される操作のみ（閉じる、検索、ハンバーガーメニュー） | `[✕]`、`[🔍]` |

### Trailing が許可されるアイコン（限定リスト）

| アイコン | 用途 |
|---------|------|
| `PullDown` / `Down` | ドロップダウン/セレクトの展開 |
| `Expand` / `Collapse` | アコーディオンの開閉 |
| `Next` | 次へ、詳細遷移（リスト項目の右端） |
| `OpenInNew` | 外部リンク |
| `ArrowUp` / `ArrowDown` | テーブルのソート方向 |

> 上記以外のアイコンを Trailing に配置する場合は設計判断を要する。

### カードヘッダーの配置

```jsx
// ✅ 正しい: アイコン → タイトル → （右端にアクション）
<CardHeader className="flex-row items-center justify-between space-y-0">
  <div className="flex items-center gap-2">
    <TrendingUpIcon className="w-5 h-5 text-muted-foreground" />
    <CardTitle>売上推移</CardTitle>
  </div>
  <Button variant="ghost" size="icon">
    <MoreHorizontalIcon className="w-4 h-4" />
  </Button>
</CardHeader>
```

### ナビゲーション項目の配置

```jsx
// ✅ 正しい: アイコン → ラベル
<a className="flex items-center gap-3 px-4 py-2.5">
  <HomeIcon className="w-5 h-5" />
  ダッシュボード
</a>
```

---

## 状態によるスタイル変化

> 出典: Material Design 3（Filled = active）、Fluent 2（Regular/Filled 切替）のコンセンサスを melta UI に適応。

| 状態 | スタイル変化 | 例 |
|------|------------|-----|
| Default | `text-muted-foreground` | ナビの非選択項目 |
| Hover | 親要素のホバーに追従（アイコン単体のホバー色変更は不要） | — |
| Active / Selected | `text-primary` に変更 | ナビの選択中項目、アクティブタブ |
| Disabled | `text-muted-foreground opacity-50` | 無効化されたボタン内 |
| Error | `text-destructive` | エラー状態のフォーム |

- melta UI は **Filled/Outlined の切替で状態を表現しない**（Charcoal は fill ベース固定のため）
- 状態変化は **色の変更のみ** で表現する
- 色だけでは状態を伝達しきれない場合は、テキストラベル・背景色・ボーダーを併用する

---

## カラールール

| 用途 | Tailwindクラス |
|------|---------------|
| 標準（ナビ、補助） | `text-body` |
| 無効/プレースホルダー | `text-slate-400` |
| アクティブ/選択中 | `text-primary-500` |
| 成功 | `text-emerald-600` |
| 警告 | `text-amber-600` |
| エラー/危険 | `text-red-500` |
| 白背景上のアクセント | `text-primary-500` |
| 色付き背景上 | `text-white` |

> コントラスト比 3:1 以上を担保すること（WCAG AA — UI要素基準）。

---

## 代表的なアイコン一覧（クイックリファレンス）

AIはUI生成時、用途に応じて以下のアイコン名を使用すること。

### ナビゲーション

| アイコン名 | 用途 |
|-----------|------|
| `Home` | ホーム画面 |
| `Menu` | ハンバーガーメニュー |
| `Close` | 閉じる、モーダル閉じ |
| `Back` | 戻る |
| `Next` | 次へ、進む |
| `Search` | 検索 |
| `ArrowDown` / `ArrowUp` | ソート矢印 |
| `Down` | ドロップダウン展開 |
| `Expand` / `Collapse` | アコーディオン開閉 |
| `OpenInNew` | 外部リンク |

### ユーザー

| アイコン名 | 用途 |
|-----------|------|
| `User` | ユーザーアバター/プロフィール |
| `Groups` | チーム、複数ユーザー |
| `AddPeople` | メンバー招待 |
| `Login` / `Logout` | 認証 |

### アクション

| アイコン名 | 用途 |
|-----------|------|
| `Add` | 新規作成、追加 |
| `Delete` / `Trash` | 削除 |
| `Copy` | コピー |
| `Duplicate` | 複製 |
| `Pencil` | 編集 |
| `Check` | 完了、選択済み |
| `Link` | リンク |
| `Filter` | フィルター |
| `DownloadAlt` | ダウンロード |
| `Upload` | アップロード |
| `MultiSelect` | 複数選択 |

### ステータス / フィードバック

| アイコン名 | 用途 |
|-----------|------|
| `Error` | エラー（丸型） |
| `ErrorOctagon` | 重大エラー |
| `Info` | 情報、ヒント |
| `Alart` | 警告（※ Charcoal の綴り） |
| `Notification` / `NotificationOff` | 通知 |

### オブジェクト

| アイコン名 | 用途 |
|-----------|------|
| `File` | ファイル |
| `Image` / `Images` | 画像 |
| `Calendar` | 日付 |
| `Book` | ドキュメント |
| `Message` | メッセージ、チャット |
| `Cart` | カート、購入 |
| `Gift` | ギフト、キャンペーン |
| `Archive` | アーカイブ |
| `Camera` | 写真撮影 |

### 表示制御

| アイコン名 | 用途 |
|-----------|------|
| `Hide` | 非表示、パスワード隠す |
| `List` | リスト表示 |
| `Collection` | コレクション表示 |
| `LockLock` / `LockUnlock` | ロック状態 |

> **AIへの指示**: 上記リストにないアイコンが必要な場合は、まず Charcoal の命名慣例（PascalCase）で `assets/icons/{Name}.svg` を探すこと。Charcoal に存在しない SaaS 系アイコンは下記 Lucide 補完リストを参照。

---

## Lucide 補完アイコン一覧（15個）

Charcoal に存在しない SaaS / ダッシュボード向けアイコン。`assets/icons/lucide/` に配置。

| カテゴリ | ファイル名 | 用途 |
|---------|----------|------|
| Analytics | `bar-chart-2.svg` | 売上・KPI グラフ |
| Analytics | `trending-up.svg` | 成長指標 |
| Analytics | `trending-down.svg` | 減少指標 |
| Analytics | `activity.svg` | アクティビティ/パルス |
| Time | `clock.svg` | 時刻・スケジュール |
| Security | `shield.svg` | セキュリティ設定 |
| Security | `key.svg` | 認証・API キー |
| Infrastructure | `cloud.svg` | クラウド・SaaS 機能 |
| Infrastructure | `database.svg` | データベース管理 |
| Infrastructure | `server.svg` | サーバー状態 |
| Files | `folder.svg` | ファイル管理 |
| Payment | `credit-card.svg` | 決済情報 |
| Device | `monitor.svg` | デスクトップ表示 |
| International | `globe.svg` | 多言語・リージョン |
| Communication | `phone.svg` | 電話/サポート |

### Lucide SVG 属性ルール

```html
<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <!-- Lucide のパスデータ -->
</svg>
```

> Charcoal（fill ベース）と Lucide（stroke ベース）で色の指定方法が異なるが、どちらも `text-body` 等の Tailwind カラークラスで `currentColor` を通じて色を制御できる。

---

## HTMLサンプル

### ボタン内アイコン

```html
<button class="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-white bg-primary-500 rounded-lg hover:bg-primary-700">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- assets/icons/Add.svg の中身 -->
  </svg>
  追加する
</button>
```

### アイコンのみボタン

```html
<button aria-label="閉じる" class="inline-flex items-center justify-center w-10 h-10 text-body rounded-lg hover:bg-gray-100 focus:ring-2 focus:ring-primary-500/50">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- assets/icons/Close.svg の中身 -->
  </svg>
</button>
```

### ナビゲーション内アイコン

```html
<a href="#" class="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-body hover:bg-gray-50 rounded-lg">
  <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <!-- assets/icons/Home.svg の中身 -->
  </svg>
  ダッシュボード
</a>
```

---

### Lucide アイコンの使用例

```html
<!-- Lucide: stroke ベース -->
<button class="inline-flex items-center gap-2 h-10 px-4 text-sm font-medium text-body bg-white border border-slate-200 rounded-lg hover:bg-gray-50">
  <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <!-- assets/icons/lucide/bar-chart-2.svg の中身 -->
    <line x1="18" x2="18" y1="20" y2="10"/>
    <line x1="12" x2="12" y1="20" y2="4"/>
    <line x1="6" x2="6" y1="20" y2="14"/>
  </svg>
  レポートを表示
</button>
```

---

## アクセシビリティ詳細

> 出典: Lucide 公式ガイド、Polaris、Atlassian のコンセンサス。

| シナリオ | ルール | 実装 |
|---------|--------|------|
| アイコン + テキストラベル | SVG に `aria-hidden="true"` を付与。テキストがラベルの役割を果たす | `<svg aria-hidden="true">` |
| アイコンのみボタン | `aria-label` は **ボタン要素** に付与。SVG には `aria-hidden="true"` | `<Button aria-label="閉じる"><svg aria-hidden="true">` |
| 装飾的アイコン | `aria-hidden="true"` のみ。ラベル不要 | `<svg aria-hidden="true">` |
| ステータス表示アイコン | `aria-label` または隣接する `sr-only` テキストで状態を説明 | `<svg aria-label="エラー">` or `<span className="sr-only">エラー</span>` |

- `aria-label` を SVG とラッパー要素の **両方** に付けない（二重読み上げになる）
- テキストラベルが隣接している場合、SVG に `aria-label` を付けない

---

## タッチターゲット

| コンテキスト | 最小サイズ | Tailwind |
|------------|----------|---------|
| デスクトップのアイコンボタン | 36px | `w-9 h-9` |
| モバイル / タッチのアイコンボタン | 44px | `w-11 h-11` |
| より大きなクリック領域内のアイコン | 制限なし（親が担保） | — |

- アイコン自体は 20px でもよいが、**インタラクティブなラッパー**が最小サイズを満たすこと

---

## 禁止パターン

| 禁止 | 理由 | 代替 |
|------|------|------|
| `aria-label` なしのアイコンボタン | 操作内容が不明 | `aria-label` をボタン要素に付与 |
| アイコンのみでの情報伝達 | 色覚・認知多様性への非対応 | テキストラベルを併用 |
| `w-3 h-3` 以下のアイコン | 視認性不足 | 最小 `w-4 h-4`（16px） |
| 定義外サイズ（`w-7 h-7` 等） | サイズ体系の崩壊 | 4段階（16/20/24/32px）のみ使用 |
| CSS `transform: scale()` でのサイズ変更 | レンダリングがぼやける | Tailwind の `w-*/h-*` で制御 |
| 色ハードコード（`fill="#333"`） | テーマ変更に追従しない | `fill="currentColor"` |
| Charcoal に存在するアイコンの Lucide 使用 | ソース統一 | Charcoal を優先使用 |
| テキストの **後** にアイコン配置（Trailing 許可リスト以外） | 視線動線が乱れる。ダッシュボード等でアイコンがタイトルの反対側に出る | アイコンはテキストの前（Leading）に配置 |
| `flex-row-reverse` でアイコン位置を制御 | DOM順と視覚順の不一致。スクリーンリーダーの読み上げ順序が逆転する | DOM順をそのまま視覚順にする |
| 同一行/グループ内でのサイズ混在 | 視覚的一貫性が崩れる | グループ内ではサイズを統一 |
| `viewBox` 属性のない SVG | レスポンシブサイジングが壊れる | `viewBox="0 0 24 24"` を必ず付与 |
