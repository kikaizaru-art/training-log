---
type: area-index
area: training-log
created: 2026-05-04
updated: 2026-05-23
tags: [health, training-log, area-index, meta]
---

# Training Log インデックス

筋トレ実施記録のハブ。「筋トレMEMO」アプリ風の構造化ログを蓄積する。

## ルーティン

| 曜日 | ルーティン名 | 主要部位 |
|---|---|---|
| 火 | 上半身push | 胸・肩・三頭 |
| 木 | 脚＋体幹 | 脚・腹・背 |
| 土 | Pull＋仕上げ | 背・二頭・仕上げ |

各 routine の種目リスト・デフォルト値は [[routines]] を参照（SSoT、2026-05-23 切り出し）。

「今日は何やる？」の曜日別提示ルールは [[daily-schedule]] を参照（休養日は直近 training day の未刺激種目を提案）。

## Bases ビュー

- [[training-sessions]] — セッション記録一覧
  - 「直近4週の完了率」「月次サマリ」「ルーティン別」「未記録チェック」「全件テーブル」
- [[training-exercises]] — 種目別ベスト（PR）
  - 「PR一覧（部位別）」「最近更新」

## 構造

```
training-log/
├── _template-session.md   # セッション記録テンプレ
├── sessions/              # 各筋トレセッション（YYYY-MM-DD_routine.md）
├── exercises/             # 種目マスタ（種目名.md）
│   └── _template-exercise.md
├── training-sessions.base
└── training-exercises.base
```

## 使い方

1. 当日筋トレ後、Claude に「今日の筋トレ報告」と話しかける
2. Claude が対話で種目別ヒアリング → `sessions/YYYY-MM-DD_<routine>.md` にYAML化保存
3. PR更新があれば該当 `exercises/<種目名>.md` の `pr_*` フィールドを同時更新
4. 月末に Bases の「月次サマリ」で進捗確認

詳細は [[README]] 参照。

## 関連ノート

- [[../_index]] - health 領域トップ
- [[../routine-log/_index]] - 日常ルーティン記録
