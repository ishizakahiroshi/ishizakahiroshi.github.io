# [様子見] ポートフォリオ静的サイト バグ・セキュリティ・品質監査

## context配分

| C | 種別 | 内容 | 並列 |
|---|---|---|---|
| C1 | fix | 初期把握・plan/report 骨格 | — |
| C2 | fix | バグ観点調査（app.js 描画・言語・データ整合） | [並列OK] |
| C3 | fix | セキュリティ・脆弱性観点調査（XSS / URL / secrets） | [並列OK] |
| C4 | fix | 依存・保守性観点調査 | [並列OK] |
| C5 | fix | 敵対的検証・finding 確定 | — |
| C6 | fix | 確定 finding の最小修正 | — |
| C7 | fix | 検証（tsc / ヘルパー単体）・再調査・report 完成 | — |

## 作業目的

`ishizakahiroshi.github.io`（静的 HTML+CSS+JS ポートフォリオ）を、DBなしアプリ向け監査プロンプト（`claude_ultracode_audit_db_less_app`）に従いフルループ監査する。バグ修正・安全性改善・局所保守性改善のみ。commit / build / 抜本改修は禁止。

## 対象範囲

- 対象: リポジトリ全体（特に `assets/app.js` / `assets/articles.json` / `index.html` / `work.html` / `works.html` / `articles/**`）
- 除外: なし
- 引数: 強度=ハイ / スコープ=フルループ / 観点=全部

## DBを使わない前提 / 状態管理・永続化

- DB / SQL / ORM なし（ビルドレス静的サイト）
- 永続化: `localStorage.lang`（言語）、静的 JSON（`assets/articles.json`）、外部 API（`dl-stats.../api/stats.json`）は読み取りのみ
- 表示データ本体は `assets/app.js` の定数（WORKS / EXPERIENCE / …）

## 禁止事項

- 停止禁止（判断待ちは記録してパス）
- DB前提禁止 / 抜本改修禁止（必要時は進言）
- 現行機能変更禁止（バグ修正の範囲で維持）
- ビルド禁止 / git commit・push・tag 禁止 / ブランチ操作禁止

## 現行機能維持の確認観点

- トップ / works 一覧 / work 詳細の描画
- JA/EN 切替と localStorage 保持
- articles 検索・タブ・ページング
- dl-stats による stars / DL 上書き
- メールボタンは contactEmail=null の間は非表示

## TODO

- [x] C1 初期把握
- [x] C2–C4 調査
- [x] C5 敵対的検証
- [x] C6 修正
- [x] C7 検証・report

## finding 一覧

| ID | 観点 | 重大度 | 確信度 | 対象 | 問題 | 再現 | ステータス | カテゴリ | +N |
|---|---|---|---|---|---|---|---|---|---|
| F01 | バグ | high | high | `getLang` | 未保存時の三項演算子が `ja:ja` で常に日本語 | 初回訪問・localStorage 無し・`navigator.language` が en でも JA 表示 | 確定→修正済 | バグ・ロジック | +4 |
| F02 | バグ | medium | high | `SKILLS` + `renderCanDo` | `en: "<1 yr"` が innerHTML に生挿しされ `<` がタグ解釈 | EN で Tech Stack「1年未満」帯の ylabel が壊れる | 確定→修正済（escapeHtml） | バグ・境界 | +2 |
| F03 | セキュリティ | medium | high | 全 innerHTML 挿入口 | HTML エスケープ無し。作者管理データでも `&`/`<` で破損。articles.json 汚染時は XSS 面 | 文言に特殊文字 / 将来 JSON 汚染 | 確定→修正済 | injection | +2 |
| F04 | セキュリティ | medium | high | article / work リンク | `href` に URL 検証無し（`javascript:` 等） | articles.json や WORKS に危険 scheme | 確定→修正済（safeUrl） | injection | +2 |
| F05 | バグ | low | high | 記事 HTML | `__NOTE_URL_TBD__` が実リンクとして公開 | declined-obsidian の note ボタン | 確定→修正済 | バグ・境界 | +1 |
| F06 | 保守性 | low | high | `fillTemplate` / `dlStatsCache` | 定義・書込のみで参照ゼロ | 静的確認 | 確定→削除済 | 死コード | +1 |
| F07 | 保守性 | low | high | I18N | `latest.*` / `cta.stats.*` / `works.count` / `hero.sub` 等未使用キー | 静的確認 | 判断待ち（削除は挙動非影響・差分大） | — | 0 |
| F08 | セキュリティ | low | medium | HTML | CSP / Referrer-Policy 等の meta・ヘッダ無し（GitHub Pages 制約） | ブラウザ開発者ツール | 進言 | — | 0 |
| F09 | 検証 | medium | high | リポジトリ | 自動テスト無し。型は tsc --checkJs 可 | README 記載 | 進言（検証は tsc 実行） | 検証カバレッジ | 未減点対象外扱い: 採点で減点 |

### 却下 / 誤検出

| ID | 内容 | 却下理由 |
|---|---|---|
| X01 | Cloudflare Analytics token が secrets 漏洩 | 公開サイトの beacon 用クライアント側トークン。秘密情報ではない |
| X02 | orphan `articles/2026-06-21-*` が死リンク残骸 | meta refresh の正規リダイレクトスタブ。意図的 |
| X03 | innerHTML 全面使用 = 即 XSS | データは同リポの静的定数中心。外部入力は articles.json と dl-stats 数値（typeof 検査済）。防御は F03/F04 で十分 |

## 確認済みルール

- このリポジトリではビルドレス（素の HTML/CSS/JS）を意図的に採用し、依存マニフェストが無い
- 表示データの正本は `assets/app.js` 定数と `assets/articles.json`
- 外部 API は dl-stats の読み取りのみ。数値フィールドは `typeof === "number"` で受け入れる
- `localStorage` に保存するのは言語コード `"ja"|"en"` のみ
- 旧 companion パス `articles/YYYY-MM-DD-slug/` は year 配下へのリダイレクトスタブとして残す
- 記事描画の本文テキストは `textContent`、pill ラベル等の一部のみ innerHTML（修正後は escape 済）

## 実施した修正

1. `getLang` の非日本語分岐を `"en"` に修正
2. `escapeHtml` / `escapeAttr` / `safeUrl` / `safeCssColor` を追加し、innerHTML / href / color 挿入口に適用
3. 死コード `fillTemplate` と `dlStatsCache` を削除
4. `__NOTE_URL_TBD__` 実リンクを削除（declined-obsidian）。コメント内 TBD も整理（orchestration 記事）

## 実行した検証

- `tsc --noEmit --allowJs --checkJs` on `assets/app.js` → OK
- `docs/local/_audit_verify.mjs` ヘルパー単体 → 全 PASS
- articles.json パス整合スクリプト: hero/html 欠落 0、WORKS/FEATURED 欠落 0

## 実行しなかった検証と理由

- ブラウザ E2E / ビジュアル確認: ヘッドレスブラウザ未セットアップ（手動確認を推奨）
- npm audit: package.json 無し
- ビルド: 禁止かつビルドレス

## 残課題 / 判断待ち / 進言

- 未使用 I18N キー削除（F07）— 差分が大きく挙動非影響のためパス
- CSP meta 追加（F08）— GitHub Pages では一部ヘッダ不可。meta CSP は進言
- 自動テスト導入 — 進言

## 完了条件（rubric 自己採点）

1–15 すべて充足（結果報告 md 参照）
