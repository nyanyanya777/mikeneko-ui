# スキル構築ガイド（Anthropic公式PDFの要約）

出典: "The Complete Guide to Building Skills for Claude" (Anthropic)

スキル改善時にこのファイルを参照すること。

---

## 1. スキルの基本構造

スキル = フォルダ。中に:
- **SKILL.md**（必須）: YAML frontmatter + Markdownの指示
- **scripts/**（任意）: 実行可能コード
- **references/**（任意）: 参照ドキュメント
- **assets/**（任意）: テンプレート等

### Progressive Disclosure（3層構造）

| レベル | 内容 | いつ読まれるか |
|---|---|---|
| 1. YAML frontmatter | name + description | 常時（システムプロンプトに載る） |
| 2. SKILL.md本文 | 詳細な指示 | Claudeがスキルを使うと判断した時 |
| 3. リンクファイル | references/内のドキュメント | 必要に応じて |

→ トークン消費を最小化しつつ、専門知識を維持する仕組み。

## 2. YAML frontmatter（最重要）

```yaml
---
name: your-skill-name      # kebab-case、スペース不可、大文字不可
description: "[何をする] + [いつ使う（トリガー条件）] + [主な機能]"
---
```

### descriptionのルール
- **何をするか + いつ使うか** の両方を必ず含める
- 1024文字以内
- XMLタグ（< >）禁止
- ユーザーが言いそうな具体的フレーズを含める

#### Good例
```
description: Analyzes Figma design files and generates developer handoff
documentation. Use when user uploads .fig files, asks for "design specs",
"component documentation", or "design-to-code handoff".
```

#### Bad例
```
# 曖昧すぎ
description: Helps with projects.

# トリガーなし
description: Creates sophisticated multi-page documentation systems.

# 技術的すぎ、ユーザートリガーなし
description: Implements the Project entity model with hierarchical relationships.
```

## 3. 指示の書き方

### 推奨構造
```markdown
# スキル名
## Instructions
### Step 1: [最初のステップ]
具体的に何をするかを説明。
### Step 2: ...
## Examples
## Troubleshooting
```

### ベストプラクティス
- **具体的・実行可能に**: 「データを検証する」ではなく「`python scripts/validate.py --input {filename}` を実行してデータ形式を確認」
- **エラーハンドリングを含める**: よくあるエラーと対処法をセットで書く
- **Progressive Disclosureを使う**: SKILL.mdはコア指示に集中し、詳細はreferences/に分離

## 4. スキルカテゴリ（3種類）

| カテゴリ | 用途 | キーテクニック |
|---|---|---|
| Document & Asset Creation | 一貫した高品質な成果物生成 | スタイルガイド埋め込み、テンプレート、品質チェックリスト |
| Workflow Automation | 一貫した方法論が有益なマルチステップ処理 | ステップごとのバリデーションゲート、テンプレート、反復改善ループ |
| MCP Enhancement | MCPツールアクセスを強化するワークフローガイド | 複数MCP呼び出しの連携、ドメイン知識の埋め込み、エラーハンドリング |

## 5. 成功指標

### 定量指標
- スキルが90%の関連クエリでトリガーされる
- ワークフローがX回のツール呼び出しで完了する
- ワークフローあたり0回のAPI失敗

### 定性指標
- ユーザーが次のステップをプロンプトする必要がない
- ユーザー修正なしでワークフローが完了する
- セッション間で一貫した結果が出る

## 6. テスト方法

### 3つのテスト領域

1. **トリガーテスト**: 正しいタイミングで発火するか
   - 明確なタスクでトリガーされる
   - 言い換えでもトリガーされる
   - 無関係なトピックではトリガーされない

2. **機能テスト**: 正しい出力を生成するか
   - 有効な出力が生成される
   - API呼び出しが成功する
   - エラーハンドリングが機能する

3. **パフォーマンス比較**: スキルなしと比較して改善されているか

### 反復改善のシグナル

**Under-triggering（トリガー不足）の兆候:**
- スキルが発火すべき時にしない → descriptionにキーワードやトリガーフレーズを追加

**Over-triggering（過剰トリガー）の兆候:**
- 無関係なクエリで発火する → ネガティブトリガーを追加、より具体的に

**実行品質の問題:**
- 結果が一貫しない / ユーザー修正が必要 → 指示を改善、エラーハンドリングを追加

## 7. レビューチェックリスト

スキル改善時に以下を確認:

- [ ] descriptionに「何をするか」+「いつ使うか（トリガーフレーズ）」が両方あるか
- [ ] 各ステップが具体的・実行可能か（曖昧な指示がないか）
- [ ] エラーハンドリングが網羅的か
- [ ] Progressive Disclosureを活用しているか（本文が肥大化していないか）
- [ ] 確認フロー（ユーザー承認）が必要な箇所に含まれているか
- [ ] トリガーフレーズがユーザーの自然な言い回しに合っているか
