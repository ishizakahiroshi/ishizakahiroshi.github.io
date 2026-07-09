# 監査結果報告: ishizakahiroshi.github.io（DBなし静的サイト）

実施日: 2026-07-10(金)  
プロンプト: `claude_ultracode_audit_db_less_app.md`（強度=ハイ / スコープ=フルループ / 観点=全部）  
判定: package.json / SQL / ORM 無し → **db_less_app**

## 総合評価: 84 / 100  [A]

| カテゴリ | スコア | 評価 | サブ項目（スコア） | 減点理由 → クリア条件 |
|---|---|---|---|---|
| セキュリティ・脆弱性 | 28 / 30 | S | injection 8/10, 認証認可 8/8, secrets 6/6, CVE 6/6 | 修正前の XSS 面・URL 未検証を修正済。CSP 未整備は残（進言・採点外 low） |
| バグ・正確性 | 21 / 25 | A | ロジック 10/12, 例外 8/8, 境界 3/5 | F01 getLang 修正済(+4 相当を既反映)。境界の残リスクは記事 TBD 系の運用 |
| 依存関係 | 15 / 15 | S | アプリ依存 9/9, ランタイム 6/6 | アプリ依存ゼロ（ビルドレス）。ランタイムはブラウザのみ |
| 保守性 | 13 / 15 | A | 重複 5/5, 複雑度 5/5, テスト容易性 3/5 | 死コード削除済。未使用 I18N とテスト容易性は残 |
| 検証カバレッジ | 7 / 15 | D | テスト 0/7, 型・lint 7/8 | 自動テスト無し。tsc --checkJs は README 通り実行可・今回 OK |

判断待ち（未採点）: 1 件（F07 未使用 I18N 削除）  
評価バッジ: S=90+ / A=75+ / B=60+ / C=40+ / D=40未満

※ スコアは自動検出ベースの目安。人間レビュー後に変動しうる。  
※ 上表は **修正適用後** の現状スコア。修正前はおおよそ 74 前後（getLang / 非エスケープ / TBD リンクで追加減点）。

---

## 実施した調査

- エントリ: `index.html` / `work.html` / `works.html` → `assets/app.js` + `assets/style.css` + `assets/articles.json`
- データ経路: WORKS 定数、articles.json fetch、dl-stats 外部 API
- 永続化: `localStorage.lang` のみ
- 整合: WORKS 17 件・FEATURED 9 件すべて存在、articles 57 件の hero/html パス欠落 0
- 旧 URL スタブ 2 件は year 配下への meta refresh（意図的）

## 確定 finding 一覧（重大度 × 上がる点数 降順・修正後）

### F01 [high / 確信度 high] getLang が常に ja — **修正済** (+4 ロジック)

- 対象: `assets/app.js` `getLang`
- 再現: localStorage 未設定 + `navigator.language` が `en-US` でも UI が日本語
- 原因: `? "ja" : "ja"` のコピペミス
- 対処: 非日本語を `"en"` に
- 確認: コード差分 + 文字列検査

### F02 [medium / high] EN スキル年数 `<1 yr` が HTML として解釈 — **修正済** (+2 境界)

- 対象: `SKILLS` + `renderCanDo` innerHTML
- 再現: EN 表示で Tech Stack 最下行の ylabel が欠落・崩れ
- 対処: `escapeHtml` を適用（文言変更なし）

### F03 [medium / high] innerHTML 全体の非エスケープ — **修正済** (+2 injection)

- カード / 経歴 / CanDo / Stats / Contact / Persona / Detail のテキスト挿入口
- 対処: `escapeHtml` / `escapeAttr`

### F04 [medium / high] URL scheme 未検証 — **修正済** (+2 injection)

- articles リンク・repo/store/live・hero/shots
- 対処: `safeUrl`（http(s) / 相対 / # のみ。javascript: data: 拒否、`..` 拒否）
- 色: `safeCssColor`（hex のみ）

### F05 [low / high] `__NOTE_URL_TBD__` 公開リンク — **修正済** (+1 境界)

- `articles/2026/2026-07-02_declined-obsidian-for-now/index.html` の note ボタンを削除
- orchestration 記事のコメント内 TBD も掃除

### F06 [low / high] 死コード — **修正済** (+1 死コード)

- `fillTemplate`（定義のみ未使用）
- `dlStatsCache`（書込のみ未読）

## 今回の実装内容 / 変更ファイル

| ファイル | 内容 |
|---|---|
| `assets/app.js` | getLang 修正、escape/safe ヘルパー、描画全般の安全化、死コード削除 |
| `articles/2026/2026-07-02_declined-obsidian-for-now/index.html` | 壊れた note リンク削除 |
| `articles/2026/2026-07-06_many-ai-cli-orchestration-and-providers-v040/index.html` | TBD コメント整理 |
| `docs/local/plan_bug_security_quality_audit.md` | 監査 plan |
| `docs/local/report_bug_security_quality_audit_2026-07-10.md` | 本報告 |

## 実行した検証

| 検証 | 結果 |
|---|---|
| `tsc --noEmit --allowJs --checkJs` on `assets/app.js` | 成功（exit 0） |
| ヘルパー単体（escape / safeUrl / safeCssColor） | 全 PASS |
| articles / WORKS パス整合 | 欠落 0 |

## 実行しなかった検証と理由

- ブラウザ実機 E2E: 環境未整備（ユーザーによるローカル `python -m http.server` 確認を推奨）
- npm/pnpm audit: 依存マニフェスト無し
- ビルド: 禁止かつ不要（ビルドレス）

## 既存機能への影響確認

- データ構造・公開 URL・localStorage キー・API 契約は不変
- 描画はエスケープ追加のみ。通常テキスト（`&` を含む英語 copy 等）は正しく実体参照化されて表示される
- 相対画像 path（将来の `works/...` shots）は safeUrl で許可

## DBを使わない前提

維持。DB 導入・SQL・migration なし。

## 対処手順（優先順・実務）※適用判断は人間

1. **今回の差分をレビューして commit**（AI は commit していない）
2. ローカルで `python -m http.server 8000` → 初回 en ブラウザ / シークレットで言語既定が EN になること、Tech Stack EN の `<1 yr` 表示、記事一覧・詳細・works を目視
3. （任意）未使用 I18N キー削除 — 影響ゼロだが差分が大きいので別 PR 推奨
4. （任意）GitHub Pages + Cloudflare 等で CSP / Referrer-Policy を付与
5. （任意）描画ヘルパーの最小ユニットテストを node で常設

## 未完了項目

- ブラウザ目視確認（ユーザー側）
- 未使用 I18N 一括削除（判断待ち）

## 判断待ち事項

| 対象 | 内容 | 理由 | 実装した場合のリスク | 推奨 | 今回パス理由 |
|---|---|---|---|---|---|
| I18N 死キー群 | `latest.*` `cta.stats.*` 等削除 | 挙動非影響だが差分大 | 将来復活予定のキーを消す可能性 | 別コミットで削除 | 監査の最小修正優先 |

## パスした項目

- 記事本文 HTML 全件の内容監査（分量のため構造・リンク TBD 中心）
- CSS デザイン監査（見た目変更は禁止範囲）

## 進言事項

| 対象 | 現状 | なぜ局所では不十分か | 放置リスク | 推奨方針 | 未実装理由 |
|---|---|---|---|---|---|
| CSP | meta/header 無し | GH Pages はカスタムヘッダに制限 | XSS 時の被害拡大 | Cloudflare 前段 or meta CSP 段階導入 | インフラ判断 |
| 自動テスト | 無し | 回帰が目視依存 | getLang 級の退行再発 | node 単体 + 簡易 HTML パース | スコープ外 |
| 未使用 I18N | 残置 | 可読性低下 | メンテ誤認 | 一括削除 PR | 差分大 |

## 次の推奨作業

1. 差分レビュー → ユーザーが commit
2. シークレットウィンドウで EN 既定と Tech Stack 表示を確認
3. 問題なければ Pages 反映（push）

---

## 監査の限界

本監査は自動検出であり完全ではない。確定 finding・適用済み修正も含め、本番反映前の人間レビューを前提とする。検出漏れ・誤検出があり得る。

## 末尾明記

- git commit / push / tag: **未実施**
- ビルド・コンパイル・バンドル: **未実施**
- 抜本改修・仕様変更・大規模リファクタ: **未実施**
- DB 前提の調査・修正: **持ち込んでいない**
- 判断待ちで停止せず最後まで走り切った
