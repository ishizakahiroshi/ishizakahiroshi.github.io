<!-- このファイルはプロジェクト固有ルールのみを書く。個人/グローバル AI ルール
（言語・確認スタイル・出力フォーマット等）は各 AI ツールのグローバル設定へ。
fresh public clone でも有効な内容に保つこと。 -->

# ishizakahiroshi.github.io 開発ガイド

## プロジェクト概要

<!-- TODO: 1〜2 段落で、このプロジェクトが何で、誰のためのもので、何を解決するかを書く。
README から重複してでも、AI が常時ロードして思考の前提にできる粒度で。 -->

## やらないこと（スコープ外）

<!-- TODO: 「機能追加の打診」を AI から防ぐため、明示的に切り捨てている範囲を列挙する。
例: GUI / exe 化 / 複数 DB 対応 / 自動アップデート / 多言語 UI 等。 -->

## 技術スタック

| 層 | 技術 |
|---|---|
| フロントエンド | ビルドレス HTML / CSS / JavaScript（フレームワーク・バンドラ・ビルド工程なし） |
| ホスティング | GitHub Pages（`ishizakahiroshi.github.io`・`.nojekyll` で Jekyll 無効） |
| CI | GitHub Actions（`.github/workflows/secrets-scan.yml` — layer 3 backstop） |

## ディレクトリ構成

<!-- TODO: ルート直下の主要フォルダ・ファイルを 1 行解説付きで列挙する。
詳細は別ドキュメントに譲ってよい。 -->

## 主要コマンド

<!-- TODO: 開発・テスト・ビルドのよく使うコマンドを 1 行ずつ。
例:
- 開発サーバ: `pnpm dev`
- テスト: `pnpm test`
- 型チェック: `pnpm typecheck`
-->

## AI 作業共通ルール

ビルド・コミット禁止、secrets-scan 責務、plan/bugfix/pending md の作成ルール等の AI 作業共通ルールは、各利用者のグローバル AI 設定に従う（作者環境の例: `~/.claude/CLAUDE.md` および `~/.claude/guides/`）。

<!-- このリポジトリ固有のルールがあれば以下に箇条書きで追記する。
例: スコープを絞る方針、安全側のデフォルト、テストの最低ライン、PII 取扱い等 -->

## secrets-scan（このリポジトリの配線）

書く瞬間の責務（固有名詞の一般化・fixture は合成データ等）は上記「AI 作業共通ルール」の参照先に従う。このリポジトリ固有の配線は以下:

- scanner: `scripts/secrets-scan.mjs`（手動実行: `node scripts/secrets-scan.mjs --staged --block`）
- layer 2: `.githooks/pre-commit`（`core.hooksPath` 方式。有効化: `pwsh scripts/install-hooks.ps1` または `bash scripts/install-hooks.sh`）/ layer 3: `.github/workflows/secrets-scan.yml` / layer 4: release ゲート
- env (full coverage に必要・未設定なら構造 regex のみで継続): `KB_ROOT` / `FAMILY_ROOT`。設定詳細は `scripts/secrets-scan.mjs` の冒頭コメント
- 参照実装・設計詳細: `worklog-bridge` リポの `docs/local/secrets-scan-design/`（gitignored・公開しない）

## 関連ドキュメント

| 項目 | パス |
|---|---|
| ユーザー向け README | `README.md` |
| Codex/他 AI 用入口 | `AGENTS.md` |
| ローカル作業ノート（非公開） | `docs/local/`（存在する場合） |
