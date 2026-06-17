---
type: training-session
project: health-training
date: <% tp.date.now("YYYY-MM-DD") %>
weekday: 木
routine: 脚＋体幹
condition:
mood:
total_volume_kg: 0
status: completed
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
tags: [training-session, health, 脚＋体幹]
---

# 筋トレ記録 {{date}} (木) - 脚＋体幹

## 入力フォーム

> Meta Bind 有効時は下の欄がタップ入力に変わる。frontmatter に直接書き込まれる。

- 体調(1-5): `INPUT[number:condition]`
- 気分(1-5): `INPUT[number:mood]`
- 状態: `INPUT[inlineSelect(option(completed,完了), option(partial,部分), option(skipped,スキップ)):status]`

## 種目別記録

> 前回目安をプリフィル済み。数値だけ上書きする。

### ブルガリアンスクワット
- セット1: 44kg × 11回
- セット2: 44kg × 11回
- セット3: 44kg × 11回
- ボリューム: 44*11*3 = 1452kg
- メモ: 

### カーフレイズ
- セット1: 32kg × 16回
- セット2: 32kg × 16回
- セット3: 32kg × 16回
- ボリューム: 32*16*3 = 1536kg
- メモ: 

### プランク
- セット1: 自重 × 60回
- セット2: 自重 × 60回
- セット3: 自重 × 60回
- ボリューム: 自重種目のためボリューム計算対象外
- メモ: 「60」の単位（秒/レップ）を明記する

## 実施しなかった種目（記録対象外）

- ケトルベル（skip 許容）
- エアロバイク（skip 許容）

## 次回への申し送り

- 

## 関連ノート

- [[../exercises/ブルガリアンスクワット]] / [[../exercises/カーフレイズ]] / [[../exercises/プランク]]
- [[_フォーム入力ガイド]] - フォーム入力の使い方
- [[../_index]] - training-log トップ
