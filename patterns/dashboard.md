# Dashboard Patterns

> ダッシュボード画面の情報設計パターン。KPI カード、メトリクス表示、ステータス伝達のガイドライン。
> 出典: Material Design 3 / Carbon (IBM) / Polaris (Shopify) / Lightning (Salesforce) / Atlassian / Ant Design / Primer (GitHub) の業界コンセンサス + melta UI 設計原則。

---

## 情報設計の原則

### 1. サマリーファースト

ダッシュボードの上部には要約（KPI カード）、下部に詳細（テーブル・チャート）を配置する。
ユーザーは概要を掴んでから詳細に潜る（Progressive Disclosure）。

> melta 原則 **Effortless**: 「考えずにわかる」状態を設計する。

### 2. 左上が最重要

KPI カードは**優先度順**に左上から配置する。最も重要な指標が左上、最も補足的な指標が右端。

> 出典: Ant Design / SLDS / PatternFly の共通ガイドライン。

### 3. 1カード1トピック

1枚のカードは1つの指標のみを扱う。密接に関連するデータ（例: 売上金額と件数）は同一カード内で分割線で区切ってよい。

> 出典: Ant Design「一卡一题」/ Material Design 3「Cards represent a single subject」

### 4. モジュール数の制限

ダッシュボードのカード/ウィジェット総数は **5〜9個** に制限する。それ以上は情報過多。

### 5. 時間軸の同期

同一ダッシュボード内のカードは**同じ時間範囲**を共有する。カードごとに異なる期間を表示しない。

> 出典: SLDS「Each of the tiles in the dashboard must be synchronized by time」

---

## KPI カード

### 必須要素

| 要素 | 説明 | 配置 |
|------|------|------|
| **アイコン** | 指標のカテゴリを示す。テキストの**前（Leading）**に配置 | 左上 |
| **ラベル** | 指標名（例: 要対応、遅延、進行中） | アイコンの右 |
| **期間** | データの時間スコープ（例: 今週、今月、過去30日） | 右上 |
| **数値** | 現在の値。カード内で**最も大きく太い**テキスト | 中央〜左寄せ |
| **単位** | 数値の単位（件、円、%）。数値の直近に配置 | 数値の右 |

### 推奨要素（任意）

| 要素 | 説明 | 配置 |
|------|------|------|
| **トレンド** | 前期比の変化方向と変化量（▲ 4 前週比） | 数値の下 |
| **スパークライン** | ミニチャートでトレンドを視覚化 | カード下部 |

### セマンティックカラーの適用

KPI カードは指標の性質に応じてセマンティックカラーを使い分ける。全カードが同じ色（Primary 青）になってはならない。

| 指標の性質 | アイコン色 | ボーダー | 例 |
|-----------|----------|---------|-----|
| 要注意/要対応 | `text-amber-600` | `border-amber-200` | 要対応、未処理 |
| 危険/遅延 | `text-destructive` | `border-red-200` | 遅延、エラー |
| 進行中/情報 | `text-primary` | デフォルト | 進行中、アクティブ |
| 完了/成功 | `text-emerald-600` | `border-emerald-200` | 完了、達成 |

> **色だけで状態を伝えない**。アイコン形状 + 色 + テキストの3点で伝達する（WCAG / 全7システム共通）。

### トレンド表示

トレンドの方向が「良い」か「悪い」かは**指標によって異なる**。システムが仮定してはならない。

| 例 | 上昇 = | 下降 = |
|----|--------|--------|
| 売上 | 良い（緑） | 悪い（赤） |
| エラー数 | 悪い（赤） | 良い（緑） |
| 応答時間 | 悪い（赤） | 良い（緑） |

> 出典: SLDS「the designer must determine whether the end-user considers an increase good or a decrease good」

### 数値フォーマット

| ルール | 例 |
|--------|-----|
| 千区切りを使用 | `2,847` |
| 大きな数値は略記（k / M / B） | `$1.2M`、`14.5k` |
| 略記時は最大3桁 + 小数1桁 | `1.2k` ✅ / `1234k` ❌ |
| 単位は数値の直近に配置 | `23 件` ✅ / `件: 23` ❌ |
| 比較基準を明示 | `▲ 4 前週比` ✅ / `+4` ❌ |

> 出典: Polaris の数値略記ルール + SLDS の単位必須ルール。

### アクションへの接続

KPI カードはクリッカブルにし、詳細ページへドリルダウンできるようにする。

| アフォーダンス | 実装 |
|--------------|------|
| カード全体がクリッカブル | `cursor-pointer` + ホバー時 `shadow-md` |
| ラベルがリンク | ラベルテキストに `text-primary hover:underline` |

> 出典: Polaris「Use href attributes on clickable metrics」/ SLDS「Label functions as detail view entry point」

---

## KPI カードの構成

### カード構造

```
┌─────────────────────────┐
│ [⚠] 要対応        今週  │  ← アイコン(Leading/セマンティック色) + ラベル + 期間
│                         │
│ 23 件                   │  ← 数値（最大・最太）+ 単位
│ ▲ 4 前週比              │  ← トレンド（セマンティックカラー + 比較基準）
└─────────────────────────┘
  border-amber-200           ← ステータスに応じたボーダー色
  カード全体がクリッカブル
```

### JSX サンプル

```jsx
<Card className="cursor-pointer border-amber-200 hover:shadow-md transition-shadow">
  <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
    <div className="flex items-center gap-2">
      <AlertTriangleIcon className="w-5 h-5 text-amber-600" />
      <CardDescription className="text-sm font-medium text-foreground">
        要対応
      </CardDescription>
    </div>
    <span className="text-xs text-muted-foreground">今週</span>
  </CardHeader>
  <CardContent>
    <div className="text-3xl font-bold text-foreground">23 件</div>
    <p className="mt-1 flex items-center gap-1 text-sm text-amber-600">
      <ArrowUpIcon className="w-4 h-4" />
      4 前週比
    </p>
  </CardContent>
</Card>
```

### 4枚並びの例

```jsx
<div className="grid grid-cols-4 gap-4">
  {/* 要対応（Warning） */}
  <Card className="cursor-pointer border-amber-200 hover:shadow-md transition-shadow">
    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        <AlertTriangleIcon className="w-5 h-5 text-amber-600" />
        <CardDescription className="text-sm font-medium text-foreground">要対応</CardDescription>
      </div>
      <span className="text-xs text-muted-foreground">今週</span>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">23 件</div>
      <p className="mt-1 flex items-center gap-1 text-sm text-amber-600">
        <ArrowUpIcon className="w-4 h-4" />
        4 前週比
      </p>
    </CardContent>
  </Card>

  {/* 遅延（Destructive） */}
  <Card className="cursor-pointer border-red-200 hover:shadow-md transition-shadow">
    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        <ClockIcon className="w-5 h-5 text-destructive" />
        <CardDescription className="text-sm font-medium text-foreground">遅延</CardDescription>
      </div>
      <span className="text-xs text-muted-foreground">今週</span>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">5 件</div>
      <p className="mt-1 flex items-center gap-1 text-sm text-destructive">
        <ArrowUpIcon className="w-4 h-4" />
        5 前週比
      </p>
    </CardContent>
  </Card>

  {/* 進行中（Primary） */}
  <Card className="cursor-pointer hover:shadow-md transition-shadow">
    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        <LoaderIcon className="w-5 h-5 text-primary" />
        <CardDescription className="text-sm font-medium text-foreground">進行中</CardDescription>
      </div>
      <span className="text-xs text-muted-foreground">今週</span>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">142 件</div>
      <p className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
        <ArrowRightIcon className="w-4 h-4" />
        ±0 前週比
      </p>
    </CardContent>
  </Card>

  {/* 今月完了（Success） */}
  <Card className="cursor-pointer border-emerald-200 hover:shadow-md transition-shadow">
    <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
      <div className="flex items-center gap-2">
        <CheckCircleIcon className="w-5 h-5 text-emerald-600" />
        <CardDescription className="text-sm font-medium text-foreground">今月完了</CardDescription>
      </div>
      <span className="text-xs text-muted-foreground">今月</span>
    </CardHeader>
    <CardContent>
      <div className="text-3xl font-bold">89 件</div>
      <p className="mt-1 flex items-center gap-1 text-sm text-emerald-600">
        <ArrowUpIcon className="w-4 h-4" />
        12 前月比
      </p>
    </CardContent>
  </Card>
</div>
```

---

## ダッシュボードレイアウト

### 基本構成

```
┌──────────────────────────────────────────────┐
│ ページヘッダー（タイトル + フィルター/期間）      │
├──────┬──────┬──────┬──────────────────────────┤
│ KPI  │ KPI  │ KPI  │ KPI                      │  ← grid-cols-4
├──────┴──────┴──────┴──────────────────────────┤
│ メインチャート / テーブル                        │  ← 詳細コンテンツ
├─────────────────────┬────────────────────────┤
│ サブチャート          │ サブチャート              │  ← grid-cols-2
└─────────────────────┴────────────────────────┘
```

### レスポンシブ

| 画面幅 | KPI カード列数 | Tailwind |
|--------|-------------|---------|
| lg 以上 | 4列 | `grid-cols-4` |
| md | 2列 | `md:grid-cols-2` |
| sm 以下 | 1列（優先度順にスタック） | `grid-cols-1` |

- モバイルでは最重要カードが最上部に来るよう、DOM順を優先度順にする

---

## 禁止パターン

| 禁止 | 理由 | 代替 |
|------|------|------|
| 全 KPI カードに同じ色（Primary 青）を使用 | ステータスの重要度が区別できない | セマンティックカラーを指標の性質に応じて使い分ける |
| 期間スコープのない数値表示 | いつのデータか不明で判断できない | 「今週」「今月」「過去30日」等を必ず表示 |
| 比較基準のないトレンド表示（`+5` のみ） | 何との比較か不明 | 「▲ 4 前週比」のように基準を明示 |
| アイコンをラベルの後（Trailing）に配置 | 視線動線に反する。icons.md 配置ルール違反 | アイコンはラベルの前（Leading）に配置 |
| クリック不可の KPI カード | 詳細への導線がなく、数値を見ても行動に繋がらない | カード全体をクリッカブルにし、詳細ページへ遷移 |
| カードごとに異なる時間範囲 | 比較の前提が崩れる | ダッシュボード内は時間軸を同期 |
| 10個以上のカード/ウィジェット | 情報過多で概要把握ができない | 5〜9個に制限 |
| 上昇/下降を常に緑/赤で表示 | エラー数の上昇は「悪い」。指標により意味が逆転する | 指標の性質に応じて良し悪しを定義 |
