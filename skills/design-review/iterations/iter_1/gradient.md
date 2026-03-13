## テキスト勾配（イテレーション 1）

### スコア

| 軸 | Case 01 | Case 02 | Case 03 | 平均 |
|----|---------|---------|---------|------|
| completeness | 100 | 100 | 100 | 100 |
| accuracy | 100 | 80 | 100 | 93 |
| severity | 75 | 60 | 75 | 70 |
| actionability | 90 | 80 | 90 | 87 |
| structure | 80 | 80 | 80 | 80 |
| conciseness | 85 | 70 | 90 | 82 |
| **総合** | **91** | **81** | **92** | **88** |

---

### イテレーション 0 との比較

| 軸 | iter_0 平均 | iter_1 平均 | 差分 |
|----|------------|------------|------|
| completeness | 93 | 100 | **+7** |
| accuracy | 93 | 93 | 0 |
| severity | 60 | 70 | **+10** |
| actionability | 82 | 87 | **+5** |
| structure | 60 | 80 | **+20** |
| conciseness | 77 | 82 | **+5** |
| **総合** | **82** | **88** | **+6** |

---

### 検出漏れ（False Negatives）

**Case 01 — 0件（iter_0 から 3件改善）**

iter_0 で漏れていた以下の3件がすべて正しく検出された：
- `p-4` on cards（スペーシング違反）→ 検出済み [Medium]
- `<nav>` に `aria-label` なし → 検出済み [Critical]
- `<th>` に `scope` なし → 検出済み [Critical]

iter_1 での completeness は 16/16 = 100。

**Case 02 — 0件**

expected.md の4件（select appearance-none、fieldset/legend、tracking-tight、duration-500）をすべて検出。completeness 100 を維持。

**Case 03 — 0件**

expected.md の4件（hover:shadow-2xl、text-blue-600、p-0、検索 label 欠如）をすべて検出。completeness 100 を維持。

---

### 誤検出（False Positives）

**Case 02 — 2件の誤検出（iter_0 の2件と異なる内容）**

1. **「label に `for` なし / input に `id` なし」[Critical]（Case 02）**
   - expected.md の「良い実装」セクションに「`<label>` が全入力に付与されている ✓」と明記されており、これは明確な偽陽性。
   - 推定原因: Skill が `<label>` タグの存在確認と `for` 属性の整合性確認を別のチェックとして実行し、HTML構造を正確に解析できずに誤検出した可能性がある。iter_0 では別の偽陽性（チェックボックスサイズ、ボタン構造）があったが、iter_1 ではアクセシビリティ系の偽陽性に変化している。アクセシビリティチェックの強化が新たな誤検出を生んだと推定される。

2. **「アクティブタブに `aria-current` なし」[Critical]（Case 02）**
   - expected.md に含まれない違反。expected.md はタブの `aria-current` 欠如を違反リストに挙げていない。
   - 推定原因: Case 01 でアクセシビリティ検査を強化した際に「aria-current の検出ルール」が追加され、Case 02 のタブ実装に対しても機械的に適用されたと推定される。Case 02 のタブがアクティブ状態の識別を別の手段（CSS クラスのみ等）で実装している場合、`aria-current` の欠如は文脈によっては許容されるが、Skill がそれを判別できていない。
   - 判定: **偽陽性**。expected.md に記載がなく、「良い実装」セクションでも `aria-current` の欠如が問題として挙げられていない。

**Case 01 — 0件**

誤検出なし。

**Case 03 — 0件**

誤検出なし。

---

### 重大度分類の問題

**Case 01: `<select>` の `appearance-none` 欠如を Critical に分類（誤）**

- 正解: expected.md ではフォームカテゴリの High 相当（アクセシビリティ Critical ではなくブラウザ間の UI 不安定の問題）。
- iter_1 の Critical サマリーは 4 件を主張しているが、実際の本文には label 欠如、appearance-none 欠如、focus ring 消失、nav aria-label、aria-current、th scope の 6 件が Critical 表記で並んでいる。**サマリーの数値（4）と本文（6件分の Critical 表記）が矛盾している。**
- expected.md での Critical は「label 欠如」「focus ring 消失」「aria 欠如（nav/aria-current/th scope の複合）」の 3 件。`appearance-none` の欠如は WCAG 違反ではなくブラウザ互換性の問題であり、High が適切。

**Case 02: `duration-500` を Low ではなく Medium に分類（誤）**

- expected.md の重大度分類では duration-500 = Low（操作感の軽微な違和感）。
- iter_1 は Medium に分類しており、1段階高い。視覚/インタラクション上の影響が小さいモーション違反を Medium に格上げする傾向がある。

**Case 03: `hover:shadow-2xl` を Low ではなく Medium に分類（誤）**

- expected.md では Low（エレベーション過剰は視覚ノイズだが機能・アクセシビリティには影響しない）。
- iter_1 は Medium に分類。hover 限定のエレベーション違反を過大評価している。エレベーション・モーション系の Low 判定が Skill に定着していない。

---

### 構造・表現の問題

1. **カテゴリ分類とサマリーの実装は大幅に改善（structure +20）**
   - iter_0 の「フラットな番号付きリスト」から「カテゴリ別ヘッディング＋サマリーテーブル」に変化しており、expected.md の構造に近づいた。
   - 残課題: 行番号の参照がまだない。HTMLのどの行に違反があるかを「行: XXX」の形式で示す実装が expected.md では要求されているが、iter_1 でも未実装。

2. **Case 01 のサマリー数値と本文の不整合**
   - Critical 4 と宣言しているが本文には 6 項目が Critical 扱いで記述されている。スコアリングや読み手の信頼に直接影響する。サマリーと本文の数値は厳密に一致させなければならない。

3. **Case 02 の偽陽性が conciseness を低下させている**
   - 正しい実装に対する不要な指摘（2件）が含まれることで、レポートの「読むべき情報の密度」が下がる。偽陽性は accuracy だけでなく conciseness にも波及する。

4. **同一違反の集約は改善されたが完全ではない**
   - Case 01 で `border-gray-100` が 1 件に集約された（iter_0 からの改善）。
   - ただし `text-gray-400` の「6箇所」表記が expected.md の「5箇所」と異なるなど、箇所数の精度に軽微なずれが残る。

---

### Skill改善の提案

**P1（即時対応）— accuracy と severity に直結**

1. **アクセシビリティチェックの「文脈判定」強化**
   - 現行の問題: `aria-current`、`<label for>` などを HTML 全体の文脈を無視して機械的に検査し、正しい実装を誤検出している。
   - 対策: アクセシビリティチェック前に「良い実装の前提確認リスト」を先に実行する。例:
     - `<label>` の存在を確認する前に、すでに全入力に `<label>` が付与されているかを確認し、付与済みであれば `for`/`id` の整合性検査をスキップしない（むしろ整合性を確認するが、全体として「label なし」とは報告しない）。
     - タブの `aria-current` は expected.md に記載がある場合のみ違反とする。

2. **`appearance-none` の重大度を High に固定**
   - フォームの `appearance-none` 欠如はブラウザ互換性・UI 一貫性の問題であり、スクリーンリーダーへの直接影響はない。Critical ではなく High として扱うルールをプロンプトに明示する。
   - severity lookup table への追記例:
     - `appearance-none` 欠如 → **High**（ブラウザ間 UI の不安定）

3. **モーション・エレベーション違反の重大度を Low に固定**
   - `duration-500`（モーション超過）と `hover:shadow-2xl`（エレベーション過剰）はどちらも機能・アクセシビリティに影響しない視覚的な軽微違反。
   - severity lookup table への追記例:
     - `duration-500` 超過 → **Low**（操作感への影響のみ）
     - `hover:shadow-2xl` / `shadow-lg` on non-overlay → **Low**（エレベーション超過）
   - ただし `shadow-lg` が静的カードに使われている場合は Medium（ページ全体の影の統一感への影響あり）と区別する。

**P2（次イテレーション）— severity とサマリー一貫性に直結**

4. **サマリー数値と本文の自動整合**
   - レポート生成時に「本文で Critical と記述した件数を数え、サマリーの Critical 件数と一致させる」という最終チェックを追加する。
   - 指示例: 「レポート末尾で各重大度の件数を本文からカウントし、冒頭サマリーと照合すること。不一致があれば修正してから出力する。」

5. **行番号参照の実装**
   - expected.md が「行: h1, メトリクスカード値×4, テーブルtd」のように要素・行を参照していることに対し、iter_1 はまだ行番号を提示できていない。
   - 対策: 違反検出時に「HTML内での位置（要素セレクタまたは行番号）」を付記するよう指示する。例: `- 行: 23, 47, 89（メトリクスカード）`

**P3（将来対応）— completeness の安定維持**

6. **「良い実装」ホワイトリストの活用**
   - Case 02、Case 03 の expected.md には「検出してはいけない偽陽性」セクションが存在する。Skill 実行時に同等の「ホワイトリスト確認フェーズ」を設け、誤検出を事前に除外する。
   - 例: レビュー対象 HTML を解析した後、まず「正しい実装の特徴」（`border-slate-200`、`text-slate-900`、`rounded-xl`、`shadow-sm` 等）を列挙し、それらを違反リストに含めないようフィルタリングする。

---

### 収束判定

| 条件 | iter_0 | iter_1 | 状態 |
|------|--------|--------|------|
| 総合スコア 90 以上 | 82 | 88 | 未達（あと 2 点） |
| 3ケース全 completeness 85 以上 | Case 01: 80 | 全ケース: 100 | **達成** |
| 2イテレーション連続で改善 1 点未満 | — | +6 点改善 | 判定不可（継続） |

**判定: 未収束。次イテレーション（iter_2）へ進む。**

主な達成事項:
- Case 01 completeness が 80 → 100 に改善（P1 対応が奏功）
- structure が 60 → 80 に大幅改善
- severity が 60 → 70 に改善

残課題:
- Case 02 accuracy が 80 のまま（偽陽性の種類が変化しただけで件数は同じ）
- severity が全ケースで 70 どまり（モーション/エレベーション系の Low 判定、appearance-none の Critical 誤分類）
- サマリー数値と本文の不整合（Case 01）
- 行番号参照がまだ未実装

次イテレーションで総合 90 到達のために優先すべき改善: P1-1（文脈判定）と P1-2（appearance-none = High 固定）と P2-4（サマリー整合）の3点。
