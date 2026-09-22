// reference-layout-article.js

(function () {
  'use strict';
  
  function buildArticleLayout () {
    const core = window.articleReferenceCore;

    if (!core) {
      console.warn ('[ReferenceLayoutArticle] Reference Core not found.');
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

      const display = target.element.querySelector (
        ':scope > .article-reference-display'
      );

      if (!display) {
        return;
      }

      const title = target.element.querySelector (
        ':scope > .article-card .article-card-title'
      );

      if (!title) {
        return;
      }

      title.insertBefore (display, title.firstChild);

      target.element.dataset.referenceLayoutApplied = 'true';
    });
  }

  window.articleReferenceLayoutArticle = {
    process: buildArticleLayout,
  };
}) ();
