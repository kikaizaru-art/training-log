---
type: runbook
project: health-training
created: 2026-06-16
updated: 2026-06-16
tags: [training-log, health, ssot, schedule, runbook]
status: active
schema_version: 1
---

# 曜日別スケジュール提示ルール

「今日の筋トレ何やる？」に Claude が機械的に答えるための提示ルール。曜日 → routine 引き当て、休養日は直近 training day の未刺激種目を提案する。

routine の構成と種目デフォルト値は [[routines]]（SSoT）を参照、次回目安重量は [[progression-rules]] §3 決定木を参照する。本ノートは「提示する/しない」「何を出す」のレイヤだけを定義する。

## 1. トリガーワード

オーナーが以下のいずれかを発話 → Claude は本ノートに従って提示する。

- 「今日の筋トレ」
- 「今日のメニュー」
- 「今日何やる？」
- 「スケジュール」（training-log 文脈下のみ）

「今日の筋トレ**報告**」は事後記録のトリガーなので除外（[[README#当日記録]] 参照）。

## 2. 曜日マップ

JST 当日の曜日で判定。

| 曜日 | モード | 提示内容 |
|---|---|---|
| 月 | rest | §4 休養日提示（直近 training day = 土） |
| 火 | training | §3 training day 提示（routine: 上半身push） |
| 水 | rest | §4 休養日提示（直近 training day = 火） |
| 木 | training | §3 training day 提示（routine: 脚＋体幹） |
| 金 | rest | §4 休養日提示（直近 training day = 木） |
| 土 | training | §3 training day 提示（routine: Pull＋仕上げ） |
| 日 | rest | §4 休養日提示（直近 training day = 土） |

「直近 training day」は曜日カレンダーではなく **`sessions/` 配下の最新ファイル** を優先（実 skip 反映のため）。詳細は §4.1。

## 3. Training day 提示（火・木・土）

該当 routine の種目を順に提示。各種目について次の情報を出す。

| 列 | 取得元 |
|---|---|
| 種目名 | [[routines]] `canonical` |
| sets × reps | [[routines]] `sets` / `default_reps` |
| 目安重量 | [[routines]] `default_weight_kg` （自重種目は省略） |
| 次回アクション | [[progression-rules]] §3 決定木に当該種目の直近 session 実績を入力 |

### 3.1 出力テンプレート

```
今日は <weekday>曜・<routine名>。<exercises_count>種目（+ 有酸素 <n>枠）。

1. <種目名> — <sets>×<reps> @ <weight>kg
   次回アクション: <progression-rules §3 算出結果>
2. ...

合計目安時間: <total_duration>分（[[routines#routine 合計時間]]）
```

### 3.2 直近実績へのリンク

routine 名で `sessions/` を grep し、最新の同 routine セッションを 1 件リンクする（オーナーが前回どうやったかを即参照できる導線）。例: `[[sessions/2026-06-09_上半身push]]`。

## 4. 休養日提示（月・水・金・日）

「昨日の筋トレで触っていない種目」を提示する。target は recovery awareness（軽いストレッチ・mobility 対象部位の特定）と、次の training day までのギャップを意識させること。

### 4.1 直近 training day の特定

1. `sessions/` 配下のファイルを `date` フィールド降順でソート
2. 最新セッションを `last_session` とする
3. `last_session.routine` の種目リストを `trained_exercises` として確保（`### <種目名>` ヘッダから抽出）

カレンダー上の「昨日」を採用しないのは、skip / キャッチアップで実 training day がずれるため（例: 火 skip して 水 にキャッチアップした場合、木曜の休養日提示の「昨日」は 水曜のキャッチアップ分を見るべき）。

### 4.2 未刺激種目の算出

```
all_exercises = routines.md の全 routine × 全 canonical の和集合
                （skip_allowed: true の種目は除外）
untouched = all_exercises − trained_exercises
```

`trained_exercises` は厳密一致。同名種目が別 routine にも入っている場合（例: ベントオーバーロー）は触れた扱いとする。

### 4.3 出力テンプレート

```
今日は <weekday>曜・休養日。

直近 training: <last_session.date>（<last_session.weekday>）<last_session.routine>
触れた種目: <trained_exercises をカンマ区切り>

未刺激（次回までに刺激予定）:
- <untouched 種目> （<body_part>） … 次回出番: <該当 routine の曜日>
- ...

推奨: 未刺激部位の軽い stretch / mobility（強度なし、5-10 分目安）
```

### 4.4 連続休養日（日 → 月）の扱い

土曜セッションの後、日 → 月と連続で休養日が続くケース。両日とも「直近 training day = 土」として同じ提示でよい。月曜時点で `untouched` セットは日曜と同じ。

## 5. エッジケース

| ケース | 挙動 |
|---|---|
| 当日 session が既に記録済（training day） | 「今日の <routine> は記録済み（[[sessions/YYYY-MM-DD_routine]]）」と返し、提示は省略 |
| `sessions/` が空（運用初期） | 休養日提示で `untouched = all_exercises` 全部を列挙、`last_session` 行は「直近実績なし」と表示 |
| 直近セッションが `status: skipped` | 1 件遡って `status: complete` / `partial` のセッションを `last_session` とする |
| キャッチアップセッション（ファイル名末尾 `-キャッチアップ`） | 通常セッションと同等に扱う（routine 種目を実施した扱い） |
| 体調不良の事前申告（オーナー発話） | [[progression-rules]] §3.1 体調分岐の参照を促し、目安重量に「ディロード検討」フラグを併記 |

## 6. 想定外スコープ

- 今週 / 今月の進捗サマリ → [[training-sessions.base]] のビュー側で提示する責務
- PR 達成見込み計算 → [[progression-rules]] のスコープ
- Calendar / artifact 連携での自動表示 → [[2026-05-05_拡張機能-設計メモ#2-4軸サマリパネル|拡張機能設計メモ §2]] で検討中の領域、本ノートとは別レイヤ

## 関連ノート

- [[routines]] - routine 種目構成 SSoT（本ノートの参照元）
- [[progression-rules]] - 次回目安算出 SSoT（training day 提示で参照）
- [[README]] - 命名規則・運用フロー（事後記録側のトリガー定義）
- [[_index]] - training-log エリアトップ
- [[2026-05-05_拡張機能-設計メモ]] - artifact 連携側の検討先
