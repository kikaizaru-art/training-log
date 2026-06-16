# training-log を GitHub の独立リポジトリにする手順

このフォルダ（`20-Areas/health/training-log/`）を、MainVault とは別の独立した git リポジトリにし、GitHub に上げるための手順です。すべて **PC 側（PowerShell）** で実行してください。Cowork のサンドボックスからは `.git` 配下を操作できないため、git 関連はここに集約しています。

前提として、Cowork が以下を済ませています。
- このフォルダに `.gitignore` を設置
- MainVault ルートの `.gitignore` に `20-Areas/health/training-log/` を追記（追跡解除はステップ2で確定）

---

## 事前: Obsidian を一度閉じる

ファイル監視やロックの干渉を避けるため、作業中は Obsidian を終了しておくと安全です。

---

## ステップ1: 中途半端な .git を掃除する

Cowork が検証中に作った壊れた `.git` がこのフォルダに残っています。先に消します。

```powershell
cd C:\Users\kikai\MainVault\20-Areas\health\training-log
Remove-Item -Recurse -Force .git
```

---

## ステップ2: MainVault の追跡から training-log を外す

MainVault 側の git がこのフォルダを今も追跡しています。これを解除します。ファイルは消えません、追跡だけ外れます。

まず stale な index.lock があれば消します（約19日前のものが残っています）。

```powershell
cd C:\Users\kikai\MainVault
Remove-Item -Force .git\index.lock -ErrorAction SilentlyContinue
git rm -r --cached --quiet 20-Areas/health/training-log/
git commit -m "chore: split training-log into its own repository"
```

`git commit` まで通れば、MainVault からは「training-log を追跡対象から外した」という履歴が1つ残ります。フォルダの中身はそのまま残っています。

---

## ステップ3: training-log を独立リポジトリとして初期化

```powershell
cd C:\Users\kikai\MainVault\20-Areas\health\training-log
git init -b main
git add .
git commit -m "init: training-log として独立リポジトリ化"
```

`git log --oneline` で1コミット立っていれば成功です。

---

## ステップ4: GitHub にリポジトリを作って push

### 方法A: gh CLI が入っている場合（最短）

```powershell
cd C:\Users\kikai\MainVault\20-Areas\health\training-log
gh repo create training-log --private --source=. --push
```

`--private` は非公開。公開したい場合は `--public` に変えてください。

### 方法B: ブラウザで作る場合

1. https://github.com/new を開く
2. Repository name に `training-log`、Private を選択、README や .gitignore は **追加しない**（こちらに既にあるため）
3. Create したら表示される URL を使って以下を実行

```powershell
cd C:\Users\kikai\MainVault\20-Areas\health\training-log
git remote add origin https://github.com/<あなたのユーザー名>/training-log.git
git push -u origin main
```

---

## ステップ5: Obsidian Sync の除外確認

iPhone との同期で `.git` フォルダが混入しないよう確認します。

1. Obsidian → 設定 → Sync
2. 除外設定に `.git` 系が含まれているか確認（標準では `.git` は同期対象外です）

`training-log` 内のノート自体は今まで通り Obsidian で見え、iPhone とも同期されます。変わるのは「このフォルダが独自の git 履歴を持ち、GitHub に push できる」点だけです。

---

## 以降の運用

- 筋トレ記録の追記は今まで通り Obsidian / Cowork で行えます（ファイルパスは不変）
- GitHub へ反映したいときは、このフォルダで `git add . ; git commit -m "..." ; git push`
- MainVault 側の auto-commit はこのフォルダを無視します（.gitignore 済み）

---

## 補足: 用語

- **独立リポジトリ（nested independent repository）**
    - 親フォルダ（MainVault）の git とは別に、子フォルダが自分の `.git` を持つ形です。
    - MainVault 側では `.gitignore` でこのフォルダを無視させ、二重管理の競合を防いでいます。
- **git rm --cached**
    - git の追跡対象から外す操作です。`--cached` を付けるとファイル実体は消さず、追跡だけ解除します。
