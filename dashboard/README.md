# 筋トレログ HTML ダッシュボード

`sessions/` `exercises/` の Markdown（SSoT）を読み取って、筋トレMEMO 風のダッシュボードとして表示する単一 HTML。外部 CDN 非依存・iPhone / GitHub Pages 対応。

## 構成

```
build.mjs            # Markdown -> dashboard/data.json 変換（Node 標準のみ・依存ゼロ）
dashboard/
  index.html         # ダッシュボード本体（単一ファイル・SVGチャート内蔵）
  data.json          # build.mjs が生成（コミット済み）
  README.md          # これ
```

## 画面（タブ）

- **ダッシュボード**: 直近セッション / 月次総ボリューム / 完了率カード、総ボリューム推移、部位別 最終実施日
- **種目別**: 部位別 PR 一覧、種目を選んで重量・レップ推移グラフ
- **履歴**: セッション一覧（タップで各種目のセット詳細を展開）
- **記録する**: routine 選択 → 前回値プリフィル → 数値入力 → セッション Markdown を生成（コピー / `.md` DL）→ `sessions/` に保存してコミット

## ローカルで見る

`file://` 直開きだと `data.json` の fetch がブラウザにブロックされるため、簡易サーバ経由で開く。

```bash
node build.mjs                 # データ再生成（記録を追加・編集したら実行）
python3 -m http.server 8000    # リポジトリ直下で
# → http://localhost:8000/dashboard/ を開く
```

## GitHub Pages で公開

`.github/workflows/pages.yml` が main への push 時に `build.mjs` を実行して `dashboard/` を Pages へ公開する。リポジトリ設定 → Pages → Source を「GitHub Actions」にするだけ。公開後は iPhone のホーム画面に追加してアプリ風に使える。

## データ更新フロー

1. 記録を追加（ダッシュボードの「記録する」or Claude or 手書き）→ `sessions/*.md` に保存
2. `node build.mjs` で `data.json` を再生成（Pages 運用時は push で自動）
3. commit & push

## 関連

- [[../2026-06-17_開発プラン]] - 全体の開発プラン
- [[../README]] - スキーマ・命名規則 SSoT
