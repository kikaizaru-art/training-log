---
type: routine-catalog
project: health-training
created: 2026-05-23
updated: 2026-05-26
tags: [routine, health, training-log, ssot]
status: active
schema_version: 1
---

# 筋トレ Routine 定義（SSoT）

各 routine（火・木・土）にどの種目が含まれるかを Vault に置く SSoT。

これまで routine の種目リストは artifact（Base Camp ダッシュボード）のコード内に直書きされていた。2026-05-23 にゴム補助懸垂のズレ事故（5/16 申し送り未反映）が顕在化したため、Vault 側に SSoT を切り出した。今後 routine 構成を変える時はこのファイルを更新し、artifact 側はここを参照する形にする。

次回セッションの目安重量・reps を機械的に算出するための漸進的過負荷ルールは [[progression-rules]] に切り出し済み（2026-05-26〜）。本ノートの `default_reps` / `default_weight_kg` は「現時点の目標値（≒直近 PR）」であり、各セッションでこの値に全セット到達した時の次の目安は [[progression-rules]] §3 決定木で算出する。

## Routine 一覧

### 上半身push（火）

押す系メイン + 引く系1種目 + リア補助の4種目構成。+ 有酸素1枠（skip 許容）。

| 種目 | sets | reps | weight_kg | 自重 | 主動筋 | exercise マスタ |
|---|---|---|---|---|---|---|
| ダンベルプレス | 3 | 11 | 36 | - | 胸（中） | [[exercises/ダンベルプレス]] |
| ショルダープレス | 3 | 11 | 28 | - | 肩（前） | [[exercises/ショルダープレス]] |
| ベントオーバーロー | 3 | 11 | 36 | - | 背中 | [[exercises/ベントオーバーロー]] |
| ライイングリアレイズ | 3 | 10 | 6 | - | 肩（後） | 未作成 ⚠️ |
| エアロバイク | - | - | - | - | 有酸素 | 未作成（skip 許容） |

### 脚＋体幹（木）

脚強化2種目 + 体幹1種目の3種目構成。+ 有酸素2枠（skip 許容）。

| 種目 | sets | reps | weight_kg | 自重 | 主動筋 | exercise マスタ |
|---|---|---|---|---|---|---|
| ブルガリアンスクワット | 3 | 11 | 44 | - | 脚（大腿四頭・臀） | [[exercises/ブルガリアンスクワット]] |
| カーフレイズ | 3 | 15 | 28 | - | カーフ | [[exercises/カーフレイズ]] |
| プランク | 3 | 60 | - | ✓ | 体幹 | [[exercises/プランク]] |
| ケトルベル | - | - | - | - | 全身 | 未作成（skip 許容、連続skip中 ⚠️ 削除可否は要判断） |
| エアロバイク | - | - | - | - | 有酸素 | 未作成（skip 許容） |

プランクの「60」は単位（秒 or レップ）未確定。

### Pull＋仕上げ（土）

引く系メイン + 仕上げ補助の7種目構成。有酸素なし（5/16 申し送りでエアロバイク削除確定）。

| 種目 | sets | reps | weight_kg | 自重 | 主動筋 | exercise マスタ |
|---|---|---|---|---|---|---|
| ルーマニアンデッドリフト | 3 | 11 | 64 | - | 脚（ハム・臀） | [[exercises/ルーマニアンデッドリフト]] |
| 懸垂 | 1 | 6 | - | ✓ | 背中（広背） | 未作成 ⚠️ |
| ゴム補助懸垂 | 1 | 10 | - | ✓ | 背中（広背） | 未作成 ⚠️（5/16 申し送りで routine に追加、5/24〜 正式運用） |
| ネガティヴ懸垂 | 1 | 10 | - | ✓ | 背中（広背） | 未作成 ⚠️ |
| ベントオーバーロー | 3 | 11 | 36 | - | 背中 | [[exercises/ベントオーバーロー]] |
| ディップス | 3 | 11 | - | ✓ | 胸（中・下部） | [[exercises/ディップス]] |
| ライイングリアレイズ | 3 | 10 | 6 | - | 肩（後） | 未作成 ⚠️ |

## 未作成 exercise マスタ（後回しタスク）

以下7種目は本ノートでデフォルト値を持つが、専用 exercise マスタ未作成。PR 履歴を体系的に追えないため、別タスクで作成推奨。

- ライイングリアレイズ（pr_weight=6, pr_reps=10）
- 懸垂（自重 × 6rep × 1set）
- ゴム補助懸垂（自重 × 10rep × 1set）
- ネガティヴ懸垂（自重 × 10rep × 1set）
- スタンディングカーフ（脚日 副種目、最終 2026-04-16 32kg×15×3）
- ケトルベル（脚日 有酸素枠、連続skip中）
- エアロバイク（火・木 有酸素枠、連続skip中）

## artifact 焼き付け用 JS const

ダッシュボード側のコードに貼り付ける形式。`canonical` は Calendar 入力名の正規化先で、artifact 内の `LAST_RECORDS_BY_EXERCISE` キーと一致する。

```javascript
// === Routine 定義（SSoT: 20-Areas/health/training-log/routines.md） ===
// 最終更新: 2026-05-23（ゴム補助懸垂を Pull＋仕上げ に追加）
const ROUTINES = {
  "上半身push": {
    weekday: "火",
    description: "押す系メイン + 引く系1種目 + リア補助",
    exercises: [
      { canonical: "ダンベルプレス",      sets: 3, default_reps: 11, default_weight_kg: 36, bodyweight: false, skip_allowed: false },
      { canonical: "ショルダープレス",    sets: 3, default_reps: 11, default_weight_kg: 28, bodyweight: false, skip_allowed: false },
      { canonical: "ベントオーバーロー",  sets: 3, default_reps: 11, default_weight_kg: 36, bodyweight: false, skip_allowed: false },
      { canonical: "ライイングリアレイズ", sets: 3, default_reps: 10, default_weight_kg: 6,  bodyweight: false, skip_allowed: false },
      { canonical: "エアロバイク",        sets: null, default_reps: null, default_weight_kg: null, bodyweight: null, skip_allowed: true }
    ]
  },
  "脚＋体幹": {
    weekday: "木",
    description: "脚強化2 + 体幹1 + 有酸素2（skip 許容）",
    exercises: [
      { canonical: "ブルガリアンスクワット", sets: 3, default_reps: 11, default_weight_kg: 44, bodyweight: false, skip_allowed: false },
      { canonical: "カーフレイズ",          sets: 3, default_reps: 15, default_weight_kg: 28, bodyweight: false, skip_allowed: false },
      { canonical: "プランク",              sets: 3, default_reps: 60, default_weight_kg: null, bodyweight: true,  skip_allowed: false, unit_note: "60 の単位 tbd（秒 or レップ）" },
      { canonical: "ケトルベル",            sets: null, default_reps: null, default_weight_kg: null, bodyweight: null, skip_allowed: true, pending_review: "連続skip中、削除可否判断待ち" },
      { canonical: "エアロバイク",          sets: null, default_reps: null, default_weight_kg: null, bodyweight: null, skip_allowed: true }
    ]
  },
  "Pull＋仕上げ": {
    weekday: "土",
    description: "引く系メイン + 仕上げ補助（有酸素なし、5/16 申し送りでエアロバイク削除確定）",
    exercises: [
      { canonical: "ルーマニアンデッドリフト", sets: 3, default_reps: 11, default_weight_kg: 64, bodyweight: false, skip_allowed: false },
      { canonical: "懸垂",                  sets: 1, default_reps: 6,  default_weight_kg: null, bodyweight: true,  skip_allowed: false },
      { canonical: "ゴム補助懸垂",          sets: 1, default_reps: 10, default_weight_kg: null, bodyweight: true,  skip_allowed: false, note: "5/16 申し送りで routine に追加、5/24〜 正式運用" },
      { canonical: "ネガティヴ懸垂",        sets: 1, default_reps: 10, default_weight_kg: null, bodyweight: true,  skip_allowed: false },
      { canonical: "ベントオーバーロー",    sets: 3, default_reps: 11, default_weight_kg: 36, bodyweight: false, skip_allowed: false },
      { canonical: "ディップス",            sets: 3, default_reps: 11, default_weight_kg: null, bodyweight: true,  skip_allowed: false },
      { canonical: "ライイングリアレイズ",  sets: 3, default_reps: 10, default_weight_kg: 6,  bodyweight: false, skip_allowed: false }
    ]
  }
};
```

## 更新ルール

- routine 構成を変える時は本ノートを先に更新（Plan Preview 必須）
- 更新後、artifact 側に反映する場合は `90-Meta/artifact-patches/` に新規パッチを投入
- 5/16 → 5/23 のような「Vault 更新 → artifact 未反映」のズレを防ぐため、routine 変更時は必ず artifact-patch をセットで投入する運用

## 次回目標値の運用

本ノートの `default_reps` / `default_weight_kg` は **「現時点の目標値（≒直近 PR）」** であり、進捗とともに更新される値。次の関係を維持する。

- 各セッションで該当種目が `default_reps` × `default_weight_kg` × `sets` に **全セット到達** → 次回は [[progression-rules]] §3 決定木に従って「+1rep」「+2.5kg」「同条件維持で安定化」等のアクションを選択
- 新規 PR 成立で `default_*` がその値を超えたら、本ノートの `default_*` も更新（Plan Preview 必須）
- 後退が続いて `default_*` に届かなくなった場合は本ノートの値は据え置き、復帰戦略は [[progression-rules]] §3.4 後退チェック分岐に従う

「default 値の更新」は exercise マスタの `pr_*` 更新と連動するが、両者は別の意味を持つ:

- exercise マスタの `pr_*`: 過去最高記録（後退があっても下げない）
- routines.md の `default_*`: 次回セッションの目標値（後退で見直すこともあり、当面達成困難なら下げる選択肢もある）

通常運用では両者は一致するが、ディロード期や怪我復帰期には乖離する可能性がある。乖離が発生した場合は Plan Preview で扱いを確認する。

## 種目名正規化マップ（Calendar → Vault canonical）

Google Calendar イベント description に書かれる種目名と Vault canonical 名の対応表。表記揺れがある場合のみ列挙。差分なしの種目は省略。

| Calendar 入力名 | Vault canonical | 出現 routine |
|---|---|---|
| ベントオーバーロウ | ベントオーバーロー | 上半身push, Pull＋仕上げ |
| ネガティブ懸垂 | ネガティヴ懸垂 | Pull＋仕上げ |

### 部位ラベルと種目時間（Calendar 表示用）

Calendar description の `（部位）` 表記と `<n>分` 表記は Vault に持たない便宜表示。種目ごとに以下で固定する。

| canonical | 部位ラベル | duration_min |
|---|---|---|
| ダンベルプレス | 胸中 | 10 |
| ショルダープレス | 肩前 | 10 |
| ベントオーバーロー | 背中 | 10 |
| ライイングリアレイズ | 肩後 | 10 |
| ブルガリアンスクワット | 脚太 | 10 |
| カーフレイズ | 脚ふくらはぎ | 10 |
| プランク | 腹 | 10 |
| ケトルベル | 有酸素 | 10 |
| エアロバイク | 有酸素 | 5 |
| ルーマニアンデッドリフト | 脚太 | 10 |
| 懸垂 | 背中 | 10 |
| ゴム補助懸垂 | 背中 | 10 |
| ネガティヴ懸垂 | 背中 | 10 |
| ディップス | 胸中 | 10 |

### routine 合計時間

| routine | total_duration |
|---|---|
| 上半身push | 45分 |
| 脚＋体幹 | 45分 |
| Pull＋仕上げ | 65分 |

現 Calendar 表示値を踏襲。変更時は本ノートで同時更新する。

### 更新ルール

- 新規 routine 追加 or 既存 routine 種目追加時は、本マップに該当行を追加
- Calendar description に新しい表記揺れを発見したら、即 Calendar→canonical エントリを追加
- 「## artifact 焼き付け用 JS const」ブロックの `ROUTINES` にも `display_label` / `duration_min` を併記する形へ拡張予定（次回 artifact-patch で反映）
- [[../prompts/training-log-session#6-c-description-組み立て|prompts/training-log-session §6-C]] が本マップを参照して Calendar 書き換えを行う

## 関連ノート

- [[progression-rules]] - 漸進的過負荷ルール（次回目安の決定木 SSoT）
- [[_index|training-log _index]] - training-log トップ
- [[README]] - 命名規則・運用フロー
- [[sessions/2026-05-12_上半身push|2026-05-12 上半身push]] - 上半身push 代表セッション
- [[sessions/2026-05-21_脚＋体幹|2026-05-21 脚＋体幹]] - 脚＋体幹 代表セッション
- [[sessions/2026-05-23_Pull＋仕上げ|2026-05-23 Pull＋仕上げ]] - Pull＋仕上げ 代表セッション
- [[../../../90-Meta/artifact-patches/2026-05-23_morning-dashboard_training-records|artifact-patch 2026-05-23]] - 本ノートの初出契機となったパッチ
- [[../../../90-Meta/morning-dashboard|morning-dashboard.md]] - Base Camp メタノート
