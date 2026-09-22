
# Reference System Cheat Sheet

Reference System の実装・記事執筆・デバッグ時に参照するための開発者向けチートシートである。

---

# 1. 基本概念

Reference System は、記事内の要素を **Target** として登録し、
本文中の **Reference** から Target を参照できるようにするシステムである。

```text
Target
  ↓
Reference Core
  ↓
Display / Layout
  ↓
Reference Link
  ↓
Navigation

Reference
  ↓
Preview
  ↓
Target の内容を表示

Target
  ↓
Backlink
  ↓
Reference へ戻る
```

Target と Reference の対応は、

```text
data-type + data-label
```

と

```text
data-type + data-ref
```

で決定される。

内部的な Target Key は、

```text
type:label
```

である。

---

# 2. Target の書き方

## 最小構造

```html
<div
  class="article-target"
  id="target-id"
  data-type="fig"
  data-label="target-label">

  ...

</div>
```

必須属性：

| 属性 | 必須 | 用途 |
|---|---:|---|
| `class="article-target"` | Yes | Target として認識 |
| `id` | Navigation 使用時に実質必須 | Link の移動先 |
| `data-type` | Yes | Target の種類 |
| `data-label` | Yes | Target の識別名 |

Target の識別キー：

```text
fig:target-label
```

---

# 3. Reference の書き方

## 最小構造

```html
<span
  class="article-ref"
  data-type="fig"
  data-ref="target-label">
</span>
```

必須属性：

| 属性 | 必須 | 用途 |
|---|---:|---|
| `class="article-ref"` | Yes | Reference として認識 |
| `data-type` | Yes | 参照する Target の種類 |
| `data-ref` | Yes | 参照する Target の `data-label` |

例えば、

```html
<div
  class="article-target"
  id="figure-result"
  data-type="fig"
  data-label="result">
</div>
```

に対して、

```html
<span
  class="article-ref"
  data-type="fig"
  data-ref="result">
</span>
```

とする。

対応する Key は、

```text
fig:result
```

である。

---

# 4. Target と Reference の基本ルール

## 同じ Type + Label

```text
fig:result
fig:result
```

は同じ Target を参照する。

複数の Reference が同じ Target を参照することができる。

---

## 同じ Label + 異なる Type

```text
fig:result
table:result
```

は別の Target である。

つまり Label は Type をまたいで一意である必要はない。

---

## 同じ Type + Label の Target を複数登録

```text
fig:result
fig:result
```

は重複 Target となる。

2 番目以降の Target は、

```text
duplicate-target
```

エラーになる。

---

# 5. Authoring Attributes

## Target

| 属性 | 読み取り主体 | 用途 |
|---|---|---|
| `data-type` | Core | Target の種類 |
| `data-label` | Core | Target の識別名 |
| `data-url` | Core | Target に関連する URL の保持 |
| `data-prefix` | Display | Target 表示の Prefix |
| `data-suffix` | Display | Target 表示の Suffix |
| `data-backlink="true"` | Backlink | Backlink を生成 |
| `data-contents-number` | Display Section | Section の表示番号を上書き |

---

## Reference

| 属性 | 読み取り主体 | 用途 |
|---|---|---|
| `data-type` | Core | 参照する Type |
| `data-ref` | Core | 参照する Target Label |
| `data-prefix` | Display | Reference 表示の Prefix |
| `data-suffix` | Display | Reference 表示の Suffix |
| `data-sup="true"` | Sup | Sup 表示 |
| `data-preview="true"` | Preview | Preview を有効化 |

---

# 6. 内部生成属性

これらは通常、記事 HTML に手動で記述しない。

| 属性 | 用途 |
|---|---|
| `data-reference-number` | Reference に割り当てられた番号 |
| `data-reference-target` | Reference が参照する Target |
| `data-reference-display-applied` | Display 処理済み |
| `data-reference-layout-applied` | Layout 処理済み |
| `data-reference-link-applied` | Link 処理済み |
| `data-reference-navigation-applied` | Navigation Binding 済み |
| `data-sup-applied` | Sup 処理済み |
| `data-backlink-applied` | Backlink 処理済み |
| `data-reference-error` | Error 表示済み |
| `data-reference-preview-content="true"` | Preview 内部 |
| `data-linked="true"` | Generated Link |
| `data-reference-id` | Backlink と Reference の対応 |

---

# 7. Target の内部 State

Core が管理する Target は概ね次の構造を持つ。

```javascript
{
  key,
  id,
  type,
  label,
  numberingType,
  number,
  element,
  url,
  references: []
}
```

意味：

| Property | 内容 |
|---|---|
| `key` | `type:label` |
| `id` | Target DOM ID |
| `type` | Target Type |
| `label` | Target Label |
| `numberingType` | Numbering Group |
| `number` | Target 番号 |
| `element` | 実際の DOM Element |
| `url` | `data-url` の値 |
| `references` | この Target を参照する Reference |

---

# 8. Numbering

番号は Reference の登場順ではなく、

**Target の DOM 順**

で決定される。

```text
Target A → 1
Target B → 2
Target C → 3
```

同じ Target を何回 Reference しても、

```text
Target A → 1
Reference → 1
Reference → 1
Reference → 1
```

となる。

---

# 9. Numbering Group

Type ごとに Numbering Group を持つ。

現在の基本設定：

| Type | Numbering Group |
|---|---|
| `fig` | `figure` |
| `table` | `table` |
| `equation` | `equation` |
| `code` | `code` |
| `video` | `video` |
| `article` | `article` |
| `reference` | `reference` |
| `footnote` | `footnote` |
| `section` | `section` |

未知の Type は、その Type 自身を Numbering Group として扱う。

---

# 10. 標準 Display

## Target

| Type | 標準表示 |
|---|---|
| `fig` | `図N. ` |
| `table` | `表N. ` |
| `equation` | `(N)` |
| `code` | `コードN. ` |
| `video` | `動画N. ` |
| `article` | `記事N. ` |
| `reference` | `[N]` |
| `footnote` | Prefix / Suffix なし |
| `section` | Contents Number があればそれ |
| unknown | Prefix / Suffix なし |

## Reference

| Type | 標準表示 |
|---|---|
| `fig` | `図N` |
| `table` | `表N` |
| `equation` | `式(N)` |
| `code` | `コードN` |
| `video` | `動画N` |
| `article` | `記事N` |
| `reference` | `[N]` |
| `footnote` | Prefix / Suffix なし |
| `section` | Contents Number があればそれ |
| unknown | Prefix / Suffix なし |

---

# 11. Prefix / Suffix

Target または Reference に、

```html
data-prefix="..."
data-suffix="..."
```

を指定できる。

例えば、

```html
<div
  class="article-target"
  data-type="reference"
  data-label="result"
  data-prefix="参考資料 "
  data-suffix=" を参照">
</div>
```

とする。

Reference 側にも指定できる。

Target / Reference の個別指定が標準設定より優先される。

---

# 12. Core

ファイル：

```text
reference-core.js
```

責務：

- Target 登録
- Reference 登録
- Numbering
- Target / Reference 対応付け
- Error Registry
- State 管理

Public API：

```javascript
articleReferenceCore.process()

articleReferenceCore.getTarget(
  "fig:test-figure"
)

articleReferenceCore.getReferences()

articleReferenceCore.getErrors()

articleReferenceCore.getState()
```

---

# 13. Display

ファイル：

```text
reference-display.js
```

責務：

- Target Display
- Reference Display
- Prefix / Suffix
- Type ごとの標準表示

Public API：

```javascript
articleReferenceDisplay.process()

articleReferenceDisplay.getTargetLabel(
  target
)

articleReferenceDisplay.getReferenceLabel(
  reference
)

articleReferenceDisplay.getConfig()
```

---

# 14. Layout

各コンポーネント専用の Layout Module がある。

```text
reference-layout-fig.js
reference-layout-table.js
reference-layout-equation.js
reference-layout-code.js
reference-layout-video.js
reference-layout-article.js
```

Layout の責務は、

**Reference Display を実際の Component の適切な場所へ移動すること**

である。

---

## Figure

Display を、

```text
figcaption
```

の先頭へ配置する。

---

## Table

Display を、

```text
.article-table-title
```

の先頭へ配置する。

---

## Equation

Display を、

```text
.article-equation
```

へ配置する。

---

## Code

Display を、

```text
.article-code-title
```

の先頭へ配置する。

---

## Video

Display を、

```text
.article-video-title
```

の先頭へ配置する。

---

## Article

Display を、

```text
.article-card-title
```

へ配置する。

Article Layout は `.article-card` と `.article-card-title` が既に存在することを前提とする。

---

# 15. Link

ファイル：

```text
reference-link.js
```

責務：

Reference を実際の Anchor に変換する。

生成例：

```html
<a
  class="article-reference-link"
  href="#test-figure"
  data-linked="true">

  図1

</a>
```

生成された Reference には、

```text
article-reference-N
```

形式の ID が付与される。

---

# 16. Navigation

ファイル：

```text
reference-navigation.js
reference-backlink-navigation.js
```

## Reference → Target

Reference Link をクリックすると Target へ移動する。

```javascript
articleReferenceNavigation.navigate(
  element
)
```

Smooth Scroll を使用する。

---

## Backlink → Reference

Backlink をクリックすると、元の Reference へ移動する。

---

# 17. Sup

ファイル：

```text
reference-sup.js
```

Reference に、

```html
data-sup="true"
```

を指定すると、

```text
.article-reference-link
```

に Sup 用 Class が付与される。

生成 Class：

```text
article-reference-sup
```

---

# 18. Backlink

ファイル：

```text
reference-backlink.js
```

Target に、

```html
data-backlink="true"
```

を指定すると Backlink を生成する。

生成構造：

```html
<span class="article-reference-backlinks">

  <a
    class="article-reference-backlink"
    href="#article-reference-1"
    data-reference-id="article-reference-1">
    [1]
  </a>

</span>
```

Backlink は Target を参照している Reference ごとに生成される。

---

## Backlink を一か所だけにしたい場合

Backlink を付けたい Target にだけ、

```html
data-backlink="true"
```

を指定する。

複数 Target に指定すると、それぞれに Backlink が生成される。

---

# 19. Error

ファイル：

```text
reference-error.js
```

現在の主要 Error：

```text
duplicate-target
target-not-found
```

## duplicate-target

同じ、

```text
type:label
```

を持つ Target が複数存在する。

---

## target-not-found

Reference に対応する Target が存在しない。

例：

```html
<span
  class="article-ref"
  data-type="fig"
  data-ref="does-not-exist">
</span>
```

---

# 20. Preview

ファイル：

```text
reference-preview.js
```

Reference に、

```html
data-preview="true"
```

を指定すると Preview が有効になる。

Preview DOM：

```html
<span class="article-reference-preview">

  <span
    class="article-reference-preview-content"
    data-reference-preview-content="true">

    ...

  </span>

</span>
```

Preview 内部では、元の Reference Navigation が再実行されないようにリンクなどを無効化する。

---

# 21. Preview Provider

Type ごとの Preview は Provider によって生成する。

現在の Provider：

```text
reference-preview-article.js
reference-preview-code.js
reference-preview-equation.js
reference-preview-fig.js
reference-preview-footnote.js
reference-preview-reference.js
reference-preview-section.js
reference-preview-table.js
reference-preview-video.js
```

---

## Provider の基本 API

```javascript
articleReferencePreview.register(
  type,
  provider
)
```

新しい Type に専用 Preview が必要な場合は Provider を追加する。

---

# 22. Section Preview

Section Target は、

```html
<h3
  class="article-target"
  data-type="section"
  data-label="section-a">

  Section Title

</h3>
```

のように見出しそのものを Target にする。

Section Preview は Target の見出しから、

```text
同じ階層以上の次の見出し
```

までを Section として取得する。

したがって Section Target の中に本文を入れるのではなく、

```html
<h3 class="article-target" ...>
  Section
</h3>

<p>
  Section body
</p>

<p>
  Section body
</p>

<h4>
  Child Section
</h4>
```

という構造にする。

---

# 23. Section Contents Number

Section Target に、

```html
data-contents-number="9.9"
```

を指定できる。

これは **表示文字列のみを変更する**。

内部の Target Number 自体は変更しない。

つまり、

```text
internal number = 3
display number  = 9.9
```

という状態が可能である。

---

# 24. Article Integration

Article は Reference System 単独では Card を生成しない。

処理は次の順番である。

```text
article-embed
      ↓
Article Display
      ↓
.article-card
      ↓
Article Loader
      ↓
記事データ
      ↓
Article Card に setData()
      ↓
Reference Article Layout / Preview
```

---

# 25. Article Embed の注意

Article Embed は、

```html
<article-embed
  url="https://example.com/article">
</article-embed>
```

とする。

ここで使用する属性は、

```text
url
```

である。

これは Reference Target の、

```text
data-url
```

とは別物である。

---

## Article Display が読むもの

```javascript
embed.getAttribute('url')
```

したがって、

```html
<article-embed data-url="...">
```

では Article Display が URL を取得できない。

---

# 26. Article Card

ファイル：

```text
article-card.js
```

生成される基本構造：

```html
<div class="article-card">

  <div class="article-card-header">

    <a class="article-card-title">
      ...
    </a>

  </div>

  <div class="article-card-body">
    ...
  </div>

</div>
```

主要 API：

```javascript
articleCard.create()

articleCard.setData(
  card,
  data
)
```

---

# 27. Article Display

ファイル：

```text
article-display.js
```

責務：

1. `article-embed` を検索
2. `url` を取得
3. Article Card を生成
4. `article-embed` を Card に置換
5. Article Loader からデータを取得
6. Article Card にデータを設定

つまり、

```text
Card の生成
```

と、

```text
記事データの取得
```

は別処理である。

---

# 28. Bootstrap

ファイル：

```text
reference-bootstrap.js
```

Reference System 全体を初期化する。

処理順：

```text
1.  Core
2.  Display
3.  Layout Figure
4.  Layout Table
5.  Layout Equation
6.  Layout Code
7.  Layout Video
8.  Layout Article
9.  Link
10. Sup
11. Backlink
12. Error
13. Preview
14. Navigation Binding
15. Backlink Navigation
16. Display Section
17. Bootstrap Ready Event
```

---

# 29. Bootstrap State

```javascript
articleReferenceBootstrap.getState()
```

State：

```javascript
{
  started: false,
  ready: false
}
```

初期化が完了すると、

```javascript
ready === true
```

になる。

---

# 30. Events

Reference System が発行する主要 Event：

```text
articleReferencesReady
articleReferenceLinksReady
articleReferenceSupReady
articleReferenceBacklinksReady
articleReferenceErrorsReady
articleReferencePreviewsReady
articleReferenceBootstrapReady
```

最終的な初期化完了を待つ場合は、

```javascript
window.addEventListener(
  'articleReferenceBootstrapReady',
  function () {
    // Reference System ready
  }
)
```

を使用できる。

---

# 31. Public API 一覧

## Core

```javascript
articleReferenceCore.process()

articleReferenceCore.getTarget(key)

articleReferenceCore.getReferences()

articleReferenceCore.getErrors()

articleReferenceCore.getState()
```

## Display

```javascript
articleReferenceDisplay.process()

articleReferenceDisplay.getTargetLabel(target)

articleReferenceDisplay.getReferenceLabel(reference)

articleReferenceDisplay.getConfig()
```

## Navigation

```javascript
articleReferenceNavigation.navigate(element)
```

## Preview

```javascript
articleReferencePreview.register(
  type,
  provider
)

articleReferencePreview.process()
```

## Bootstrap

```javascript
articleReferenceBootstrap.process()

articleReferenceBootstrap.getState()
```

---

# 32. 新しい Type を追加する場合

新しい Type、例えば、

```text
audio
```

を追加する場合は、最低限次を確認する。

---

## Step 1 — Type を定義

Core の Numbering Group に必要なら追加する。

```javascript
audio: 'audio'
```

---

## Step 2 — Display を追加

Target と Reference の標準表示を決める。

例えば、

```text
Target    → 音声1.
Reference → 音声1
```

---

## Step 3 — Layout が必要か確認

既存 Component の内部に Display を配置する必要があるなら、

```text
reference-layout-audio.js
```

を作る。

---

## Step 4 — Preview が必要か確認

Preview が必要なら、

```text
reference-preview-audio.js
```

を作る。

Provider を登録する。

```javascript
articleReferencePreview.register(
  'audio',
  provider
)
```

---

## Step 5 — Navigation を確認

通常の Reference → Target Navigation がそのまま使えるか確認する。

特別な Navigation が必要なら専用処理を追加する。

---

## Step 6 — Backlink を確認

通常の Backlink がそのまま使用できるか確認する。

---

## Step 7 — Bootstrap に組み込む

新しい Layout がある場合は Bootstrap の適切な位置に追加する。

---

## Step 8 — Test Target を追加

最低限、

```text
Target
Reference
Display
Link
Navigation
Preview
Backlink
Error
```

を確認する。

---

# 33. 新しい Type のチェックリスト

```text
[ ] Core Numbering Group
[ ] Target registration
[ ] Reference registration
[ ] Target Display
[ ] Reference Display
[ ] Prefix / Suffix
[ ] Layout
[ ] Reference Link
[ ] Navigation
[ ] Preview Provider
[ ] Backlink
[ ] Error handling
[ ] Bootstrap
[ ] Test Target
[ ] Test Reference
[ ] Multiple Reference
[ ] Preview
[ ] Backlink
[ ] Mobile / responsive CSS
```

---

# 34. 新しい Component を Reference 対応させる場合

既存 Component に Reference System を対応させる場合は、

```text
1. Target HTML
2. Target Display の配置場所
3. Reference Display
4. Layout Module
5. Preview Provider
6. Navigation
7. Backlink
8. CSS
9. Test
```

の順に考える。

特に Layout Module では、

```text
「Reference Display をどこに置くか」
```

を明確にする。

---

# 35. Debug の基本手順

Reference が正常に動かない場合は、上流から順番に確認する。

```text
1. Target が DOM に存在するか
        ↓
2. data-type / data-label があるか
        ↓
3. Core に登録されているか
        ↓
4. Reference が存在するか
        ↓
5. Reference が Target を発見できているか
        ↓
6. Display が生成されているか
        ↓
7. Layout が適用されているか
        ↓
8. Reference Link が生成されているか
        ↓
9. Navigation が Binding されているか
        ↓
10. Preview が生成されているか
        ↓
11. Backlink が生成されているか
```

---

# 36. Core State の確認

ブラウザ Console で、

```javascript
articleReferenceCore.getState()
```

を実行する。

Target を確認：

```javascript
articleReferenceCore
  .getTarget('fig:test-figure')
```

Reference を確認：

```javascript
articleReferenceCore
  .getReferences()
```

Error を確認：

```javascript
articleReferenceCore
  .getErrors()
```

---

# 37. Article の Debug

Article が表示されない場合は、Reference System と混同しない。

まず、

```javascript
document.querySelectorAll(
  'article-embed'
)
```

を確認する。

次に、

```javascript
document.querySelectorAll(
  '.article-card'
)
```

を確認する。

Target 内だけ確認する場合：

```javascript
document
  .getElementById('test-article-a')
  ?.querySelector(
    ':scope > .article-card'
  )
```

---

## Article Debug の判断

```text
article-embed が残っている
        ↓
Article Display を確認

.article-card は存在する
        ↓
Article Loader を確認

.article-card は存在するが空
        ↓
Article Loader / setData() を確認

.article-card にデータがある
        ↓
Reference Article Layout / Preview を確認
```

---

# 38. Important Distinction

以下は別物である。

```text
Reference Target の URL
        ↓
data-url
```

と、

```text
Article Embed の URL
        ↓
url
```

Reference System は Target の `data-url` を保持できるが、
現在の Navigation や Article Loader が自動的にそれを使用するわけではない。

Article Display は、

```javascript
embed.getAttribute('url')
```

を使用する。

---

# 39. ファイル構成

Reference System の主要ファイル：

```text
reference-core.js

reference-display.js
reference-display-section.js

reference-link.js
reference-sup.js

reference-backlink.js
reference-backlink-navigation.js

reference-error.js

reference-navigation.js

reference-preview.js

reference-preview-article.js
reference-preview-code.js
reference-preview-equation.js
reference-preview-fig.js
reference-preview-footnote.js
reference-preview-reference.js
reference-preview-section.js
reference-preview-table.js
reference-preview-video.js

reference-layout-fig.js
reference-layout-table.js
reference-layout-equation.js
reference-layout-code.js
reference-layout-video.js
reference-layout-article.js

reference-bootstrap.js
```

Article 系：

```text
article-loader.js
article-display.js
article-card.js
```

---

# 40. 最小 Authoring Cheat Sheet

## Figure

```html
<div
  class="article-target"
  id="figure-id"
  data-type="fig"
  data-label="figure-label">

  <div class="article-image">

    <figure class="article-figure">

      <img src="IMAGE_URL" alt="...">

      <figcaption>

        <span class="article-figure-title">
          Figure Title
        </span>

        <span class="article-figure-caption article-image-caption">
          Figure Caption
        </span>

      </figcaption>

    </figure>

  </div>

</div>
```

Reference：

```html
<span
  class="article-ref"
  data-type="fig"
  data-ref="figure-label">
</span>
```

---

## Table

```html
<div
  class="article-target"
  id="table-id"
  data-type="table"
  data-label="table-label">

  <div class="wikitable-container">

    <div class="article-table-title">
      Table Title
    </div>

    <div class="wikitable-scroll">

      <table class="wikitable">
        ...
      </table>

    </div>

  </div>

</div>
```

Reference：

```html
<span
  class="article-ref"
  data-type="table"
  data-ref="table-label">
</span>
```

---

## Article

```html
<div
  class="article-target"
  id="article-id"
  data-type="article"
  data-label="article-label">

  <article-embed
    url="ARTICLE_URL">
  </article-embed>

</div>
```

Reference：

```html
<span
  class="article-ref"
  data-type="article"
  data-ref="article-label">
</span>
```

重要：

```text
article-embed → url
Reference Target → data-url
```

---

## Section

```html
<h3
  class="article-target"
  id="section-id"
  data-type="section"
  data-label="section-label">

  Section Title

</h3>

<p>
  Section body.
</p>
```

Reference：

```html
<span
  class="article-ref"
  data-type="section"
  data-ref="section-label">
</span>
```

---

# 41. 最重要ルール

Reference System を使うときは、まず次の対応だけ確認する。

```text
TARGET

class="article-target"
data-type="..."
data-label="..."
id="..."


REFERENCE

class="article-ref"
data-type="..."
data-ref="..."
```

そして、

```text
Target:
data-type="fig"
data-label="result"

Reference:
data-type="fig"
data-ref="result"
```

なら、

```text
fig:result
```

として対応する。

---

# 42. 一行で覚える Reference System

```text
Target を登録 → 番号を付ける → Display → Layout → Link → Navigation / Preview / Backlink
```

新しい Type を追加するときは、

```text
Core → Display → Layout → Preview → Bootstrap → Test
```

の順で確認する。

Article の場合は、

```text
article-embed(url)
    → Article Display
    → article-card
    → Article Loader
    → Article Card data
    → Reference Article Layout / Preview
```

という責務分離を維持する。
