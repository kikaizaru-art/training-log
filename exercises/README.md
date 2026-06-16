---
type: readme
created: 2026-05-04
updated: 2026-05-04
tags: [health, training-log, exercises, readme, meta]
---

# Exercises ディレクトリ

種目マスタ（ベスト記録 + 履歴の集積）。

## 命名規則

`<種目名>.md`（日付プレフィックスなし、entity 扱い）

例:
- `ダンベルプレス.md`
- `ブルガリアンスクワット.md`
- `ラットプルダウン.md`

## 役割

- 種目ごとの PR（重量・回数・達成日）を frontmatter に保持
- 部位（body_part）でグルーピング可能
- セッションログから自動的に backlinks が張られる

## 作成方法

`_template-exercise.md` を雛形に、初回登場時に Claude が作成。

## 関連ノート

- [[../_index]] - training-log トップ
- [[_template-exercise]] - テンプレ
- [[../README]] - 使い方
