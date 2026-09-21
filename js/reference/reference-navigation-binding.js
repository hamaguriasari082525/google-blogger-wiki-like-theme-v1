// reference-navigation-binding.js

(function () {
  'use strict';
  function buildReferenceNavigation () {
    const core = window.articleReferenceCore;
    const navigation = window.articleReferenceNavigation;
    if (!core || !navigation) return;

    const references = core.getReferences ();

    references.forEach (function (reference) {
      if (
        !reference ||
        !reference.element ||
        !reference.target ||
        !reference.target.element
      )
        return;

      if (reference.element.closest ("[data-reference-preview-content='true']"))
        return;

      const link = reference.element.querySelector (
        ':scope > .article-reference-link'
      );
      if (!link) return;
      if (link.dataset.referenceNavigationApplied === 'true') return;

      link.addEventListener ('click', function (event) {
        event.preventDefault ();

        const display = reference.target.element.querySelector (
          '.article-reference-display'
        );
        if (!display) return;

        navigation.navigate (display);
      });

      link.dataset.referenceNavigationApplied = 'true';
    });
  }

  window.articleReferenceNavigationBinding = {
    process: buildReferenceNavigation,
  };
}) ();
