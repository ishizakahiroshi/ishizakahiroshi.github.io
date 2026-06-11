# ishizakahiroshi — Portfolio

ishizakahiroshi のポートフォリオサイト。実務18年のシステムエンジニア（バックエンド・インフラ・AI連携）。業務委託・受注の受け皿として、企業に「これ頼める人だ」と伝えることを目的にした静的サイトです。

参考にしたデザイン: ダークなグラスモーフィズム＋カードグリッド（GitHub Pages 1枚もの）。

## 構成

| ファイル | 役割 |
|---|---|
| `index.html` | トップ（ヒーロー / Works / Experience / Can Do / About / Footer） |
| `work.html?id=<slug>` | 作品詳細ページ（1ファイルで全作品を表示） |
| `assets/style.css` | 共通スタイル（ダークグラス・グラデ背景・ホバー演出） |
| `assets/app.js` | プロフィール・作品・経歴データ ＋ 日英多言語 ＋ 描画ロジック |
| `.nojekyll` | GitHub Pages の Jekyll 処理を無効化 |

## 中身を編集する

すべての表示内容は `assets/app.js` の先頭にあるデータ定義に集約しています（DRY）。

- `PROFILE` — 名前・各種リンク（X / note / GitHub / Email）
- `WORKS` — 作品カード（`id` がそのまま見出し兼 URL スラッグ。`c` はテーマカラー、`initials` はバッジ文字、日英の `cat` / `short` / `long`、`tech`、`repo`）
- `EXPERIENCE` — 職務経歴（`current: true` で「現職」バッジ）
- `CANDO` / `STACK_CHIPS` — できること・技術スタック
- `I18N` — UI 文字列の日英辞書

作品を追加するには `WORKS` に1要素足すだけ。カードと詳細ページの両方に自動反映されます。

## 多言語

右上の `JA / EN` トグルで切替。選択は `localStorage` に保持。データは各項目に `ja` / `en` を持たせ、UI 文字列は `I18N` 辞書で管理。

## ローカル確認

ファイルを直接開いても動きますが、`work.html` のクエリ取得やフォント読込のため簡易サーバー推奨:

```powershell
python -m http.server 8000
# → http://localhost:8000/
```

## GitHub Pages 公開（後で）

1. リポジトリを作成して push
2. Settings → Pages → Source: `main` ブランチ / `/ (root)`
3. 数分後に `https://<user>.github.io/<repo>/` で公開

## 掲載方針メモ

- 報酬・稼働条件は非掲載（「業務委託・受注 受付中」のみ。商談で個別に）
- 秘匿情報はマスク済み: 在住地は「群馬・フルリモート」相当のみ、介護ブランク・報酬額・体調面は非掲載
- 連絡導線は X / note を主役にし、**生メールは HTML に置かない**（スクレイピング対策）。
  メールを足したい場合は受信専用の新規アドレスを用意し、`assets/app.js` の `PROFILE.contactEmail` を
  `["ユーザー名", "ドメイン"]` の配列で設定する。Contact のボタンが出て、クリック時に JS で
  アドレスを組み立てて表示する（素の HTML には現れない）。`null` の間はメールボタン非表示。
