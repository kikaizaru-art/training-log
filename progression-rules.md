---
type: runbook
project: health-training
created: 2026-05-26
updated: 2026-05-26
tags: [training-log, health, ssot, progression, runbook]
status: active
schema_version: 1
---

# 漸進的過負荷ルール（SSoT）

筋トレ運用における「次回セッションの目安重量・reps」を機械的に算出する SSoT。これまで `prompts/training-log-session.md` 内に PR 判定3条件として一部記述されていたが、**「次に何をやるか」を決める進行ルール本体は暗黙運用** だったため、Calendar 連携実装（次回セッション通知に推奨値を埋め込む等）の参照先として明文化した。

導出は 2026-04-02 〜 2026-05-24 の session 実績（[[sessions/]]） + exercise マスタ（[[exercises/]]）から観察された運用パターンに基づく。

## 1. スコープと前提

このルールが扱う範囲:

- routines.md で定義された3 routine（[[routines#上半身push（火）|上半身push]] / [[routines#脚＋体幹（木）|脚＋体幹]] / [[routines#Pull＋仕上げ（土）|Pull＋仕上げ]]）配下の全種目
- 1セッション完了時点で、その種目の「次回推奨アクション」を算出
- 加重種目（重量×reps）と自重種目（reps のみ）の両方
- レップレンジ: 6（懸垂等）〜 60（プランク）まで

このルールが扱わない範囲（未確定領域、§6 参照）:

- 体調 condition ≤ 2 時のディロード幅（session 記録に明示事例なし）
- 怪我復帰時のリハビリ進行（session 記録に事例なし）
- 完全新規種目の初回重量設定（オーナーが都度判断）

## 2. 入力データ

決定木の入力として必要な変数:

| 変数 | 取得元 | 例 |
|---|---|---|
| `exercise_canonical` | routines.md の `canonical` フィールド | `"ダンベルプレス"` |
| `bodyweight` | routines.md or exercise マスタ | `false` / `true` |
| `last_session_weight` | 直近 session.md `### <種目>` ブロック | `36` (kg) |
| `last_session_reps[]` | 直近 session.md セット毎 | `[11, 11, 11]` |
| `target_reps` | routines.md `default_reps` | `11` |
| `target_sets` | routines.md `sets` | `3` |
| `all_sets_target_hit` | `last_session_reps[]` 全要素 ≥ `target_reps` か | `true` |
| `pr_weight` | exercise マスタ frontmatter | `36` |
| `pr_reps` | exercise マスタ frontmatter | `11` |
| `pr_date` | exercise マスタ frontmatter | `2026-05-12` |
| `recent_tie_count` | exercise マスタ PR履歴のタイ連続回数 | `0` / `1` / `2` / `3` |
| `recent_regression_count` | exercise マスタ PR履歴の rep 後退連続回数 | `0` / `1` / `2` |
| `condition` | 直近 session.md frontmatter | `1`〜`5` / `null` |

`recent_tie_count` / `recent_regression_count` は exercise マスタの PR 履歴セクションを最新から遡って数える。直近セッションが PR タイなら +1、新規 PR or 後退でリセット。

## 3. 決定木（メインロジック）

> [!note] 決定順序
> 上から順に評価し、最初にマッチした分岐を採用する。下位の分岐は評価しない。

### 3.1 体調分岐

```
if condition ≤ 2:
    → ディロード（§6.1 未確定領域。暫定: 重量 -2.5kg または sets-1）
if condition == 3:
    → 維持（前回と同条件で再実施）
if condition ≥ 4 or condition is null:
    → §3.2 へ進む
```

`condition` が null（未記録）の場合は「通常進行」扱い。5/14 / 5/21 セッションは condition 未記録だったが、内容ベースで通常進行している実例。

### 3.2 自重 / 加重 分岐

```
if bodyweight == true:
    → §3.3 自重種目ルール
else:
    → §3.4 加重種目ルール
```

### 3.3 自重種目ルール

```
if all_sets_target_hit:
    → 次回 +1rep（全セット reps+1 を目標に）
    例外: ディップスのみ「+1rep」or「加重ディップス +2.5kg」の二択を提示
else:
    → 同条件維持
```

**例外: 懸垂系（懸垂 / ゴム補助懸垂 / ネガティヴ懸垂）の補助関係**

懸垂（自重 × 6rep × 1set）は「最終目標 10rep」までの進行が長期スパン。ゴム補助懸垂（自重×10×1）とネガティヴ懸垂（自重×10×1）が**サポート枠**として併走する。サポート枠側は別系統で進行（ゴム補助懸垂は 04/04 12rep → 04/11以降 10rep と補助減少方向、ネガティヴは 10rep 維持で粘り強化）。本ルールは懸垂本体の「+1rep」を最優先で適用、サポート枠は同条件維持を基本とする。

### 3.4 加重種目ルール

```
# 後退チェックを先に
if recent_regression_count == 1:
    → 同条件で再挑戦（1セッションだけではトレンド判定しない）
if recent_regression_count ≥ 2:
    → -1kg または -2.5kg にロールバック、reps は前回 PR の reps へ戻す

# 全セット到達チェック
if not all_sets_target_hit:
    → 同条件維持

# 全セット到達 + PR タイ連続回数で分岐
if 新規 PR 更新:
    → 次回 +2.5kg または +1rep の二択提示
if recent_tie_count in [1, 2]:
    → 同条件維持で安定化
if recent_tie_count ≥ 3:
    → +2.5kg でブレイクスルー試行
```

**新規 PR 更新の判定**は [[../prompts/training-log-session#1-c-pr-自己ベスト-との比較フィードバック|prompts/training-log-session §1-C]] の PR 判定3条件に準拠（単発最大重量超 / 同重量での最大レップ超 / 推定 1RM 超）。

**「同条件維持で安定化」の意味**: PR タイ 1-2回目は「フォーム定着・神経系適応」のフェーズと扱い、敢えて重量を上げない。3回連続でタイになった時点で「もう適応済み」と判定して次段階へ。5/16 ベントロー（タイ1回目 = 維持選択）→ 5/23 ベントロー（タイ2回目 = 維持選択、ただし申し送りで「3回連続 + 1回タイ = 4回タイ相当だから次回 +2.5kg」と明示）の運用が実例。

## 4. 種目区分別の細則

### 4.1 バーベル / ダンベル種目（中量級 6-12rep）

該当: ダンベルプレス / ショルダープレス / ベントオーバーロー / ブルガリアンスクワット / ルーマニアンデッドリフト / ライイングリアレイズ

- §3.4 加重種目ルールをそのまま適用
- 増量幅は **+2.5kg を基本単位** とする（オーナーの所有ダンベル増分が 2.5kg 単位のため）
- ライイングリアレイズのみ +0.5kg 幅も検討対象（軽量 6kg ベース、5/12 申し送りで「+0.5kg 候補」と明示）

### 4.2 マシン / フリーウェイト 高rep種目（15rep+）

該当: カーフレイズ / スタンディングカーフ

- 増量幅: +2.5kg または +4kg（28kg → 32kg の実例あり）
- rep 増分: +2rep（28×15 → 28×17 の実例あり）
- **3週連続全達ルール**: 同重量で 15rep × 3 を 3週連続達成したら次回は重量増（reps は 12〜13 に一旦戻す）。5/21 申し送り「3週連続 28kg×15×3 達成 → 次回 30kg×12〜13 への増量検討」が実例
- 高rep種目では「reps を青天井に伸ばすより、適度に重量を上げて新刺激を入れる」が運用方針

### 4.3 自重種目（懸垂系・ディップス・プランク）

該当: 懸垂 / ゴム補助懸垂 / ネガティヴ懸垂 / ディップス / プランク

- §3.3 自重種目ルールを適用
- ディップスは「加重ディップス +2.5kg」を二択に含める（5/23 申し送り明示）
- 懸垂サポート枠（ゴム補助懸垂 / ネガティヴ懸垂）は本体懸垂が +1rep するまで維持優先
- プランクは「60」の単位（秒 or レップ）未確定のため、機械算出は当面保留（オーナー確認後にルール追加）

## 5. レップレンジ別の細則

| レップレンジ | 該当種目例 | 増分単位 |
|---|---|---|
| 6rep 帯 | 懸垂 | +1rep（重量増は最終目標 10rep 到達後） |
| 10-12rep 帯 | 加重メイン種目大半（ダンベルプレス・ベントロー・ブルガリアン・RDL 等） | +1rep または +2.5kg |
| 15rep+ 帯 | カーフレイズ | +2rep または +2.5〜4kg（3週連続全達後に増量） |
| 60（秒 or レップ） | プランク | 単位未確定、現状維持 |

レップレンジを跨ぐ「重量を上げて rep を初期値に戻す」遷移は **15rep+ 帯のみ明示ルール化**。10-12rep 帯では「+1rep して 12rep に到達 → 次は +2.5kg して 10rep からやり直し」の遷移が起こり得るが、実例が少ないため決定木では「+1rep or +2.5kg の二択提示」止まりで、最終判断はオーナーに残す。

## 6. 例外・未確定領域

### 6.1 体調・疲労時のディロード

session 記録に明示的なディロード事例なし。**暫定ルール**:

- `condition ≤ 2`: 重量 -2.5kg または sets を 3 → 2 に削減（オーナー裁量）
- 1セッションで判定せず、2回連続 condition ≤ 2 で適用

このセクションは実例が出てきたら追記。Calendar 連携実装側では「`condition ≤ 2` 入力時はディロード推奨をフラグで返す」程度に留める。

### 6.2 怪我復帰

session 記録に事例なし（5/5 ダンベルプレス「左肩やや違和感」は予防的記録に留まる）。怪我による休止 → 復帰のフローは実例が出るまで判断保留。

### 6.3 完全新規種目の初回重量

オーナーが都度判断。本ルールは「PR 履歴がある種目の進行」に限定。新規種目の初期 PR 登録手順は [[../prompts/training-log-session#3-b-種目マスタ更新|prompts/training-log-session §3-B]] 参照。

### 6.4 ルーティン外日（追加・振替）

routine 外日の「追加」種目は本ルール対象外。振替実施（火の routine を別日に実施等）は本ルール適用可。

## 7. Calendar 連携実装の I/F

実装側がこのファイルを参照して機械的に「次回の目安」を算出するための関数シグネチャ（疑似コード、TypeScript 風）。

```typescript
type ExerciseInput = {
  exercise_canonical: string;
  bodyweight: boolean;
  last_session: {
    weight_kg: number | null;       // 自重なら null
    reps: number[];                 // セット毎の reps
    target_reps: number;
    target_sets: number;
    all_sets_target_hit: boolean;
  };
  exercise_master: {
    pr_weight: number;
    pr_reps: number;
    pr_date: string;                // YYYY-MM-DD
  };
  recent_tie_count: number;         // PR タイ連続回数
  recent_regression_count: number;  // rep 後退連続回数
  condition: number | null;         // 1-5 or null
};

type Suggestion = {
  weight_kg: number | null;
  reps: number;
  sets: number;
  action_type:
    | "rep+1" | "weight+2.5" | "weight+1.0" | "weight+0.5"
    | "maintain" | "rollback-weight" | "deload-weight" | "deload-sets"
    | "breakthrough-weight+2.5"
    | "added-load-bodyweight";
  rationale: string;
};

type SuggestionOutput = {
  recommended: Suggestion[];        // 1-2件（二択ありの場合 2件）
  maintenance: Suggestion;          // 「同条件維持」案を常に併記
  deload: Suggestion | null;        // condition低時のみ
  notes: string[];                  // 「PR タイ N回連続」等の補足
};

function suggestNextSession(input: ExerciseInput): SuggestionOutput;
```

### 入出力例

**例 1: 全セット到達 + 新規 PR**
- 入力: ダンベルプレス, last 36kg×[11,11,11], target 11, PR 36×10, tie=0, regress=0
- 出力: recommended = [+1rep (36kg×12), +2.5kg (38.5kg×11)], maintenance = (36kg×11)

**例 2: PR タイ 3回連続**
- 入力: ベントオーバーロー, last 36kg×[11,11,11], target 11, PR 36×11, tie=3, regress=0
- 出力: recommended = [+2.5kg ブレイクスルー (38.5kg×11)], maintenance = (36kg×11), notes = ["PR タイ 3回連続 → ブレイクスルー試行フェーズ"]

**例 3: PR 後退 1回目**
- 入力: ブルガリアン, last 44kg×[10,10,10], target 11, PR 44×11, tie=0, regress=1
- 出力: recommended = [同条件再挑戦 (44kg×11)], notes = ["1セッションだけでトレンド判定しない"]

**例 4: 自重 + 全セット到達**
- 入力: ディップス, last 自重×[11,11,11], target 11, PR 0/11, bodyweight=true, tie=0, regress=0
- 出力: recommended = [+1rep (自重×12), +加重 (2.5kg×11)], action_type = "rep+1" / "added-load-bodyweight"

## 8. 更新ルール

- 本ファイルは SSoT。決定木・細則の改訂時は Plan Preview 必須
- 観察ルールが新しく見つかったら §6 未確定領域から §3-5 本編へ昇格
- Calendar 連携実装が本ルールから乖離した動作をしたら、まずこのファイルを参照して仕様確認
- routines.md の `default_reps` / `default_weight_kg` 更新時は本ルールの「目標値」定義との整合をチェック

## 関連ノート

- [[routines]] - routine 定義（種目構成・default 値の SSoT）
- [[../prompts/training-log-session]] - 筋トレ報告セッション運用プロンプト（PR 判定3条件・ヒアリング手順）
- [[README]] - training-log 命名規則・運用フロー
- [[_index|training-log _index]] - training-log トップ
- [[workout-log-2026-04]] - 4月実績まとめ（停滞傾向の出典、本ルール導出の原データ）
- [[sessions/2026-05-09_Pull＋仕上げ]] - ベントロー +1rep ブレイクスルー初回
- [[sessions/2026-05-12_上半身push]] - +1rep 波及（ダンベルプレス / ショルダープレス）
- [[sessions/2026-05-21_脚＋体幹]] - PR 後退からの復帰実例
- [[sessions/2026-05-23_Pull＋仕上げ]] - PR タイ 3回連続のブレイクスルー試行宣言
