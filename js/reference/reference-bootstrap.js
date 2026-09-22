// reference-bootstrap.js

(function () {
  "use strict";

  const state = { started: false, ready: false };

  function runModule(name, module) {
    if (!module || typeof module.process !== "function") {
      console.warn("[ReferenceBootstrap] Module not found: " + name);
      return;
    }

    try {
      module.process();
    } catch (error) {
      console.error("[ReferenceBootstrap] Module failed: " + name, error);
    }
  }

  function bootstrap() {
    if (state.started) return;

    state.started = true;
    console.log("[ReferenceBootstrap] START");

    [
      ["Reference Core", window.articleReferenceCore],
      ["Reference Display", window.articleReferenceDisplay],
      ["Reference Layout Fig", window.articleReferenceLayoutFig],
      ["Reference Layout Table", window.articleReferenceLayoutTable],
      ["Reference Layout Equation", window.articleReferenceLayoutEquation],
      ["Reference Layout Code", window.articleReferenceLayoutCode],
      ["Reference Layout Video", window.articleReferenceLayoutVideo],
      ["Reference Layout Article", window.articleReferenceLayoutArticle],
      ["Reference Link", window.articleReferenceLink],
      ["Reference Sup", window.articleReferenceSup],
      ["Reference Backlink", window.articleReferenceBacklink],
      ["Reference Error", window.articleReferenceError],
      ["Reference Preview", window.articleReferencePreview],
      ["Reference Navigation Binding", window.articleReferenceNavigationBinding],
      ["Reference Backlink Navigation", window.articleReferenceBacklinkNavigation],
      ["Reference Display Section", window.articleReferenceDisplaySection]
    ].forEach(([name, module]) => runModule(name, module));

    state.ready = true;
    console.log("[ReferenceBootstrap] READY");

    document.dispatchEvent(
      new CustomEvent("articleReferenceBootstrapReady", { detail: state })
    );

    console.log(
      "[ReferenceBootstrap] REGISTERED",
      window.articleReferenceBootstrap
    );
  }

  window.articleReferenceBootstrap = {
    process: bootstrap,
    getState: () => state
  };
})();
