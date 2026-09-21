
(function(){
"use strict";

// ==================================================
// Article Preview
// ==================================================
//
// このファイルはArticle Target専用のPreview Provider。
// 現時点では実装しない。
//
// Article Loader JSは既に別システムとして存在しているため、
// この記事Previewを作るためにArticle Loaderそのものを変更しない。
// ==================================================
//
// 現在の役割
// --------------------------------------------------
//
// article Target:
//
// <div class="article-target"
//      data-type="article"
//      data-label="article-a">
//
//   <article-ref
//     url="...">
//   </article-ref>
//
// </div>
//
// Reference:
//
// <span class="article-ref"
//       data-type="article"
//       data-ref="article-a"
//       data-preview="true"></span>
//
// Reference CoreはArticle Targetを通常のTargetとして扱う。
// Reference LinkもArticle TargetのHTML IDへ移動するだけ。
// URLによる外部遷移はReference Systemでは担当しない。
//
// Article Loaderはarticle-refのURLを使って記事を取得し、
// article-ref-cardを生成する。
// ==================================================
//
// 将来実装したいこと
// --------------------------------------------------
//
// Article Previewでは、Article Loaderが取得した記事情報を利用して、
// Referenceにホバーしたときに小型の記事Previewを表示する。
//
// 想定するPreview内容:
//
// ┌──────────────────────────────┐
// │                              │
// │        記事サムネイル         │
// │                              │
// ├──────────────────────────────┤
// │ 記事タイトル                 │
// │                              │
// │ meta                         │
// │                              │
// │ Abstractの冒頭               │
// │                              │
// └──────────────────────────────┘
//
// ==================================================
//
// 重要な設計方針
// --------------------------------------------------
//
// 1.
// Article Previewのために新しく記事をfetchしない。
//
// Article LoaderとPreview Providerが別々に同じURLを取得すると、
// 同じ記事を二重に読み込むことになるため避ける。
//
// 2.
// Article Loaderの既存処理を壊さない。
//
// Article Loaderは現在の仕組みを維持する。
// Preview Providerは、Article Loaderが生成した情報を
// 必要に応じて利用するだけにする。
//
// 3.
// Article LoaderとReference Previewの責務を分離する。
//
// Article Loader
//   ├─ URLから記事を取得
//   ├─ タイトル取得
//   ├─ Abstract取得
//   ├─ meta取得
//   ├─ 画像取得
//   └─ article-ref-card生成
//
// Article Preview
//   ├─ Preview要求を受け取る
//   ├─ 既に取得済みの記事情報を利用する
//   └─ 小型Previewを生成する
//
// 4.
// Reference CoreはArticle Previewの内容を知らない。
//
// CoreはTarget / Reference / Number / Relationshipだけを管理する。
// Previewは表示専用の別モジュールとして扱う。
//
// 5.
// Article Previewの表示内容はArticle Loaderの実装詳細に
// 強く依存しすぎないようにする。
//
// ==================================================
//
// 将来利用したい情報
// --------------------------------------------------
//
// Article Loaderで取得している:
//
// - title
// - abstract
// - meta
// - imageUrl
// - article-ref-card
//
// これらをPreviewに利用する予定。
//
// ==================================================
//
// 想定する処理の流れ
// --------------------------------------------------
//
// Reference
//     │
//     │ data-preview="true"
//     ▼
// reference-preview.js
//     │
//     │ data-type="article"
//     ▼
// reference-preview-article.js
//     │
//     │ 既に取得済みの記事情報を利用
//     ▼
// Article Preview生成
//
// ※ ここで新しいfetchを実行しない
//
// ==================================================
//
// 将来的な検討事項
// --------------------------------------------------
//
// - Article Loaderが取得した情報をどこに保持するか
// - article-ref-cardから安全に情報を取得できるか
// - Preview専用のデータオブジェクトを用意するか
// - Article LoaderからPreviewへイベントを送るか
// - Article Loader完了前にPreview要求が発生した場合の扱い
// - 読み込み中の表示
// - 読み込み失敗時の表示
// - 画像が存在しない記事の表示
// - Abstractが存在しない記事の表示
//
// ==================================================
//
// 特に重要
// --------------------------------------------------
//
// Article Previewは「記事をもう一度読み込む仕組み」ではなく、
// 「既にArticle Loaderが取得した記事情報をPreviewとして見せる仕組み」
// として設計する。
//
// Article Loaderの変更が必要になりそうな場合は、
// その場で無理に変更せず、まず連携方法を検討する。
//
// ==================================================
//
// 現時点ではProvider登録も行わない。
// reference-preview.js側から呼び出される実装は後で追加する。
//
// ==================================================

})();