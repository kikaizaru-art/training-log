---
type: training-session
project: health-training
date: <% tp.date.now("YYYY-MM-DD") %>
weekday: 土
routine: Pull＋仕上げ
condition:
mood:
total_volume_kg: 0
status: completed
created: <% tp.date.now("YYYY-MM-DD") %>
updated: <% tp.date.now("YYYY-MM-DD") %>
tags: [training-session, health, Pull＋仕上げ]
---

# 筋トレ記録 {{date}} (土) - Pull＋仕上げ

## 入力フォーム

> Meta Bind 有効時は下の欄がタップ入力に変わる。frontmatter に直接書き込まれる。

- 体調(1-5): `INPUT[number:condition]`
- 気分(1-5): `INPUT[number:mood]`
- 状態: `INPUT[inlineSelect(option(completed,完了), option(partial,部分), option(skipped,スキップ)):status]`

## 種目別記録

> 前回目安をプリフィル済み。数値だけ上書きする。自重種目はボリューム計算対象外。

### ルーマニアンデッドリフト
- セット1: 64kg × 11回
- セット2: 64kg × 11回
- セット3: 64kg × 11回
- ボリューム: 64*11*3 = 2112kg
- メモ: 

### 懸垂
- セット1: 自重 × 7回
- ボリューム: 自重種目のためボリューム計算対象外
- メモ: 目標10回。フルレンジ維持で +1rep

### ゴム補助懸垂
- セット1: 自重 × 10回
- ボリューム: 自重種目のためボリューム計算対象外
- メモ: 

### ネガティヴ懸垂
- セット1: 自重 × 10回
- ボリューム: 自重種目のためボリューム計算対象外
- メモ: 

### ベントオーバーロー
- セット1: 36kg × 11回
- セット2: 36kg × 11回
- セット3: 36kg × 11回
- ボリューム: 36*11*3 = 1188kg
- メモ: 

### ディップス
- セット1: 自重 × 11回
- セット2: 自重 × 11回
- セット3: 自重 × 11回
- ボリューム: 自重種目のためボリューム計算対象外
- メモ: 

### ライイングリアレイズ
- セット1: 6kg × 10回
- セット2: 6kg × 10回
- セット3: 6kg × 10回
- ボリューム: 6*10*3 = 180kg
- メモ: 

## 次回への申し送り

- 

## 関連ノート

- [[../exercises/ルーマニアンデッドリフト]] / [[../exercises/懸垂]] / [[../exercises/ベントオーバーロー]] / [[../exercises/ディップス]]
- [[_フォーム入力ガイド]] - フォーム入力の使い方
- [[../_index]] - training-log トップ
