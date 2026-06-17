---
type: training-session
project: health-training
date: <% tp.date.now("YYYY-MM-DD") %>
weekday: 火
routine: 上半身push
condition:
mood:
total_volume_kg: 0
status: completed
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
tags: [training-session, health, 上半身push]
---

# 筋トレ記録 {{date}} (火) - 上半身push

## 入力フォーム

> Meta Bind 有効時は下の欄がタップ入力に変わる。frontmatter に直接書き込まれる。

- 体調(1-5): `INPUT[number:condition]`
- 気分(1-5): `INPUT[number:mood]`
- 状態: `INPUT[inlineSelect(option(completed,完了), option(partial,部分), option(skipped,スキップ)):status]`

## 種目別記録

> 前回目安をプリフィル済み。数値だけ上書きする。

### ダンベルプレス
- セット1: 36kg × 11回
- セット2: 36kg × 11回
- セット3: 36kg × 11回
- ボリューム: 36*11*3 = 1188kg
- メモ: 

### ショルダープレス
- セット1: 28kg × 11回
- セット2: 28kg × 11回
- セット3: 28kg × 11回
- ボリューム: 28*11*3 = 924kg
- メモ: 

### ベントオーバーロー
- セット1: 36kg × 11回
- セット2: 36kg × 11回
- セット3: 36kg × 11回
- ボリューム: 36*11*3 = 1188kg
- メモ: 

### ライイングリアレイズ
- セット1: 6kg × 10回
- セット2: 6kg × 10回
- セット3: 6kg × 10回
- ボリューム: 6*10*3 = 180kg
- メモ: 

## 実施しなかった種目（記録対象外）

- エアロバイク（skip 許容）

## 次回への申し送り

- 

## 関連ノート

- [[../exercises/ダンベルプレス]] / [[../exercises/ショルダープレス]] / [[../exercises/ベントオーバーロー]]
- [[_フォーム入力ガイド]] - フォーム入力の使い方
- [[../_index]] - training-log トップ
