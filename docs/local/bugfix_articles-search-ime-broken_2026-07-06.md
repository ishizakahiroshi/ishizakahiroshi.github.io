---
type: bugfix
status: in-progress
tags: [articles, search, ime]
owner: ishizakahiroshi
review_status: draft
related: []
last_reviewed: 2026-07-06
---

# [対応中] 障害対応記録: ARTICLES 検索欄で IME 入力が1文字目以降反映されず削除もできない

## 症状

`ishizakahiroshi.github.io` トップページの ARTICLES セクション「記事を検索」入力欄で、日本語（IME）入力すると1文字目までしか反映されず、以降の入力も Backspace による削除も効かない。

再現手順:
1. https://ishizakahiroshi.github.io/#articles を開く
2. ARTICLES セクションの「記事を検索 (タイトル / 概要 / タグ)」欄をクリック
3. 日本語 IME で「ああああ」等と連続入力する
4. 1文字目確定時点で input が再生成され、以降の合成が乗らない・Backspace も無視される

影響: ARTICLES セクションの全文検索機能。IME 使用ユーザー（≒ 日本語ユーザー全員）で発生。半角英字だけなら比較的動くこともあるが、composition 中の再描画で focus/caret が飛ぶため English 入力でも取りこぼしが起きうる。

## 根本原因（root cause）

`assets/app.js:738` の `searchInput.addEventListener("input", ...)` が入力のたびに `renderArticles()` を呼び、その中の `renderArticleFilters()` が **フィルタ bar（検索 input を含む）を毎回 `removeChild` → `createElement` で作り直す**設計になっていた（`assets/app.js:700-744`）。

- input 要素が DOM から外れて新規生成されるため、IME の composition 状態がその瞬間に破棄される
- 再生成後に `document.getElementById("articles-search-input").focus()` で focus を復元しているが（`assets/app.js:985-994`）、IME 側の合成セッションはもう続いていないため、以降のキーストロークは新規合成とみなされて先頭 1 文字しか value に乗らないケースが発生する
- Backspace も input イベント → 再描画 → 新規要素なので、value 上書きのタイミングと caret 位置がずれて削除が効かないように見える

## 修正内容

`renderArticleFilters()` で bar を撤去する際、既存の検索 input 要素を退避して次の bar に再利用する。さらに `compositionstart`/`compositionend` で IME 合成中は再描画を抑止し、commit 時に一度だけ再描画する。

```javascript
// before: 毎キーで input を作り直していた
const searchInput = document.createElement("input");
searchInput.addEventListener("input", () => {
  searchQuery = searchInput.value;
  resetArticleVisibleCount();
  renderArticles(getLang());
});

// after: 既存 input を保持して再利用 + IME 合成中は再描画しない
const preservedSearchInput = existing ? existing.querySelector("#articles-search-input") : null;
const searchInput = preservedSearchInput || document.createElement("input");
if (!preservedSearchInput) {
  let composing = false;
  searchInput.addEventListener("compositionstart", () => { composing = true; });
  searchInput.addEventListener("compositionend", () => {
    composing = false;
    searchQuery = searchInput.value;
    resetArticleVisibleCount();
    renderArticles(getLang());
  });
  searchInput.addEventListener("input", () => {
    if (composing) return;
    searchQuery = searchInput.value;
    resetArticleVisibleCount();
    renderArticles(getLang());
  });
}
```

## 変更ファイル

| ファイル | 内容 |
|---|---|
| `assets/app.js` | `renderArticleFilters()` で既存検索 input 要素を退避・再利用。`compositionstart`/`compositionend` で IME 合成中の再描画を抑止 |

## 検証

- ローカルでは編集済み。GitHub Pages は main ブランチから配信されるため、**push 後にライブ反映**される
- 検証項目（push 後にライブで確認）:
  - 日本語 IME で「あああああ」等の連続入力が全て反映されること
  - Backspace で 1 文字ずつ削除できること
  - 半角英字の連続入力（例: `many-ai`）が全て反映されること
  - 入力に応じて件数フィルタが動くこと
  - 媒体タブ・タグ chip の切り替えで検索 input の値と focus が保持されること

## 備忘

- `renderArticles()` 末尾（`assets/app.js:985-994`）の focus + caret 復元コードは元要素再利用に切り替えたので実質不要だが、他の再描画経路（言語切替・タブ切替など）でも安全側に働くため残置している
- 同種の「再描画で input を破棄する」アンチパターンは、将来 React/Solid 等のフレームワークへ載せ替える際に自然に消える。それまでは「フィルタ bar 内の永続要素は退避 → 再利用」を明示的に書く方針
