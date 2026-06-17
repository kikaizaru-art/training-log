---
type: training-session
project: health-training
date: YYYY-MM-DD
weekday: 火
routine: 上半身push
condition:
mood:
total_volume_kg: 0
status: completed
created: YYYY-MM-DD
updated: YYYY-MM-DD
tags: [training-session, health, 上半身push]
---

# 筋トレ記録 {{date}} ({{weekday}}) - {{routine}}

> 日々の記録は routine 別のプリフィル済みテンプレを使うと速い:
> [[templates/session-上半身push]] / [[templates/session-脚＋体幹]] / [[templates/session-Pull＋仕上げ]]
> フォーム入力の導入は [[templates/_フォーム入力ガイド]] 参照。

## 入力フォーム

> Meta Bind 有効時は下の欄がタップ入力に変わる（frontmatter に直接書き込み）。

- 体調(1-5): `INPUT[number:condition]`
- 気分(1-5): `INPUT[number:mood]`
- 状態: `INPUT[inlineSelect(option(completed,完了), option(partial,部分), option(skipped,スキップ)):status]`

## 種目別記録

### ダンベルプレス
- セット1: 12kg × 10回
- セット2: 12kg × 10回
- セット3: 10kg × 12回
- ボリューム: 12*10 + 12*10 + 10*12 = 360kg
- メモ: 

### （他種目）
- セット1: 
- セット2: 
- セット3: 
- ボリューム: 
- メモ: 

## セッション総括
- 総ボリューム: 
- 次回への申し送り: 

## 関連ノート

- [[exercises/_template-exercise]] - 種目マスタテンプレ
- [[templates/_フォーム入力ガイド]] - フォーム入力ガイド
- [[_index]] - training-log トップ
