## テキスト勾配（イテレーション 2）

### スコア

| 軸 | Case 01 | Case 02 | Case 03 | 平均 |
|----|---------|---------|---------|------|
| completeness | 88 | 100 | 100 | 96 |
| accuracy | 90 | 100 | 100 | 97 |
| severity | 80 | 100 | 100 | 93 |
| actionability | 88 | 95 | 95 | 93 |
| structure | 88 | 90 | 90 | 89 |
| conciseness | 88 | 95 | 95 | 93 |
| **総合** | **87** | **98** | **98** | **94** |

---

### イテレーション推移

| 軸 | iter_0 平均 | iter_1 平均 | iter_2 平均 | iter_1→2 差分 |
|----|------------|------------|------------|--------------|
| completeness | 93 | 100 | 96 | -4 |
| accuracy | 93 | 93 | 97 | **+4** |
| severity | 60 | 70 | 93 | **+23** |
| actionability | 82 | 87 | 93 | **+6** |
| structure | 60 | 80 | 89 | **+9** |
| conciseness | 77 | 82 | 93 | **+11** |
| **総合** | **82** | **88** | **94** | **+6** |

---

### 検出漏れ（False Negatives）

**Case 01 — 2件の漏れ**

1. **`w-7 h-7` アイコンサイズ（サイドバー1箇所）**
   - expected.md サイドバー項目 #9「`w-7 h-7` アイコン（1箇所）— DS標準からの逸脱 → `w-5 h-5`」が未検出。
   - 推定原因: iter_2 はサイドバー関連の検査で `w-60`（非標準幅）と `rounded-xl`（ナビアイテム）は検出しているが、アイコンサイズの具体的なピクセル/クラス値チェックが欠落している。アイコンの `w-5 h-5` 基準がサイドバー内アイコンにも適用されることをSkillが認識していない可能性がある。

2. **`<nav>` に `aria-label` なし（アクセシビリティ）**
   - expected.md のアクセシビリティセクションに「`<nav>` に `aria-label` なし — 複数ナビがある場合に区別不可」と明記されているが、iter_2 は「1つしかnavがないため検出をスキップ」と判断し意図的に除外した。
   - 判定: **False Negative**。expected.md はこれを検出すべき違反として明記している。「navが1つだから不要」という判断はSkillによる独自解釈であり、expected.mdの規定に反する。DSルールとしては nav の数によらず `aria-label` は推奨される（将来の拡張でnaviが増えた場合の後方互換性）。
   - 推定原因: iter_1 での偽陽性抑制指示（文脈判定強化）が過剰に作用し、nav aria-label の検出基準を「複数nav存在時のみ」に誤って限定してしまった。

**Case 02 — 0件**

expected.md の4件（select#dept appearance-none、fieldset/legend、tracking-tight、duration-500）をすべて正しく検出。completeness 100 を維持。

**Case 03 — 0件**

expected.md の4件（hover:shadow-2xl、text-blue-600、p-0、検索 label 欠如）をすべて正しく検出。completeness 100 を維持。

---

### 誤検出（False Positives）

**Case 01 — 1件の誤検出**

1. **`text-xs` on card labels（タイポグラフィ違反として [Medium] 報告）**
   - expected.md のいずれのセクション（カラー/サイドバー/スペーシング/ボタン/ボーダー/フォーム/アクセシビリティ）にも `text-xs` の使用を違反として記載していない。
   - 推定原因: DSのタイポグラフィルール（`text-xs = 13px`はメタ情報・バッジ向けの正規スケール）を Skill が把握していないか、「カードラベルに text-xs は小さすぎる」という独自判断を加えた。`text-xs` はバッジや補助情報に使用される正規サイズであり、カードラベルに使われても文脈次第で許容される。
   - 影響: accuracy -10点（Case 01）。

**Case 02 — 0件**

iter_1 で問題だった「label for/id 不整合」と「アクティブタブのaria-current」の誤検出が、iter_2 では Step 4-2 フィルタリングにより正しくスキップされた。accuracy が 80 → 100 に改善。

**Case 03 — 0件**

誤検出なし。

---

### 重大度分類の詳細評価

**Case 01 — 主要な severity 問題（3件）**

1. **`shadow-lg` を Low に分類（誤: expected は Medium）**
   - expected.md の重大度表「Medium | 5 | スペーシング（rounded-none, shadow-lg, p-4）...」に明記されているが、iter_2 は Low に格下げした。
   - iter_1 の勾配で「shadow-lg が静的カードに使われている場合は Medium」と指示したにもかかわらず Low 化された。severity lookup tableへの反映が不完全だったか、hover限定でない静的 `shadow-lg` との区別がついていない。

2. **`w-60` サイドバー幅を Low に分類（要確認: expected は明示なし）**
   - expected.md の重大度表には `w-60` の重大度が明示されていない（サイドバー4件のうち bg-slate-800 のみ High と明記）。しかし Medium 5件のリストに含まれておらず、Low が 1件（border-gray-100 のみ）とされているため、サイドバーの残り3件（w-60, rounded-xl nav, w-7h-7）の重大度が曖昧。
   - 判定: expected.md の数値（Critical 3 + High 7 + Medium 5 + Low 1 = 16件）と個別アイテム数（カラー5 + サイドバー4 + スペーシング3 + ボタン2 + ボーダー1 + フォーム1 = 16件）を突き合わせると、サイドバーの bg-slate-800 以外の3件は High でも Low でもない → Medium に含まれると解釈が自然。iter_2 の Low 分類は severity エラーの可能性が高い。

3. **`rounded-xl` ナビを Low に分類（同上の理由で Medium の可能性）**
   - 上記 w-60 と同様の理由。一貫性の問題（デザインシステムとの逸脱）はMedium相当と期待される。

**改善点（正しく修正された severity）:**
- `appearance-none` 欠如: iter_1 の Critical → iter_2 の High ✓（expected と一致）
- `aria-current` / `th scope`: Critical のまま維持 ✓
- `duration-500` (Case 02): iter_1 の Medium → iter_2 の Low ✓（expected と一致）
- `hover:shadow-2xl` (Case 03): iter_1 の Medium → iter_2 の Low ✓（expected と一致）

**Case 02 — severity 完全一致**

| 違反 | iter_2 | expected | 判定 |
|------|--------|----------|------|
| fieldset/legend 欠如 | Critical | Critical | ✓ |
| select#dept appearance-none | High | High | ✓ |
| tracking-tight | Medium | Medium | ✓ |
| duration-500 | Low | Low | ✓ |

**Case 03 — severity 完全一致**

| 違反 | iter_2 | expected | 判定 |
|------|--------|----------|------|
| 検索入力 label欠如 | Critical | Critical | ✓ |
| text-blue-600 | High | High | ✓ |
| p-0 on card | Medium | Medium | ✓ |
| hover:shadow-2xl | Low | Low | ✓ |

---

### 構造・表現の問題

1. **サマリー整合性の改善（Case 01: "サマリー整合確認済み"と明記）**
   - iter_1 の主要課題だった「サマリー数値と本文の不整合」が解消された。iter_2 はサマリー（Critical 4, High 7, Medium 5, Low 4）を確認済みとして提示しており、P2-4 の対応が奏功している。
   - ただし expected のサマリー（Critical 3, High 7, Medium 5, Low 1）と比較すると Critical が 1件、Low が 3件多い。これは nav aria-label スキップ（Critical 誤判定）と sidebar 3件の Low 化（severity 誤分類）に起因する。

2. **行番号参照の実装（Cases 02, 03）**
   - iter_1 の残課題だった「行番号参照の欠如」がCase 02（"行68", "行104", "行72-88"）、Case 03（"行90"）で実装された。P2-5 対応が完了。
   - Case 01 の行番号参照状況は不明（出力詳細に記載なし）。

3. **Case 01 に残る箇所数の精度問題**
   - `text-black` の検出: iter_2 は「8箇所」と報告しているが expected は「6箇所（h1, メトリクスカード値×4, テーブルtd）」。2箇所の過剰カウント。
   - `text-gray-400` の検出: iter_2 は「9箇所」と報告しているが expected は「5箇所（p説明文, メトリクスラベル×4, テーブルtd×2）」。4箇所の過剰カウント。
   - 推定原因: text-black / text-gray-400 が正しく意図的に使われている箇所（例: SVGストローク属性、非本文テキスト等）もカウントしている可能性。または HTML の複数カラム/複数インスタンスを重複カウントしている。

4. **偽陽性 text-xs の追加による conciseness 低下**
   - 1件の偽陽性が Case 01 レポートの「信号対雑音比」を下げる。读み手が true positive と false positive を区別する必要が生じる。

---

### Skill改善の提案

**P1（即時対応）— completeness と accuracy に直結**

1. **`nav aria-label` の検出基準を「nav数によらず必須」に戻す**
   - 現行の問題: iter_2 が「1つしか nav がないから不要」と判断し意図的に除外した。これは expected.md の規定に反する。
   - 修正指示: 「`<nav>` 要素が存在する場合、数にかかわらず `aria-label` の有無を確認する。なければ `aria-label="メインナビゲーション"` 等の追加を推奨する。」
   - 根拠: navが現在1つでも将来的に複数になる可能性があり、DSは先行的に aria-label を要求している。

2. **`w-7 h-7` アイコンサイズの検出ルール追加**
   - 現行の問題: サイドバー内アイコンの非標準サイズが未検出。
   - 修正指示: 「`<svg>` または アイコン要素のサイズクラスを確認する。DS標準は `w-5 h-5`（通常）または `w-4 h-4`（小サイズ）。`w-6 h-6` 以上（`w-7 h-7`, `w-8 h-8` 等）はサイズ違反として [Medium] に分類する。」

3. **`text-xs` の誤検出を防ぐホワイトリスト拡充**
   - 現行の問題: `text-xs` をカードラベルの違反として誤検出した。
   - 修正指示: 「`text-xs`（13px）はバッジ・メタ情報・補助ラベルの正規サイズ。カードラベルに使用されていても単独では違反ではない。`text-xs` を違反として報告するのは、本文または主要見出しに使用されている場合のみ。」

**P2（次イテレーション）— severity の最終調整に直結**

4. **静的 shadow-lg の重大度を Medium に維持**
   - iter_1 の勾配で指示済みだが iter_2 で未反映。severity lookup table への明示的な記述が必要。
   - 追記内容:
     ```
     shadow-lg（静的カード・コンテナ）→ Medium（影の強度がDSを逸脱、視覚的統一感の問題）
     hover:shadow-lg / hover:shadow-2xl（ホバー限定）→ Low（インタラクション時のみ、機能影響なし）
     ```
   - 「ホバー限定かどうか」を判定し重大度を変える2段階ルールをSkillに実装する。

5. **サイドバーデザイン違反の重大度マッピング明示**
   - w-60（非標準幅）、rounded-xl on ナビアイテム → Medium（デザインシステム一貫性の逸脱、機能影響は限定的）
   - w-7 h-7 アイコン → Medium（同上）
   - bg-slate-800（暗背景）→ High（コントラスト・視覚的優先度の問題）

6. **箇所数カウントの精度向上**
   - text-black / text-gray-400 の過剰カウント防止のため、「Tailwindクラスとして実際にテキスト要素に付与されているもののみカウント」を明示する。SVG属性（`fill`, `stroke`）の色指定は別途判定し、Tailwindテキストクラスとは区別する。

**P3（将来対応）— 収束後の品質維持**

7. **expected.md 形式の「偽陽性リスト」を動的生成**
   - Skill 実行の最後に「以下の要素を正しい実装として確認し、違反リストから除外した」というホワイトリスト確認ステップのサマリーを出力する。これにより偽陽性の見逃し防止と読み手への透明性確保が両立する。

---

### 収束判定

| 条件 | iter_0 | iter_1 | iter_2 | 状態 |
|------|--------|--------|--------|------|
| 総合スコア 90 以上 | 82 | 88 | **94** | **達成** |
| 3ケース全 completeness 85 以上 | Case 01: 80 | 全ケース: 100 | Case 01: 88, 他: 100 | **達成** |
| 2イテレーション連続で改善 1 点未満 | — | +6点 | +6点 | 未達（改善幅は同じだが連続ではない） |

**判定: 収束条件の主要2項目を達成。ただし厳密には未収束。**

総合スコア 94 は収束基準（90以上）を達成し、3ケース全ての completeness が 85 以上（Case 01: 88）を達成している。一方、「2イテレーション連続で改善 1 点未満」条件は未達（iter_0→1: +6点、iter_1→2: +6点で連続改善中）。

**実質的収束と見なすか、iter_3 へ進むかはユーザー判断に委ねる。**

残課題（iter_3 で改善すべき点）:
- Case 01 completeness: 88（nav aria-labelと w-7h-7 の2件漏れ）→ 修正により 100 到達可能
- Case 01 severity: shadow-lg のMedium→Low誤分類、sidebar項目のLow誤分類（3件）
- Case 01 accuracy: text-xs の偽陽性（1件）→ ホワイトリスト追加で解消可能
- 上記が解消されれば Case 01 は 87 → 95+ が見込まれ、総合スコア 96+ 到達の可能性がある

主な達成事項:
- severity 平均: 70 → 93（**+23** — duration-500/hover:shadow-2xl の Low 化、appearance-none の High 化が奏功）
- accuracy 平均: 93 → 97（Case 02 の偽陽性が 2件 → 0件）
- structure 平均: 80 → 89（行番号参照が Cases 02, 03 で実装）
- conciseness 平均: 82 → 93（同一違反の集約が定着）
- Case 02 / Case 03: ともに総合 98 — ほぼ完全な出力品質
