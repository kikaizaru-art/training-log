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
| `condition` | number | - | 1-5（体調）。任意。記録があれば集計対象 |
| `mood` | number | - | 1-5（気分）。任意 |
| `total_volume_kg` | number | ✅ | 加重種目の重量×回数の合計（自重種目は対象外） |
| `status` | string | ✅ | `completed` / `partial` / `skipped`（`complete` は不可。`completed` に統一） |
| `created` | date | ✅ | JST 当日 |
| `updated` | date | ✅ | 最終更新日（JST）。後日追記・修正時に更新 |
| `tags` | list | ✅ | `[training-session, health, <routine>]` |

### type: training-exercise（種目マスタ）

| フィールド | 型 | 必須 | 例 / 値域 |
|---|---|---|---|
| `type` | string | ✅ | `training-exercise` |
| `exercise_name` | string | ✅ | `ダンベルプレス` |
| `body_part` | string | ✅ | 正規部位（`胸` / `背中` / `肩` / `脚` / `腕` / `体幹` のいずれか1値）。Bases の部位別グルーピングに使用 |
| `body_part_detail` | string | - | 詳細筋（`大胸筋中部` 等）。任意の補足 |
| `secondary` | string | - | 補助筋（`肩（前）, 腕（三頭筋）` 等） |
| `default_routine` | string | ✅ | `火` / `木` / `土`（複数可、カンマ区切り） |
| `bodyweight` | bool | - | 自重種目なら `true`（`pr_weight=0` と併用） |
| `pr_weight` | number | ✅ | ベスト重量（kg）。自重種目は `0` |
| `pr_reps` | number | ✅ | その時の回数 |
| `pr_date` | date | ✅ | PR達成日 |
| `notes` | string | - | フォーム注意点等 |
| `created` | date | ✅ | JST |
| `updated` | date | ✅ | 最終更新日（JST） |
| `tags` | list | ✅ | `[training-exercise, health, ...]` |

### 正規部位タクソノミ（body_part）

Bases の「部位別」グルーピングを機能させるため、`body_part` は以下6値に統一する。細かい筋肉名は `body_part_detail` に書く。

| body_part | 含む種目例 |
|---|---|
| `胸` | ダンベルプレス / ディップス |
| `背中` | ベントオーバーロー / 懸垂 |
| `肩` | ショルダープレス / ライイングリアレイズ |
| `脚` | ブルガリアンスクワット / カーフレイズ / ルーマニアンデッドリフト |
| `腕` | （二頭・三頭の単関節種目を追加する場合） |
| `体幹` | プランク |

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

### 当日提示（事前）

「今日の筋トレ」「今日のメニュー」等の発話で、Claude が [[daily-schedule]] のルールに従って曜日別メニュー（休養日は未刺激種目）を提示する。

### 当日記録

入力方法は2通り。どちらで記録しても保存先・スキーマは同じ。

**A. フォーム入力（日本語フォーム式 / 推奨）**

1. `templates/session-<routine>.md`（前回値プリフィル済み）を新規ノートとして複製
2. 上部のフォーム欄（Meta Bind）で体調・気分・状態をタップ選択
3. 各種目の重量×回数を数値だけ上書き → `sessions/YYYY-MM-DD_<routine>.md` で保存

導入手順は [[templates/_フォーム入力ガイド]] を参照（必要プラグイン: Meta Bind / Templater）。

**B. 対話入力（Claude）**

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
- [[daily-schedule]] - 曜日別スケジュール提示ルール（事前提示）
- [[_template-session]] - セッションテンプレ
- [[exercises/_template-exercise]] - 種目マスタテンプレ
