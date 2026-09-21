# Reference System

Blogger の記事内における参照・相互リンク・番号管理・プレビュー・バックリンクなどを管理する JavaScript システム。

このシステムは、Blogger の XML / HTML にすべての処理を直接書き込むのではなく、機能ごとに JavaScript を分離し、`reference-bootstrap.js` から依存関係に沿って実行する構成になっている。

---

## 1. 基本方針

Reference System では、以下の2つを明確に分離する。

- **Target** — 参照される側
- **Reference** — 参照する側

基本的な関係は、

```text
Reference → Target
```

となる。

Target から Reference への逆方向リンクは **Backlink** として別機能にする。

```text
Reference → Target
Target    → Reference  ← Backlink
```

また、番号は Reference 自体ではなく **Target に所属する番号**として管理する。

そのため、同じ Target を複数回参照した場合、すべて同じ番号になる。

---

# 2. Target

Target は以下の形式で記述する。

```html
<div class="article-target"
     id="feather"
     data-type="video"
     data-label="feather">
```

必須属性：

```text
.article-target
data-type
data-label
```

### `data-type`

Target の種類を指定する。

### `data-label`

Reference から検索するときに使用する名前。

Target の識別キーは、

```text
type + ":" + label
```

で作られる。

例えば、

```html
<div class="article-target"
     data-type="fig"
     data-label="result">
```

の場合、

```text
fig:result
```

が Target Key になる。

---

# 3. Reference

Reference は以下の形式で記述する。

```html
<span class="article-ref"
      data-type="fig"
      data-ref="result"></span>
```

必須属性：

```text
.article-ref
data-type
data-ref
```

Reference は、

```text
data-type + data-ref
```

を使って Target を検索する。

例えば、

```html
<span class="article-ref"
      data-type="fig"
      data-ref="result"></span>
```

なら、

```text
fig:result
```

という Target を探す。

---

# 4. `data-type` は必須

Target と Reference の両方で `data-type` を必須とする。

例えば、

```html
<div class="article-target"
     data-label="result">
```

は無視する。

また、

```html
<span class="article-ref"
      data-ref="result"></span>
```

も無視する。

Reference の `data-type` がない場合、`data-label` や `data-ref` だけから種類を推測しない。

これは Target の種類を明確にするための重要な設計原則。

---

# 5. 現在の対応 Type

現在の `reference-core.js` では以下を使用している。

| Type | 番号種別 |
|---|---|
| `reference` | reference |
| `footnote` | footnote |
| `fig` | figure |
| `table` | table |
| `equation` | equation |
| `code` | code |
| `video` | video |
| `article` | article |
| `section` | section |

定義：

```js
const targetTypes={
  reference:{numbering:"reference"},
  footnote:{numbering:"footnote"},
  fig:{numbering:"figure"},
  table:{numbering:"table"},
  equation:{numbering:"equation"},
  code:{numbering:"code"},
  video:{numbering:"video"},
  article:{numbering:"article"},
  section:{numbering:"section"}
};
```

Type は主に **番号管理上の分類**として使用する。

Type が存在することによって、必ず Preview や SUP や Backlink が有効になるわけではない。

各機能は独立している。

---

# 6. Target の番号

番号は Target の登録時に自動的に付与される。

例えば、

```html
<div class="article-target"
     data-type="fig"
     data-label="first">
```

```html
<div class="article-target"
     data-type="fig"
     data-label="second">
```

なら、

```text
図1
図2
```

となる。

同じ Target を複数回 Reference しても番号は変わらない。

```html
<span class="article-ref"
      data-type="fig"
      data-ref="first"></span>

<span class="article-ref"
      data-type="fig"
      data-ref="first"></span>
```

どちらも、

```text
図1
```

になる。

---

# 7. Display

`reference-display.js` は Target 側に番号表示用の要素を生成する。

例えば Figure Target なら、

```text
図1.
```

などを表示する。

生成される要素：

```html
<span class="article-reference-display">
```

Display は Target に番号を表示するだけであり、リンク処理などは担当しない。

---

# 8. 表示形式

現在の表示設定は `reference-display.js` にまとめている。

主な設定：

```text
fig
図1.

table
表1.

equation
(1)

code
コード1.

video
動画1.

article
記事1.

reference
[1]

footnote
1

section
1
```

Target と Reference では必要な表示形式が異なるため、

```text
targetPrefix
targetSuffix

referencePrefix
referenceSuffix
```

を分けて管理する。

---

# 9. Layout

特殊な Target の表示位置を調整する。

現在の Layout：

```text
reference-layout-fig.js
reference-layout-table.js
reference-layout-equation.js
reference-layout-code.js
reference-layout-video.js
```

Layout は Display が作成した、

```html
.article-reference-display
```

を適切な場所へ移動する。

例えば、

- Figure → キャプション付近
- Table → キャプション付近
- Equation → 数式の横
- Code → コードタイトル付近
- Video → 動画タイトル付近

など。

重要なのは、

> Layout 自体が番号を作るわけではない。

番号は Core / Display が管理し、Layout は表示位置だけを担当する。

---

# 10. Link

`reference-link.js` は Reference を Target へのリンクに変換する。

例えば、

```html
<span class="article-ref"
      data-type="fig"
      data-ref="result"></span>
```

が、

```text
図1
```

というリンクになる。

基本的な方向は、

```text
Reference → Target
```

である。

Link は番号の管理を行わない。

Core が解決した Target と番号を利用するだけ。

---

# 11. SUP

`reference-sup.js` は Reference に、

```html
data-sup="true"
```

が指定されている場合に SUP 表示を適用する。

例：

```html
<span class="article-ref"
      data-type="reference"
      data-ref="source"
      data-sup="true"></span>
```

SUP は Link の後に実行する。

つまり、

```text
Core
 ↓
Display
 ↓
Layout
 ↓
Link
 ↓
SUP
```

という順番になる。

---

# 12. Preview

Preview は Reference に、

```html
data-preview="true"
```

が指定された場合に有効になる。

例：

```html
<span class="article-ref"
      data-type="fig"
      data-ref="result"
      data-preview="true"></span>
```

Preview 本体：

```text
reference-preview.js
```

は Preview の共通処理を担当する。

Type ごとの内容は Provider に分離している。

---

# 13. Preview Provider

現在の Provider：

```text
reference-preview-fig.js
reference-preview-table.js
reference-preview-equation.js
reference-preview-code.js
reference-preview-video.js
reference-preview-reference.js
reference-preview-footnote.js
reference-preview-article.js
```

ただし、

```text
reference-preview-article.js
```

は現在予約扱いであり、Article Preview Provider はまだ実装しない。

Provider は読み込み時に登録する。

概念的には、

```js
window.articleReferencePreview.register(
  "fig",
  provider
);
```

という仕組み。

Preview 本体は Type ごとの具体的な内容を知らない。

---

# 14. Preview の責務

Preview は、

1. Reference を取得
2. `data-preview="true"` を確認
3. Target を取得
4. Target Type に対応する Provider を探す
5. Provider があれば Provider に描画させる
6. Provider がなければ Generic Preview を使用

という流れ。

Preview の共通処理と Type 固有処理を分離している。

---

# 15. Backlink

Target に、

```html
data-backlink="true"
```

を指定すると Backlink が有効になる。

例：

```html
<div class="article-target"
     id="result"
     data-type="reference"
     data-label="source"
     data-backlink="true">
```

Target の下に、その Target を参照している Reference へのリンクを表示する。

概念：

```text
Reference
    ↓
 Target
    ↑
 Backlink
```

Backlink はデフォルトでは無効。

Target ごとに明示的に、

```html
data-backlink="true"
```

を指定する。

---

# 16. Backlink の番号

Backlink に表示される番号は Reference 個別の番号ではなく、Target に所属する番号。

そのため同じ Target を複数回参照している場合、

```text
[1] [1] [1]
```

のようになる。

これは意図した仕様。

番号は「参照回数」ではなく「参照先 Target の番号」を表す。

---

# 17. Error

`reference-error.js` は Core が記録したエラーを表示する。

例えば存在しない Target を Reference した場合、

```html
<span class="article-ref"
      data-type="fig"
      data-ref="not-found"></span>
```

Core は、

```text
Target not found: fig:not-found
```

をエラーとして記録する。

Core 自体はエラー表示を行わない。

```text
Core
 ↓
error state
 ↓
Reference Error
 ↓
HTML error display
```

という分離になっている。

---

# 18. Core は表示しない

非常に重要な設計原則。

`reference-core.js` は以下を直接行わない。

- `[1]` の表示
- `図1` の表示
- SUP
- Preview
- Backlink
- Error HTML
- Navigation

Core の仕事は、

```text
Target の登録
Reference の登録
Target の解決
番号管理
状態管理
エラー情報の記録
```

だけ。

これによって Core を他の機能から独立させる。

---

# 19. Navigation

Reference → Target の Navigation は、

```text
reference-navigation.js
```

が共通処理を担当する。

現在の移動位置は Target 内の、

```html
.article-reference-display
```

を基準とする。

画面上部から約 25% の位置に Target の番号表示が来るようにスクロールする。

```js
const rect =
  element.getBoundingClientRect();

const targetPosition =
  window.pageYOffset +
  rect.top -
  (window.innerHeight * 0.25);
```

スクロールは Smooth Scroll。

---

# 20. Navigation Binding

`reference-navigation-binding.js` は Reference 側のリンクに Navigation を接続する。

つまり、

```text
Reference Link
      ↓
Navigation Binding
      ↓
Navigation
      ↓
Target Display
```

という構造。

Navigation 本体と Link 本体を分離している。

---

# 21. Backlink Navigation

`reference-backlink-navigation.js` は Backlink から Reference への Navigation を担当する。

```text
Backlink
   ↓
Backlink Navigation
   ↓
Navigation
   ↓
Reference
```

通常の Reference → Target と同じ Navigation 処理を共有する。

別のスクロール処理を作らない。

---

# 22. Bootstrap

Reference System の初期化は、

```text
reference-bootstrap.js
```

が担当する。

各モジュールがそれぞれ `DOMContentLoaded` を監視するのではなく、Bootstrap が実行順を管理する。

現在の実行順：

```text
1.  Reference Core

2.  Reference Display

3.  Reference Layout Fig
4.  Reference Layout Table
5.  Reference Layout Equation
6.  Reference Layout Code
7.  Reference Layout Video

8.  Reference Link

9.  Reference Sup

10. Reference Backlink

11. Reference Error

12. Reference Preview

13. Reference Navigation Binding

14. Reference Backlink Navigation
```

この順番には依存関係上の意味がある。

---

# 23. Bootstrap の依存関係

基本的な依存関係：

```text
Core
 │
 ├── Display
 │     │
 │     └── Layout
 │
 ├── Link
 │     └── SUP
 │
 ├── Backlink
 │     └── Backlink Navigation
 │
 ├── Error
 │
 └── Preview
       └── Preview Provider
```

Navigation は共通処理として独立している。

---

# 24. Module API

各モジュールは必要に応じて、

```js
window.articleSomething = {
  process: buildSomething
};
```

という API を公開する。

Bootstrap は、

```js
module.process();
```

で各モジュールを起動する。

これにより、各ファイルが自分自身で初期化タイミングを決める必要がなくなる。

---

# 25. Event

各モジュールでは将来的な動的再構築などに利用できるよう、一部の CustomEvent を残している。

代表例：

```text
articleReferencesReady
articleReferenceLinksReady
articleReferenceSupReady
articleReferencePreviewsReady
articleReferenceBacklinksReady
articleReferenceErrorsReady
articleReferenceBootstrapReady
```

ただし、通常の初期化については Event 依存ではなく、

```text
reference-bootstrap.js
```

による直接実行を基本とする。

---

# 26. DOMContentLoaded

Reference System の各モジュールは、Bootstrap によって起動される。

そのため、各モジュール自身が、

```js
document.addEventListener(
  "DOMContentLoaded",
  ...
);
```

で起動する構造にはしない。

`DOMContentLoaded` を監視するのは、

```text
reference-bootstrap.js
```

だけ。

---

# 27. ファイル構成

現在の Reference フォルダ：

```text
reference/
│
├─ README.md
│
├─ reference-core.js
├─ reference-display.js
│
├─ reference-layout-fig.js
├─ reference-layout-table.js
├─ reference-layout-equation.js
├─ reference-layout-code.js
├─ reference-layout-video.js
│
├─ reference-link.js
├─ reference-sup.js
├─ reference-backlink.js
├─ reference-error.js
│
├─ reference-preview.js
├─ reference-preview-fig.js
├─ reference-preview-table.js
├─ reference-preview-equation.js
├─ reference-preview-code.js
├─ reference-preview-video.js
├─ reference-preview-reference.js
├─ reference-preview-footnote.js
├─ reference-preview-article.js
│
├─ reference-navigation.js
├─ reference-navigation-binding.js
├─ reference-backlink-navigation.js
│
└─ reference-bootstrap.js
```

---

# 28. Blogger からの読み込み

GitHub Pages に配置した Reference System は、Blogger 側から外部 JavaScript として読み込む。

例：

```html
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-core.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-display.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-layout-fig.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-layout-table.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-layout-equation.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-layout-code.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-layout-video.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-link.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-sup.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-backlink.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-error.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-fig.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-table.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-equation.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-code.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-video.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-reference.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-preview-footnote.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-navigation.js?v=1'></script>
<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-navigation-binding.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-backlink-navigation.js?v=1'></script>

<script src='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/js/reference/reference-bootstrap.js?v=1'></script>
```

読み込み順は重要。

特に、

```text
Core
 ↓
各 Module
 ↓
Bootstrap
```

の順番を維持する。

---

# 29. CSS

Reference System の CSS は JavaScript とは分離する。

現在の外部 CSS：

```text
css/reference.css
```

Blogger からは例えば、

```html
<link href='https://hamaguriasari082525.github.io/google-blogger-wiki-like-theme-v1/css/reference.css?v=2' rel='stylesheet'/>
```

として読み込む。

CSS に変更を加えた場合は、必要に応じて、

```text
?v=2
?v=3
?v=4
```

のようにバージョンを更新する。

これはブラウザキャッシュによる古い CSS の表示を避けるため。

---

# 30. Error の考え方

Reference の解決に失敗しても、Core は処理全体を停止しない。

例えば、

```text
fig:unknown
```

が存在しない場合、その Reference はエラーとして記録される。

他の正常な Reference は引き続き処理される。

つまり、

```text
正常な Reference → 正常に処理

異常な Reference → Error に記録・表示

システム全体 → 継続
```

という考え方。

---

# 31. 重複 Target

同じ、

```text
type:label
```

を持つ Target が複数存在する場合、最初に登録された Target を有効な Target とする。

重複した Target は Core がエラーとして記録する。

これは同一ページ内で Target を一意にするため。

---

# 32. 設計原則

この Reference System では、以下を重要な原則とする。

### 1. Core は最小限

Core はデータと状態を管理する。

### 2. 表示と処理を分離

番号表示は Display。

リンクは Link。

SUP は SUP。

Preview は Preview。

Backlink は Backlink。

Error は Error。

Navigation は Navigation。

### 3. Type に機能を持たせすぎない

`fig` だから Preview が必須、などとはしない。

必要な機能だけを属性で有効にする。

### 4. 同じ処理を複数作らない

Reference → Target と Backlink → Reference のスクロール処理は共通 Navigation を使用する。

### 5. 特殊処理は専用 Module にする

Figure / Table / Equation / Code / Video の特殊なレイアウトは、それぞれ専用 Layout にする。

### 6. Bootstrap が実行順を管理する

各 Module が勝手に初期化しない。

---

# 33. 今後の拡張

今後追加する可能性があるもの：

```text
content
appendix
```

などの新しい Type。

また、

```text
Article Preview
```

については Article Loader とのデータ共有を考慮して実装する予定。

特に Article Preview では、Article Loader が取得したデータを再利用し、同じ記事を二重 Fetch しない構造を目指す。

---

# 34. 今後の全体構成

Reference の完成後、他の機能も同じ考え方で分離する。

最終的には、

```text
bootstrap.js
│
├─ reference-bootstrap.js
│   ├─ Reference Core
│   ├─ Reference Display
│   ├─ Reference Layout
│   ├─ Reference Link
│   ├─ Reference Backlink
│   ├─ Reference Error
│   └─ Reference Navigation
│
├─ contents-bootstrap.js
│   ├─ Contents Core
│   ├─ Contents Display
│   ├─ Contents List
│   └─ Contents Navigation
│
├─ gallery-bootstrap.js
│   └─ Gallery
│
└─ article-bootstrap.js
    └─ Article Loader
```

という構成を目指す。

Reference System はその中の、

```text
reference-bootstrap.js
```

以下を担当する。

---

# 35. 現在の状態

Reference System は現在、

- Target 登録
- Reference 登録
- Type 別番号管理
- Target 表示
- Reference Link
- SUP
- Figure Layout
- Table Layout
- Equation Layout
- Code Layout
- Video Layout
- Preview
- Preview Provider
- Backlink
- Error
- Reference → Target Navigation
- Backlink → Reference Navigation
- Bootstrap による実行順管理

までを分離した状態。

現在の最優先事項は、**既存の動作を変更せずに各 JavaScript を GitHub Pages の外部ファイルへ移行すること**。

その後、Contents / Gallery / Article を同じ方式で分離する。

---

## 36. 注意事項

Reference System の構造を変更する場合、以下を勝手に統合しない。

```text
Core + Display
Core + Link
Preview + Provider
Backlink + Navigation
Error + Core
```

これらは意図的に分離されている。

また、既存の `data-type`、`data-label`、`data-ref`、`data-sup`、`data-preview`、`data-backlink` の意味を変更しない。

新しい機能を追加する場合も、既存の API と責務を維持する。

---

## 37. まとめ

Reference System の基本構造は、

```text
Target
  ↑
  │
Reference
```

を中心として、

```text
Core
 │
 ├─ Display
 ├─ Layout
 ├─ Link
 ├─ SUP
 ├─ Preview
 ├─ Backlink
 ├─ Error
 └─ Navigation
```

という独立した Module 群で構成される。

そして、

```text
reference-bootstrap.js
```

がそれらを正しい順番で起動する。

これにより、Blogger 本体の XML に Reference の内部ロジックを大量に埋め込む必要がなくなり、各機能を GitHub Pages 上の独立した JavaScript として管理できる。