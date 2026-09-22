// reference-layout-article.js

(function () {
  'use strict';

  function buildArticleLayout () {
    const core = window.articleReferenceCore;
    const display = window.articleReferenceDisplay;

    if (!core) {
      console.warn ('[ReferenceLayoutArticle] Reference Core not found.');

      return;
    }

    if (!display) {
      console.warn ('[ReferenceLayoutArticle] Reference Display not found.');

      return;
    }

    const state = core.getState ();

    state.targets.forEach (function (target) {
      if (!target || target.type !== 'article' || !target.element) {
        return;
      }

      if (target.element.dataset.referenceLayoutApplied === 'true') {
        return;
      }

      const title = target.element.querySelector (
        ':scope > .article-card-header > .article-card-title'
      );

      if (!title) {
        return;
      }

      const displayElement = target.element.querySelector (
        ':scope > .article-reference-display'
      );

      if (!displayElement) {
        return;
      }

      title.insertBefore (displayElement, title.firstChild);

      target.element.dataset.referenceLayoutApplied = 'true';
    });
  }

  window.articleReferenceLayoutArticle = {
    process: buildArticleLayout,
  };
}) ();
