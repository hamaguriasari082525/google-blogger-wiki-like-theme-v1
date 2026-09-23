// reference-display-section.js

(function () {
  "use strict";

  function getSectionNumber(target) {
    return target?.type === "section" && target.element
      ? target.element.dataset.contentsNumber || ""
      : "";
  }

  function updateTarget(target, number) {
    const display = target.element.querySelector(":scope > .article-reference-display");
    // if (display) display.textContent = number;
    if (display) display.textContent = "";
  }

  function updateReferences(target, number) {
    target.references.forEach(function (reference) {
      const link = reference.element.querySelector(":scope > .article-reference-link");
      if (link) link.textContent = number;
    });
  }

  function process() {
    const core = window.articleReferenceCore;
    if (!core) return;

    const state = core.getState();

    state.targets.forEach(function (target) {
      if (target.type !== "section") return;

      const number = getSectionNumber(target);
      if (!number) return;

      updateTarget(target, number);
      updateReferences(target, number);
    });
  }

  window.articleReferenceDisplaySection = { process: process };
})();
