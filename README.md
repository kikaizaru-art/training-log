---
type: readme
created: 2026-05-04
updated: 2026-05-05
tags: [health, training-log, readme, meta]
---

# Training Log 使い方

## 命名規則

### セッション記録

- パス: `sessions/YYYY-MM-DD_<routine>.md`
- 例: `sessions/2026-05-05_上半身push.md` / `sessions/2026-05-07_脚＋体幹.md`
- routine値: `上半身push` / `脚＋体幹` / `Pull＋仕上げ`

### 種目マスタ

- パス: `exercises/<種目名>.md`（日付プレフィックスなし、entity 扱い）
- 例: `exercises/ダンベルプレス.md` / `exercises/ブルガリアンスクワット.md`
- 種目名は表記そのままを使用、スペースは `_` か `-` に置換

## frontmatter スキーマ

### type: training-session（セッション）

| フィールド | 型 | 必須 | 例 / 値域 |
|---|---|---|---|
| `type` | string | ✅ | `training-session` |
| `project` | string | ✅ | `health-training` |
| `date` | date | ✅ | `2026-05-05` |
| `weekday` | string | ✅ | `火` / `木` / `土` |
| `routine` | string | ✅ | `上半身push` / `脚＋体幹` / `Pull＋仕上げ` |
| `condition` | number | ✅ | 1-5（体調） |
| `mood` | number | ✅ | 1-5（気分） |
| `total_volume_kg` | number | ✅ | 全種目の重量×回数の合計 |
| `status` | string | ✅ | `completed` / `partial` / `skipped` |
| `created` | date | ✅ | JST 当日 |
| `tags` | list | ✅ | `[training-session, health, ...]` |

### type: training-exercise（種目マスタ）

| フィールド | 型 | 必須 | 例 / 値域 |
|---|---|---|---|
| `type` | string | ✅ | `training-exercise` |
| `exercise_name` | string | ✅ | `ダンベルプレス` |
| `body_part` | string | ✅ | 主部位（`胸（中）` 等） |
| `secondary` | string | - | 補助筋（`肩（前）, 腕（三頭筋）` 等） |
| `default_routine` | string | ✅ | `火` / `木` / `土`（複数可、カンマ区切り） |
| `pr_weight` | number | ✅ | ベスト重量（kg） |
| `pr_reps` | number | ✅ | その時の回数 |
| `pr_date` | date | ✅ | PR達成日 |
| `notes` | string | - | フォーム注意点等 |
| `created` | date | ✅ | JST |
| `tags` | list | ✅ | `[training-exercise, health, ...]` |

## 本文フォーマット（セッション）

各種目を `### <種目名>` 見出しで区切り、セット毎に1行。

```markdown
### ダンベルプレス
- セット1: 12kg × 10回
- セット2: 12kg × 10回
- セット3: 10kg × 12回
- ボリューム: 12*10 + 12*10 + 10*12 = 360kg
- メモ: 左肩やや違和感
```

`total_volume_kg` は frontmatter に手入力。各種目のボリューム合計値。

なお `duration_min` / RPE はオーナー方針で記録対象外（2026-05-05 廃止）。実測値の記録運用が立ち上がる時に再評価する。

## 運用フロー

### 当日記録

1. 筋トレ実施後、Claude に「今日の筋トレ報告」と話しかける
2. Claude が `_template-session.md` をベースに種目別ヒアリング
3. Plan Preview で確認 → 承認 → `sessions/YYYY-MM-DD_<routine>.md` に保存

### PR更新

セッション内で新記録が出た場合、Claude が該当 `exercises/<種目名>.md` の以下を更新:

- `pr_weight` / `pr_reps` / `pr_date`
- 本文の「## ベスト記録」セクション

種目マスタが未作成なら新規作成も同時に行う。

### 種目マスタの初期化

`_template-exercise.md` を雛形に、初回登場時に Claude が作成。本人指定があれば事前に複数まとめて作っても良い。

## 関連ノート

- [[_index]] - training-log トップ
- [[_template-session]] - セッションテンプレ
- [[exercises/_template-exercise]] - 種目マスタテンプレ
