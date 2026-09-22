// reference-preview-article.js

(function () {
  'use strict';
  
  function cleanClone (clone) {
    clone.removeAttribute ('id');
    clone.removeAttribute ('data-type');
    clone.removeAttribute ('data-label');
    clone.removeAttribute ('data-backlink');

    clone.classList.remove ('article-target');

    clone.querySelectorAll ('[id]').forEach (function (element) {
      element.removeAttribute ('id');
    });

    clone.querySelectorAll ('[data-type]').forEach (function (element) {
      element.removeAttribute ('data-type');
    });

    clone.querySelectorAll ('[data-label]').forEach (function (element) {
      element.removeAttribute ('data-label');
    });

    clone.querySelectorAll ('[data-backlink]').forEach (function (element) {
      element.removeAttribute ('data-backlink');
    });
  }

  function buildArticlePreview (target, content) {
    if (!target || !target.element) {
      return;
    }

    const card = target.element.querySelector (':scope > .article-card');

    if (!card) {
      return;
    }

    const clone = card.cloneNode (true);

    cleanClone (clone);

    const wrapper = document.createElement ('div');

    wrapper.className = 'article-reference-preview-article';

    wrapper.appendChild (clone);

    content.appendChild (wrapper);
  }

  function register () {
    if (!window.articleReferencePreview) {
      console.warn ('[ArticlePreview] Reference Preview not found.');
      return;
    }

    window.articleReferencePreview.register ('article', buildArticlePreview);
  }

  window.articleArticlePreview = {
    register: register,
  };

  register ();
}) ();
