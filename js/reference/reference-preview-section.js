// reference-preview-section.js

(function () {
  "use strict";

  function buildSectionPreview(target, content) {
    if (!target?.element) return;

    const clone = target.element.cloneNode(true);

    ["id", "data-type", "data-label", "data-backlink"]
      .forEach(attr => clone.removeAttribute(attr));

    clone.querySelectorAll("[id]")
      .forEach(element => element.removeAttribute("id"));

    clone.classList.remove("article-target");

    ["data-type", "data-label", "data-backlink"].forEach(attr => clone.removeAttribute(attr));

    const wrapper = document.createElement("div");
    wrapper.className = "article-reference-preview-section";
    wrapper.appendChild(clone);

    content.appendChild(wrapper);
  }

  function register() {
    if (!window.articleReferencePreview) {
      console.warn("[SectionPreview] Reference Preview not found.");
      return;
    }

    window.articleReferencePreview.register("section", buildSectionPreview);
  }

  window.articleSectionPreview = { register };
  register();
})();
